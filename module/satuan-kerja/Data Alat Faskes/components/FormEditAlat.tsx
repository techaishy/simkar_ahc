"use client";

import React, { useState } from "react";
import type { Alat } from "@/lib/types/AlatFaskes";

type Props = {
  initial?: Alat;
  wilayahId: string; 
  onClose: () => void;
  onSave: (payload: Alat) => void;
};

export default function FormEditAlat({ initial, wilayahId, onClose, onSave }: Props) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [jumlah, setJumlah] = useState(initial?.jumlah ?? 1);
  const [tanggalKalibrasi, setTglKalibrasi] = useState(initial?.tanggalKalibrasi ?? "");
  const [tanggalExpired, setTglExpired] = useState(initial?.tanggalExpired ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/satuan-kerja/data-alat/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lokasiId: wilayahId,
          nama_alat: nama,
          jumlah,
          tanggalKalibrasi,
          tanggalExpired,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update alat");

      onSave({
        id: initial?.id ?? `a${Date.now()}`,
        nama: data.nama_alat,
        jumlah: data.jumlah,
        tanggalKalibrasi: data.tanggalKalibrasi,
        tanggalExpired: data.tanggalExpired,
        satuanKerja: "",
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
      console.error("❌ Update alat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gradient-to-br from-black via-gray-950 to-gray-800 rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-4">
          {initial ? "Edit Alat" : "Tambah Alat"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Nama Alat</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan nama alat"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Jumlah Unit</label>
            <input
              type="number"
              min={0}
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Jumlah unit"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Tanggal Kalibrasi</label>
            <input
              type="date"
              value={tanggalKalibrasi}
              onChange={(e) => setTglKalibrasi(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Tanggal Expired</label>
            <input
              type="date"
              value={tanggalExpired}
              onChange={(e) => setTglExpired(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
