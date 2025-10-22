"use client";

import React, { useState, useEffect } from "react";
import type { FormData, BarcodeData } from "@/lib/types/barcode";
import { QRCodeCanvas } from "qrcode.react";
import CryptoJS from "crypto-js";
import HmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";

const BarcodeGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    namaKaryawan: "",
    namaAlat: "",
    kodeAlat: "",
    tanggalKalibrasi: "",
    expiredKalibrasi: "",
    satuanKerja: "",
  });

  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;

  useEffect(() => {
    if (!formData.namaAlat.trim()) return;
  
    const nama = formData.namaAlat.trim().replace(/\s+/g, "").toUpperCase();
    const today = new Date();
    const tanggal = `${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  
    // Generate kode unik acak 4 karakter (huruf + angka)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
    // Format akhir: NAMAALAT-TANGGAL-RANDOM
    const kode = `${nama}-${tanggal}-${random}`;
  
    setFormData((prev) => ({
      ...prev,
      kodeAlat: kode,
    }));
  }, [formData.namaAlat]);
  
  const encryptAES = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };


  const validateForm = (): boolean => {
    if (!formData.namaKaryawan.trim()) {
      setError("Nama karyawan harus diisi");
      return false;
    }
    if (!formData.tanggalKalibrasi) {
      setError("Tanggal kalibrasi harus diisi");
      return false;
    }
    if (!formData.expiredKalibrasi) {
      setError("Tanggal expired harus diisi");
      return false;
    }
    if (!formData.satuanKerja.trim()) {
      setError("Satuan kerja harus diisi");
      return false;
    }
    if (
      new Date(formData.expiredKalibrasi) <= new Date(formData.tanggalKalibrasi)
    ) {
      setError("Tanggal expired harus setelah tanggal kalibrasi");
      return false;
    }
    return true;
  };

 
  const generateBarcode = (): void => {
    if (!validateForm()) return;

    const payload: BarcodeData = {
      nama: formData.namaKaryawan,
      namaAlat: formData.namaAlat,
      kodeAlat: formData.kodeAlat,
      tglKalibrasi: formData.tanggalKalibrasi,
      tglExpired: formData.expiredKalibrasi,
      satker: formData.satuanKerja,
      timestamp: Date.now(),
    };
    
    const signature = Base64.stringify(
      HmacSHA256(JSON.stringify(payload), SECRET_KEY)
    );
  
  
    const securedPayload = {
      ...payload,
      signature,
    };

 
    const jsonData = JSON.stringify(securedPayload);
    const encrypted = encryptAES(jsonData);

    
    setBarcodeData(encrypted);
  };


  const resetForm = (): void => {
    setFormData({
      namaKaryawan: "",
      namaAlat: "",
      kodeAlat: "",
      tanggalKalibrasi: "",
      expiredKalibrasi: "",
      satuanKerja: "",
    });
    setBarcodeData(null);
    setError("");
  };

const downloadBarcode = (): void => {
  if (!barcodeData) return;

  const qrCanvas = document.querySelector("canvas") as HTMLCanvasElement;
  if (!qrCanvas) return;

  const link = document.createElement("a");
  link.download = `qrcode_${formData.namaKaryawan.replace(/\s/g, "_")}_${Date.now()}.png`;
  link.href = qrCanvas.toDataURL("image/png");
  link.click();
};

const printBarcode = (): void => {
  if (!barcodeData) return;

  const qrCanvas = document.querySelector("canvas") as HTMLCanvasElement;
  if (!qrCanvas) return;

  const dataUrl = qrCanvas.toDataURL("image/png");

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const tglKalibrasi = new Date(formData.tanggalKalibrasi);
  const tglExpired = new Date(formData.expiredKalibrasi);
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Stiker Kalibrasi</title>
        <style>
          @media print {
            @page {
              size: 50mm 30mm; /* 5cm x 3cm stiker */
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          
          .sticker-container {
            width: 50mm;  /* 5cm */
            height: 30mm; /* 3cm */
            background: white;
            border: 1px dashed #ccc;
            display: flex;
            flex-direction: column;
            padding: 2mm;
            position: relative;
          }
          
          /* Header minimalis */
          .header {
            text-align: center;
            margin-bottom: 1mm;
          }
          
          .header-title {
            font-size: 8pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            color: #000;
          }
          
          /* Container utama: QR + Info */
          .content {
            display: flex;
            gap: 2mm;
            flex: 1;
          }
          
          /* QR Code - Square dan pas */
          .qr-section {
            width: 22mm; /* QR code kotak */
            height: 22mm;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ddd;
            background: white;
          }
          
          .qr-section img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          /* Info section - Kompak di sebelah QR */
          .info-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 6pt;
            line-height: 1.2;
          }
          
          .info-row {
            margin-bottom: 0.5mm;
          }
          
          .info-label {
            font-weight: bold;
            font-size: 5pt;
            color: #666;
            text-transform: uppercase;
          }
          
          .info-value {
            font-size: 6pt;
            color: #000;
            font-weight: 600;
            word-break: break-word;
          }
          
          /* Status indicator */
          .status-bar {
            height: 2mm;
            background: #4CAF50;
            border-radius: 1mm;
            margin-top: 0.5mm;
          }
          
          /* Footer mini */
          .footer {
            text-align: center;
            font-size: 4pt;
            color: #999;
            margin-top: 0.5mm;
            border-top: 0.5px solid #eee;
            padding-top: 0.5mm;
          }
          
          /* Print preview controls */
          .no-print {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
          }
          
          .print-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .print-btn:hover {
            background: #45a049;
          }
          
          /* Layout untuk multiple stickers (opsional) */
          .multiple-stickers {
            display: flex;
            flex-wrap: wrap;
            gap: 5mm;
            padding: 10mm;
          }
        </style>
      </head>
      <body>
        <!-- Print Button -->
        <div class="no-print">
          <button class="print-btn" onclick="window.print()">🖨️ Print Stiker</button>
        </div>
        
        <!-- Stiker Content -->
        <div class="sticker-container">
          <!-- Header Mini -->
          <div class="header">
            <div class="header-title">Kalibrasi</div>
          </div>
          
          <!-- Content: QR + Info -->
          <div class="content">
            <!-- QR Code Section -->
            <div class="qr-section">
              <img src="${dataUrl}" alt="QR Code" />
            </div>
            
            <!-- Info Section -->
            <div class="info-section">
              <div class="info-row">
                <div class="info-label">Alat</div>
                <div class="info-value">${formData.namaAlat || '-'}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Kode</div>
                <div class="info-value">${formData.kodeAlat || '-'}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Tgl Kal</div>
                <div class="info-value">${tglKalibrasi.toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}</div>
              </div>
              
              <div class="info-row">
                <div class="info-label">Expired</div>
                <div class="info-value">${tglExpired.toLocaleDateString('id-ID', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: '2-digit' 
                })}</div>
              </div>
              
            </div>
          </div>
            
        <script>
          // Auto print setelah load
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};


return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
    <div className="max-w-4xl mx-auto">
      {/* Header - Responsive */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 mb-4 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
            BC
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            Generator QR Code Kalibrasi
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Sistem QR code terenkripsi untuk data kalibrasi peralatan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Form Input - Responsive */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Data Kalibrasi
          </h2>
          
          {error && (
            <div className="mb-3 sm:mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-xs sm:text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            {/* Nama Karyawan */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Nama Karyawan
              </label>
              <input
                type="text"
                name="namaKaryawan"
                value={formData.namaKaryawan}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
                placeholder="Masukkan nama karyawan"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zm5 14v-4m0-4V6" />
                </svg>
                Nama Alat
              </label>
              <input
                type="text"
                name="namaAlat"
                value={formData.namaAlat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
                placeholder="Masukkan nama alat"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16M8 4v16M12 4v16M16 4v16M20 4v16" />
                </svg>
                Kode Alat
              </label>
              <input
                type="text"
                name="KodeAlat"
                value={formData.kodeAlat}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
                placeholder="Kode alat akan ter-generate otomatis"
              />
            </div>

            {/* Tanggal Kalibrasi */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Tanggal Kalibrasi
              </label>
              <input
                type="date"
                name="tanggalKalibrasi"
                value={formData.tanggalKalibrasi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
              />
            </div>

            {/* Expired Kalibrasi */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Tanggal Expired
              </label>
              <input
                type="date"
                name="expiredKalibrasi"
                value={formData.expiredKalibrasi}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
              />
            </div>

            {/* Satuan Kerja */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Satuan Kerja
              </label>
              <input
                type="text"
                name="satuanKerja"
                value={formData.satuanKerja}
                onChange={handleInputChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
                placeholder="Masukkan satuan kerja"
              />
            </div>

            {/* Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                onClick={generateBarcode}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate QR Code
              </button>
              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Display - Responsive */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Hasil QR Code
          </h2>
          
          {barcodeData ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50 flex justify-center items-center">
                <QRCodeCanvas 
                  value={barcodeData} 
                  size={window.innerWidth < 640 ? 200 : 300} 
                  includeMargin={true} 
                />
              </div>
              
              {/* Info - Responsive */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <p className="font-medium text-blue-900">Informasi QR Code:</p>
                <div className="space-y-1 text-blue-800">
                  <p className="break-words">• Nama: {formData.namaKaryawan}</p>
                  <p>• Tgl Kalibrasi: {new Date(formData.tanggalKalibrasi).toLocaleDateString('id-ID')}</p>
                  <p>• Tgl Expired: {new Date(formData.expiredKalibrasi).toLocaleDateString('id-ID')}</p>
                  <p className="break-words">• Satuan Kerja: {formData.satuanKerja}</p>
                </div>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={printBarcode}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={downloadBarcode}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-10 md:p-12 text-center">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-xs sm:text-sm md:text-base px-2">
                QR Code akan muncul di sini setelah Anda mengisi form dan menekan tombol Generate
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Footer - Responsive */}
      <div className="mt-4 md:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs sm:text-sm text-yellow-800">
            <p className="font-medium mb-1">Catatan Keamanan:</p>
            <p>QR code ini menggunakan enkripsi khusus dan hanya dapat dibaca oleh scanner aplikasi sistem kami. Data di dalam QR code telah terenkripsi untuk keamanan. <br />
            Segala bentuk penyalahgunaan data merupakan tanggung jawab pemilik data atau penginput QR Code
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
    };
    
    export default BarcodeGenerator;
