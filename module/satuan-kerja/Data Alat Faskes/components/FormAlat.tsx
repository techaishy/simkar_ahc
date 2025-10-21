"use client";

import React, { useState } from "react";
import type { Alat } from "@/lib/types/AlatFaskes";

type Props = {
  initial?: Alat;
  wilayahId: string; 
  onClose: () => void;
  onSave: (payload: Alat) => void;
};

export default function FormAlat({ initial, wilayahId, onClose, onSave }: Props) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [jumlah, setJumlah] = useState(initial?.jumlah ?? 1);
  const [tanggalKalibrasi, setTglKalibrasi] = useState(initial?.tanggalKalibrasi ?? "");
  const [tanggalExpired, setTglExpired] = useState(initial?.tanggalExpired ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Alat = {
      id: initial?.id ?? `a${Date.now()}`,
      nama,
      jumlah,
      tanggalKalibrasi,
      tanggalExpired,
      satuanKerja: ""
    };

    // --- Simpan ke localStorage ---
    const key = `alat_${wilayahId}`;
    const existing = localStorage.getItem(key);
    let alatList: Alat[] = existing ? JSON.parse(existing) : [];

    if (initial) {
      alatList = alatList.map((a) => (a.id === payload.id ? payload : a));
    } else {
      alatList.push(payload);
    }

    localStorage.setItem(key, JSON.stringify(alatList));
  

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white text-black rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-4">
          {initial ? "Edit Alat" : "Tambah Alat"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Alat */}
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

          {/* Jumlah Unit */}
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

          {/* Tanggal Kalibrasi */}
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

          {/* Tanggal Expired */}
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

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
