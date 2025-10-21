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

export default function TableRow({ alat, selectedWilayah, onEdit, onDeleteConfirm }: Props) {
  const disabled = !selectedWilayah;

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">{alat.nama}</td>
      <td className="px-4 py-3 text-center">{alat.jumlah}</td>
      <td className="px-4 py-3 text-center">
        {disabled ? <span className="text-sm text-gray-400">Pilih satuan kerja dahulu</span> : alat.tanggalKalibrasi ?? "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {disabled ? <span className="text-sm text-gray-400">Pilih satuan kerja dahulu</span> : alat.tanggalExpired?? "-"}
      </td>
      <td className="px-4 py-3 text-center">
        {disabled ? (
          <button className="px-3 py-1 rounded-md border text-sm text-gray-400 cursor-not-allowed" disabled>
            Pilih satuan kerja dahulu
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(alat)}
              className="px-3 py-1 rounded-md border hover:bg-gray-100"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button onClick={() => onDeleteConfirm(alat)} className="px-3 py-1 rounded-md border hover:bg-gray-100" title="Hapus">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
