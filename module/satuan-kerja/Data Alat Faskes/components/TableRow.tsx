"use client";

import React from "react";
import type { Wilayah } from "@/module/satuan-kerja/Data Alat Faskes/DataAlatPage";
import { Pencil, Trash2 } from "lucide-react";
import { Alat } from "@/lib/types/AlatFaskes";

type Props = {
  alat: Alat;
  selectedWilayah: Wilayah | null;
  onEdit: (a: Alat) => void;
  onDeleteConfirm: (a: Alat) => void;
};

export default function TableRow({
  alat,
  selectedWilayah,
  onEdit,
  onDeleteConfirm,
}: Props) {
  const disabled = !selectedWilayah || selectedWilayah.id === "all";

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">{alat.nama}</td>
      <td className="px-4 py-3 text-center">{alat.jumlah}</td>
      <td className="px-4 py-3 text-center">
        {disabled ? (
          <span className="text-sm text-gray-400">
            Pilih satuan kerja dahulu
          </span>
        ) : (
          alat.tanggalKalibrasi ?? "-"
        )}
      </td>
      <td className="px-4 py-3 text-center">
        {disabled ? (
          <span className="text-sm text-gray-400">
            Pilih satuan kerja dahulu
          </span>
        ) : (
          alat.tanggalExpired ?? "-"
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          {/* Tombol Edit */}
          <button
            onClick={() => !disabled && onEdit(alat)}
            disabled={disabled}
            className={`px-3 py-1 rounded-md border text-sm transition-colors ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600 border-green-600"
            }`}
            title={disabled ? "Pilih satuan kerja dahulu" : "Edit"}
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => !disabled && onDeleteConfirm(alat)}
            disabled={disabled}
            className={`px-3 py-1 rounded-md border text-sm transition-colors ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 border-red-600"
            }`}
            title={disabled ? "Pilih satuan kerja dahulu" : "Hapus"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
