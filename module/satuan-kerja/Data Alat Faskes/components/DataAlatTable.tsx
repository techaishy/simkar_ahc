"use client";

import React from "react";
import { Alat } from "@/lib/types/AlatFaskes";
import TableRow from "./TableRow";
import type { Wilayah } from "@/module/satuan-kerja/Data Alat Faskes/DataAlatPage";

type Props = {
  alatList: Alat[];
  selectedWilayah: Wilayah | null;
  onEdit: (a: Alat) => void;
  onDeleteConfirm: (a: Alat) => void;
};

export default function DataTable({ alatList, selectedWilayah, onEdit, onDeleteConfirm }: Props) {
  return (
    
    <div className="bg-white text-black rounded-lg shadow-sm overflow-x-auto">
      <table className="min-w-full ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nama Alat</th>
            <th className="px-4 py-3 text-center">Jumlah Unit</th>
            <th className="px-4 py-3 text-center">Tanggal Kalibrasi</th>
            <th className="px-4 py-3 text-center">Tanggal Expired</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {alatList.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          ) : (
            alatList.map((a) => (
              <TableRow
                key={a.id}
                alat={a}
                selectedWilayah={selectedWilayah}
                onEdit={onEdit}
                onDeleteConfirm={onDeleteConfirm}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
