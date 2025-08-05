"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import {
  CameraIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onClose: () => void;
  onScanSuccess: (code: string) => void;
};

export default function BarcodeCard({ onClose, onScanSuccess }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanBoxId = "barcode-scan-box";

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        if (devices.length === 0) {
          setError("Kamera tidak tersedia.");
          return;
        }

        const scanner = new Html5Qrcode(scanBoxId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isMounted && !scannedCode) {
              setScannedCode(decodedText);
              onScanSuccess(decodedText);
              // Opsional: otomatis hentikan scanner saat berhasil
              scanner.stop().then(() => scanner.clear());
            }
          },
          (errorMessage) => {
            console.warn("Scan error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Scanner init error:", err);
        if (isMounted) {
          setError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      const scanner = scannerRef.current;
      if (scanner?.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      }
    };
  }, [onScanSuccess, scannedCode]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white/90 border border-gray-300 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 transition p-1 rounded"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <CameraIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Scan Barcode
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded-md p-2 text-sm mb-3">
            <XCircleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Scanner Area */}
        <div className="w-full aspect-[4/3] bg-black border border-gray-400 rounded-lg overflow-hidden">
          <div id={scanBoxId} className="w-full h-full" />
        </div>

        {/* Status Button */}
        <button
          disabled
          className="w-full px-5 py-2 mt-4 rounded-md text-white font-semibold bg-green-600 cursor-not-allowed"
        >
          {scannedCode ? "Barcode Terdeteksi" : "Scan"}
        </button>
      </div>
    </div>
  );
}
``