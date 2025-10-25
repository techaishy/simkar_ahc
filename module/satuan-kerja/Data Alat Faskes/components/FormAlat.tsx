"use client";

import React, { useState } from "react";
import type { Alat } from "@/lib/types/AlatFaskes";

type Props = {
  initial?: Alat[];
  wilayahId: string;
  onClose: () => void;
  onSave: (payload: Alat[]) => void; 
  mode?: "add" | "edit";
};

export default function FormAlat({ initial = [], wilayahId, onClose, onSave }: Props) {
  const [alatList, setAlatList] = useState<Alat[]>(
    initial.length
      ? initial
      : [
          {
            id: `a${Date.now()}`,
            nama: "",
            jumlah: 1,
            tanggalKalibrasi: "",
            tanggalExpired: "",
            satuanKerja: "",
          },
        ]
  );
  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof Alat>(index: number, field: K, value: Alat[K]) => {
    setAlatList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAdd = () => {
    setAlatList([
      ...alatList,
      {
        id: `a${Date.now()}`,
        nama: "",
        jumlah: 1,
        tanggalKalibrasi: alatList[0].tanggalKalibrasi,
        tanggalExpired: alatList[0].tanggalExpired,
        satuanKerja: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setAlatList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wilayahId) return;

    setLoading(true);
    try {
      const payload = alatList.map((a) => ({
        nama_alat: a.nama.trim(),
        jumlah: a.jumlah,
        tanggalKalibrasi: a.tanggalKalibrasi,
        tanggalExpired: a.tanggalExpired,
      }));

      const res = await fetch("/api/satuan-kerja/data-alat/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lokasiId: wilayahId, alatList: payload }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menambahkan alat");

      const newData: Alat[] = json.added.map((x: any, i: number) => ({
        id: `${x.nama_alat}-${wilayahId}-${i}`,
        nama: x.nama_alat,
        jumlah: x.wilayahKerja.unit,
        tanggalKalibrasi: x.wilayahKerja.tanggalKalibrasi,
        tanggalExpired: x.wilayahKerja.tanggal_expired,
      }));

      onSave(newData);
      onClose();
    } catch (err: any) {
      console.error("❌ Gagal tambah alat:", err);
      alert(err.message || "Gagal menambahkan alat");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !wilayahId || loading;

  return (
    <div className=" inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {!wilayahId && (
        <p className="text-center text-gray-500 italic mb-6">
          Pilih satuan kerja terlebih dahulu untuk menambahkan alat.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 ">
        {alatList.map((alat, i) => (
          <div
            key={alat.id}
            className="grid grid-cols-12 gap-4 gap-y-4 items-end border-b pb-4"
          >
            {/* Nama Alat */}
            <div className="col-span-3">
              <label className="text-sm block mb-1">Nama Alat</label>
              <input
                type="text"
                value={alat.nama}
                onChange={(e) => handleChange(i, "nama", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Masukkan nama alat"
                required
                disabled={isDisabled}
              />
            </div>

            {/* Jumlah */}
            <div className="col-span-2">
              <label className="text-sm block mb-1">Jumlah</label>
              <input
                type="number"
                min={1}
                value={alat.jumlah}
                onChange={(e) => handleChange(i, "jumlah", Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
                required
                disabled={isDisabled}
              />
            </div>

            {/* Tanggal Kalibrasi */}
            <div className="col-span-3">
              <label className="text-sm block mb-1">Tanggal Kalibrasi</label>
              <input
                type="date"
                value={alat.tanggalKalibrasi}
                onChange={(e) =>
                  handleChange(i, "tanggalKalibrasi", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isDisabled}
              />
            </div>

            {/* Tanggal Expired */}
            <div className="col-span-3">
              <label className="text-sm block mb-1">Tanggal Expired</label>
              <input
                type="date"
                value={alat.tanggalExpired}
                onChange={(e) =>
                  handleChange(i, "tanggalExpired", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isDisabled}
              />
            </div>

            {/* Tombol + / - di ujung kanan */}
            <div className="col-span-1 ">
              {i === 0 ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-md ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  +
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-md ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Tombol Batal / Simpan */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-400 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full sm:w-auto px-4 py-2 rounded-md ${
              isDisabled
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );

}