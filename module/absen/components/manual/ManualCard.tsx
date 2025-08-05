"use client";

import { useEffect, useState } from "react";
import {
  IdentificationIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang";
  onSubmit?: (data: {
    nama: string;
    jabatan: string;
    lokasi: string;
    waktu: string;
    keterangan: string;
  }) => void;
};

export default function ManualCard({ onClose, tipe, onSubmit }: Props) {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [waktu, setWaktu] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // format: "YYYY-MM-DDTHH:mm"
  });
  const [lokasi, setLokasi] = useState("Mengambil lokasi...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        setLokasi(`${lat}, ${lon}`);
      },
      () => {
        setLokasi("Gagal mendapatkan lokasi");
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama atau kode harus diisi.");
      return;
    }

    onSubmit?.({
      nama,
      jabatan,
      lokasi,
      waktu,
      keterangan,
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white border border-gray-300 rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">

        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-white hover:bg-red-600 transition p-1 rounded"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <IdentificationIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800 text-center">
            Absen {tipe === "masuk" ? "Masuk" : "Pulang"} (Manual)
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
      Nama Pegawai
    </label>
          <input
            type="text"
            placeholder="Masukkan nama atau kode"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              setError(null);
            }}
            className="w-full p-2 border border-gray-900 rounded text-sm"
          />
          </div>

          <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
      Jabatan
    </label>
          <input
            type="text"
            placeholder="Masukkan jabatan"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            className="w-full p-2 border border-gray-900 rounded text-sm"
          />
          </div>

<div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
      Waktu Absen
    </label>
          <input
            type="datetime-local"
            value={waktu}
            onChange={(e) => setWaktu(e.target.value)}
            className="w-full p-2 border border-gray-900 rounded text-sm"
          />
          /</div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
      Keterangan
    </label>
          <textarea
            placeholder="Tambahkan keterangan (opsional)"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full p-2 border border-gray-900 rounded text-sm"
            rows={3}
          />
</div>

          {error && (
            <div className="text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-2">
              {error}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPinIcon className="h-5 w-5" />
            Lokasi: {lokasi}
          </div>

          <button
            type="submit"
            className="w-full px-5 py-2 rounded-md text-white font-semibold bg-black hover:bg-gray-800 transition"
          >
            Kirim Absen Manual
          </button>
        </form>
      </div>
    </div>
  );
}

