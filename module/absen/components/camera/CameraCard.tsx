"use client";

import { useRef, useState, useEffect } from "react";
import {
  CameraIcon,
  XMarkIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onClose: () => void;
};

export default function CameraCard({ onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const handleClose = () => {
    handleStopCamera();
    onClose();
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const imageData = canvasRef.current.toDataURL("image/png");
    setPhoto(imageData);
    // Di sinilah kamu bisa mengirim gambar ke backend jika mau
    // Contoh: uploadImage(imageData);
    alert("Foto selfie berhasil diambil!");
  };

  useEffect(() => {
    handleStartCamera();
    return () => {
      handleStopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white/90 border border-gray-300 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto">
        {/* Tombol Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 transition p-1 rounded"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <CameraIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Kamera Selfie
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded-md p-2 text-sm mb-3">
            <XCircleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Video + Tombol */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-black border border-gray-400 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <button
            onClick={handleCapture}
            className="w-full px-5 py-2 rounded-md text-white font-semibold transition duration-200 bg-green-600 hover:bg-green-700"
          >
            Absen
          </button>
        </div>

        {/* Preview */}
        {/* {photo && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Hasil Selfie:</p>
            <img
              src={photo}
              alt="Selfie"
              className="rounded-md w-full border border-gray-300"
            />
          </div>
        )} */}
      </div>
    </div>
  );
}
