"use client";

import React, { useState } from "react";
import type { Alat } from "@/lib/types/AlatFaskes";

type Props = {
  initial?: Alat[];
  wilayahId: string;
  onClose: () => void;
  onSave: (payload: Alat[]) => void;
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

  const handleChange = <K extends keyof Alat>(
    index: number,
    field: K,
    value: Alat[K]
  ) => {
    setAlatList((prev) =>
      prev.map((item, i) =>
        i === index ? ({ ...item, [field]: value } as Alat) : item
      )
    );
  };

  const handleAdd = () => {
    setAlatList([
      ...alatList,
      {
        id: `a${Date.now()}`,
        nama: "",
        jumlah: 1,
        tanggalKalibrasi: "",
        tanggalExpired: "",
        satuanKerja: "",
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const newList = [...alatList];
    newList.splice(index, 1);
    setAlatList(newList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `alat_${wilayahId}`;
    const existing = localStorage.getItem(key);
    let storedList: Alat[] = existing ? JSON.parse(existing) : [];

    alatList.forEach((a) => {
      const index = storedList.findIndex((s) => s.id === a.id);
      if (index >= 0) storedList[index] = a;
      else storedList.push(a);
    });

    localStorage.setItem(key, JSON.stringify(storedList));
    onSave(alatList);
  };

  const isDisabled = !wilayahId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="bg-white text-black rounded-xl w-full max-w-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
          Tambah / Edit Alat
        </h3>

        {!wilayahId && (
          <p className="text-center text-gray-500 italic mb-4">
            Pilih satuan kerja terlebih dahulu untuk menambahkan alat.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {alatList.map((alat, i) => (
            <div
              key={alat.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border-b pb-3"
            >
              {/* Nama Alat */}
              <div className="sm:col-span-7">
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
              <div className="sm:col-span-3">
                <label className="text-sm block mb-1">Jumlah</label>
                <input
                  type="number"
                  min={1}
                  value={alat.jumlah}
                  onChange={(e) =>
                    handleChange(i, "jumlah", Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="0"
                  required
                  disabled={isDisabled}
                />
              </div>

              {/* Tombol Add/Remove */}
              <div className="sm:col-span-2 flex justify-start sm:justify-end pt-2 sm:pt-6">
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

          {/* Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Tanggal Kalibrasi</label>
              <input
                type="date"
                value={alatList[0].tanggalKalibrasi}
                onChange={(e) =>
                  handleChange(0, "tanggalKalibrasi", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isDisabled}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Tanggal Expired</label>
              <input
                type="date"
                value={alatList[0].tanggalExpired}
                onChange={(e) =>
                  handleChange(0, "tanggalExpired", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
