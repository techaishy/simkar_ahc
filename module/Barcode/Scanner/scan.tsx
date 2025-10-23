"use client"

import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import CryptoJS from 'crypto-js';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';
import AlertMessage from '@/components/ui/alert';
import { useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';


interface DecodedData {
  nama: string;
  namaAlat: string;
  kodeAlat: string;
  tglKalibrasi: string;
  tglExpired: string;
  satker: string;
  timestamp: number;
  signature?: string; 
}


interface ScanResult {
  data: Omit<DecodedData, 'signature'>;
  status: 'valid' | 'expired' | 'warning';
  daysRemaining: number;
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const QRCodeScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannedList, setScannedList] = useState<string[]>([]);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'info',
    message: ''
  });


  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'DEFAULT_KALIBRASI_KEY_DEV';

  

  const tryDecryptAndVerify = (encryptedText: string): DecodedData => {
    let decryptedUtf8: string;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      decryptedUtf8 = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedUtf8) throw new Error('Decrypted empty');
    } catch (e) {
      throw new Error('Dekripsi AES gagal');
    }

    // 2) parse
    let parsed: DecodedData;
    try {
      parsed = JSON.parse(decryptedUtf8);
    } catch (e) {
      throw new Error('Parsing JSON gagal setelah dekripsi');
    }

    const signature = parsed.signature;
    if (!signature) throw new Error('Signature tidak ditemukan');

  
    const { signature: _sig, ...payloadWithoutSig } = parsed;
    const recomputed = Base64.stringify(HmacSHA256(JSON.stringify(payloadWithoutSig), SECRET_KEY));

    if (recomputed !== signature) {
      throw new Error('Verifikasi signature gagal (data mungkin dimodifikasi)');
    }

    return parsed;
  };

  const startCamera = async (): Promise<void> => {
    try {
      setError('');
      setIsScanning(true); 
  
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
        setStream(mediaStream);
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
      console.error('Camera error:', err);
    }
  };
  

  const stopCamera = (): void => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureAndScan = useCallback ((): void => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    

    if (video.readyState < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // scale canvas to reasonable size to speed up jsQR
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    // set canvas to same aspect but cap max size
    const MAX_DIM = 800;
    let targetW = width;
    let targetH = height;
    if (Math.max(width, height) > MAX_DIM) {
      const scale = MAX_DIM / Math.max(width, height);
      targetW = Math.round(width * scale);
      targetH = Math.round(height * scale);
    }

    canvas.width = targetW;
    canvas.height = targetH;
    ctx.drawImage(video, 0, 0, targetW, targetH);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
      if (code && code.data) {
        processQRData(code.data);
        stopCamera();
      }
    } catch (e) {
      console.error('capture error', e);
    }
  }, []);

  

  // Scan QR from uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // constrain size to speed up
        const MAX_DIM = 1200;
        let w = img.width;
        let h = img.height;
        if (Math.max(w, h) > MAX_DIM) {
          const scale = MAX_DIM / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });

        if (code && code.data) {
          processQRData(code.data);
        } else {
          setError('❌ QR Code tidak terbaca dari gambar.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Manual input untuk demo
  const handleManualInput = (): void => {
    const encryptedInput = prompt('Masukkan data QR terenkripsi:');
    if (encryptedInput) {
      processQRData(encryptedInput);
    }
  };

  // Process QR data: decrypt, verify signature, validate fields, expired check
  const processQRData = (encryptedData: string): void => {
    try {
      setError('');
      // decrypt + verify
      const decrypted = tryDecryptAndVerify(encryptedData);
  
      // validate fields
      if (!decrypted.nama || !decrypted.tglKalibrasi || !decrypted.tglExpired || !decrypted.satker) {
        throw new Error('Format data tidak valid');
      }
  
      // bikin ID unik dari signature (paling aman)
      const uniqueId = decrypted.signature;
      if (scannedList.includes(uniqueId!)) {
        throw new Error('⚠️ QR Code ini sudah pernah discan (duplicate)');
      } else {
        setScannedList(prev => [...prev, uniqueId!]);
      }
      
      const today = new Date();
      const expiredDate = new Date(decrypted.tglExpired);
      const daysRemaining = Math.ceil((expiredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

       // BLOCK EXPIRED QR CODE - Show alert and stop processing
       if (daysRemaining < 0) {
        const expiredDays = Math.abs(daysRemaining);
        
        setAlert({
          show: true,
          type: 'error',
          message: `QR Code EXPIRED!\n\nKalibrasi sudah kadaluarsa ${expiredDays} hari yang lalu.\n\nAlat: ${decrypted.namaAlat}\nKode: ${decrypted.kodeAlat}\nExpired: ${expiredDate.toLocaleDateString('id-ID')}\n\n⚠️ SEGERA LAKUKAN KALIBRASI ULANG!\n\nQR Code ini tidak dapat digunakan.`
        });

        setError(`QR Code EXPIRED - Kalibrasi sudah kadaluarsa ${expiredDays} hari yang lalu. Segera lakukan kalibrasi ulang!`);
        return; // Stop processing, don't show result
      }

      let status: 'valid' | 'expired' | 'warning';
      if (daysRemaining < 0) status = 'expired';
      else if (daysRemaining <= 30){ status = 'warning';
      setAlert({
        show: true,
        type: 'warning',
        message: `PERINGATAN KALIBRASI!\n\nKalibrasi akan berakhir dalam ${daysRemaining} hari lagi.\n\nAlat: ${decrypted.namaAlat}\nKode: ${decrypted.kodeAlat}\nExpired: ${expiredDate.toLocaleDateString('id-ID')}\n\n Rencanakan kalibrasi ulang segera!`
      });
    }  else {status = 'valid';
      setAlert({
        show: true,
        type: 'success',
        message: `QR Code Valid!\n\nKalibrasi masih berlaku ${daysRemaining} hari lagi.\n\nAlat: ${decrypted.namaAlat}\nKode: ${decrypted.kodeAlat}`
      });}

      const { signature, ...payloadNoSig } = decrypted;
      setScanResult({
        data: payloadNoSig,
        status,
        daysRemaining,
      });
    } catch (err: any) {
      setScanResult(null);
      setError(err?.message || 'QR Code tidak valid atau data rusak. Pastikan QR Code berasal dari sistem kami.');
      console.error('Decode error:', err);

      setAlert({
        show: true,
        type: 'error',
        message: err?.message || 'QR Code tidak valid atau rusak!'
      });
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  useEffect(() => {
    if (!isScanning) return;
  
    const interval = setInterval(() => {
      captureAndScan();
    }, 700); 
  
    return () => clearInterval(interval);
  }, [isScanning]);

  const resetScanner = (): void => {
    setScanResult(null);
    setError('');
    stopCamera();
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };
 
  return (
    <>

        <AlertMessage
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={handleCloseAlert}
        duration={5000}
      />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Responsive */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
              SC
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
              Scanner QR Code Kalibrasi
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Scan QR code untuk melihat informasi kalibrasi
          </p>
        </div>
  
        {!scanResult ? (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {/* Scanner Area - Responsive */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Scan QR Code
              </h2>
  
              {error && (
                <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 text-xs sm:text-sm">{error}</span>
                </div>
              )}
  
              {/* Camera View - Responsive */}
              
              {isScanning ? (
  <div className="space-y-3 sm:space-y-4">
  <div className="relative border-2 border-purple-500 rounded-lg overflow-hidden bg-black flex justify-center items-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover rounded-lg"
    />
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div
        className="border-4 border-cyan-400 border-dashed rounded-xl opacity-90"
        style={{
          width: 'clamp(200px, 80vw, 400px)',
          height: 'clamp(200px, 80vw, 400px)',
          maxHeight: '80%',
        }}
      ></div>
    </div>
    <div className="absolute bottom-12 left-0 right-0 text-center text-white text-sm pointer-events-none px-4">
      Tempatkan QR Code di dalam kotak
    </div>
  </div>

  <button
    onClick={stopCamera}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
  >
    Stop Camera
  </button>
</div>

)  : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-10 md:p-12 text-center bg-gray-50">
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-2 sm:mb-4">
                      Pilih metode scan QR code
                    </p>
                  </div>
  
                  {/* Buttons - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    <button
                      onClick={startCamera}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="hidden xs:inline">Buka Kamera</span>
                      <span className="xs:hidden">Kamera</span>
                    </button>
  
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden xs:inline">Upload Gambar</span>
                      <span className="xs:hidden">Upload</span>
                    </button>
  
                    <button
                      onClick={handleManualInput}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden xs:inline">Input Manual</span>
                      <span className="xs:hidden">Manual</span>
                    </button>
                  </div>
  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
  
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        ) : (
          /* Result Display - Responsive */
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Hasil Scan
              </h2>
              <button
                onClick={resetScanner}
                className="w-full sm:w-auto text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Scan Lagi
              </button>
            </div>
  
            {/* Status Badge - Responsive */}
            <div className="mb-4 sm:mb-6">
              {scanResult.status === 'valid' && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-2 sm:gap-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-green-900 text-base sm:text-lg">STATUS: VALID</p>
                    <p className="text-green-700 text-xs sm:text-sm">
                      Kalibrasi masih berlaku ({scanResult.daysRemaining} hari lagi)
                    </p>
                  </div>
                </div>
              )}
              
              {scanResult.status === 'warning' && (
                <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-2 sm:gap-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-bold text-yellow-900 text-base sm:text-lg">STATUS: PERINGATAN</p>
                    <p className="text-yellow-700 text-xs sm:text-sm">
                      Segera lakukan kalibrasi ulang ({scanResult.daysRemaining} hari lagi)
                    </p>
                  </div>
                </div>
              )}
              
              {scanResult.status === 'expired' && (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-2 sm:gap-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-red-900 text-base sm:text-lg">STATUS: EXPIRED</p>
                    <p className="text-red-700 text-xs sm:text-sm">
                      Kalibrasi sudah kadaluarsa ({Math.abs(scanResult.daysRemaining)} hari yang lalu)
                    </p>
                  </div>
                </div>
              )}
            </div>
  
            {/* Data Details - Responsive */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">
                Detail Informasi Kalibrasi
              </h3>
              
              <div className="grid gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Nama Karyawan</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {scanResult.data.nama}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14v-4m0-4V6" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Nama Alat</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {scanResult.data.namaAlat}
                    </p>
                  </div>
                </div>

                 <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Kode Alat</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {scanResult.data.kodeAlat}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Tanggal Kalibrasi</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {new Date(scanResult.data.tglKalibrasi).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Tanggal Expired</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {new Date(scanResult.data.tglExpired).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Satuan Kerja</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {scanResult.data.satker}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-start gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Waktu Generate</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                      {new Date(scanResult.data.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Info Footer - Responsive */}
        <div className="mt-4 md:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs sm:text-sm text-blue-800">
              <p className="font-medium mb-1">Catatan:</p>
              <p>Gunakan kamera untuk scan QR code secara otomatis, atau upload gambar QR code dari galeri Anda.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default QRCodeScanner;
