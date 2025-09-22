"use client";

import { useRef, useState, useEffect } from "react";
import { CameraIcon, XMarkIcon,  ArrowPathIcon } from "@heroicons/react/24/outline";
import { formatTimeWIB, nowWIB, formatDateTimeWIB } from "@/lib/timezone";

type Props = {
  userId: string;  
  onClose: () => void;
  tipe: "masuk" | "pulang";
  onSubmit?: (fotoOrData?: any) => Promise<void>;
  onSubmitSuccess?: () => void;
};

export default function CameraCard({userId, onClose, tipe, onSubmit }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  // Ambil lokasi GPS
  const requestLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });

        try {
          const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
          if (!apiKey) return;
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=id`
          );
          const data = await res.json();
          let formatted = data?.results?.[0]?.formatted || null;
          if (formatted?.toLowerCase().startsWith("unnamed road,")) {
            formatted = formatted.replace(/^Unnamed road,\s*/i, "");
          }
          setLocationName(formatted);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
      (err) => {
        console.error("Gagal mendapatkan lokasi:", err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsActive(true);
      setError(null);
    } catch (err) {
      setError("Gagal mengakses kamera. Pastikan izin telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const takePhoto = async () => {
    if (!videoRef.current || !location) {
      alert("Lokasi belum tersedia. Harap aktifkan GPS atau tunggu beberapa detik.");
      return;
    }

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const MAX_WIDTH = 800;
    const scale = MAX_WIDTH / video.videoWidth;
    canvas.width = MAX_WIDTH;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const now = new Date();
    const timestamp = now.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const texts = [
      `Lat: ${location.lat.toFixed(5)}, Lon: ${location.lng.toFixed(5)}`,
      locationName || "Lokasi tidak ditemukan",
      timestamp,
    ];

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "white";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    texts.forEach((text, i) => {
      const y = canvas.height - 10 - i * 22;
      ctx.strokeText(text, 10, y);
      ctx.fillText(text, 10, y);
    });

    const photoData = canvas.toDataURL("image/jpeg", 0.6);
    setPhoto(photoData);

    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
    requestLocation();
  };

  const handleSubmit = async () => {
  if (!photo || !location) {
    setError("Foto atau lokasi tidak tersedia.");
    return;
  }
  try {
    const payload = {
      userId,
      date: new Date().toISOString(),
      clockIn: tipe === "masuk" ? formatTimeWIB(nowWIB(), "HH:mm:ss") : null,
      clockOut: tipe === "pulang" ? formatTimeWIB(nowWIB(), "HH:mm:ss") : null,
      photoIn: tipe === "masuk" ? photo : null,
      photoOut: tipe === "pulang" ? photo : null,
      latitude: location.lat,
      longitude: location.lng,
      location: locationName,
    };

    console.log("📤 Data yang akan dikirim:", payload);

    const res = await fetch("/api/presensi/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📥 Response dari API:", data);
    if (!res.ok) throw new Error(data.error || "Gagal submit presensi");
    alert(`✅ Presensi ${tipe} berhasil`);
    onClose();
  } catch (err) {
    console.error(err);
    alert(`❌ Gagal submit: ${(err as Error).message}`);
  }
};
  useEffect(() => {
    startCamera();
    requestLocation();
    return () => stopCamera();
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
            Kamera Selfie ({tipe})
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 rounded-md p-2 text-sm mb-3">
            <XMarkIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Video / Foto */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-black border border-gray-400 rounded-lg overflow-hidden relative">
            {!photo ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            )}

            {/* Tombol Capture / Retake */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              {!photo ? (
                <button
                  onClick={takePhoto}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                >
                  <CameraIcon className="h-6 w-6" />
                </button>
              ) : (
                <button
                  onClick={retakePhoto}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                >
                  <ArrowPathIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>

          {/* Tombol Submit */}
          {photo && (
            <button
              onClick={handleSubmit}
              className={`w-full px-5 py-2 rounded-md text-white font-semibold transition duration-200 ${
                tipe === "masuk" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {tipe === "masuk" ? "Absen Masuk" : "Absen Pulang"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
