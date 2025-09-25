"use client";

import type { Alat } from "@/lib/types/alat";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormTambahUnit from "./FormTambahUnit";
import { generateKodeUnit } from "@/lib/utils/generateKodeUnit";

type AlatDetailViewProps = {
    open: boolean;
    onClose: () => void;
    alat: Alat | null;
};

export default function AlatDetailView({ alat}: AlatDetailViewProps) {
  if (!alat) return <p className="text-gray-500">Tidak ada data alat.</p>;
  const [openTambah, setOpenTambah] = useState(false);
  const [alatData, setAlat] = useState(alat);

  return (
    <div className="p-4 overflow-y-auto max-h-[80vh] custom-scrollbar">

      
<Card className="bg-gray-900 p-6 rounded-2xl shadow-xl">
  <h2 className="text-lg font-semibold text-white mb-4">📋 Info Alat</h2>

  <div className="flex flex-wrap gap-2 justify-end mb-4 mt-4">
     
        {/* Tambah Alat */}
        <Dialog open={openTambah} onOpenChange={setOpenTambah}>
  <DialogTrigger asChild>
    <Button className="px-3 py-2 text-white font-semibold bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md">
      Tambah Unit
    </Button>
  </DialogTrigger>
  <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800">
    <DialogHeader>
      <DialogTitle>Tambah Unit Baru</DialogTitle>
    </DialogHeader>
    <FormTambahUnit
  onSave={(unitBaru) => {
    if (alat) {
      const kodeUnit = generateKodeUnit(alat.merek, alat.units.length);

      // update state alat
      setAlat((prev) =>
        prev
          ? {
              ...prev,
              units: [
                ...prev.units,
                {
                  id: prev.units.length + 1,
                  kodeUnit,
                  nomorSeri: unitBaru.nomorSeri,
                  status: "TERSEDIA",
                },
              ],
            }
          : prev
      );
    }
    setOpenTambah(false);
  }}
/>
  </DialogContent>
</Dialog>


      </div>
  
  {/* Baris 1 */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-xs">Kode Alat</p>
      <p className="text-white font-medium">{alat.kodeAlat}</p>
    </div>
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-sm">Nama Alat</p>
      <p className="text-white font-medium">{alat.nama}</p>
    </div>
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-xs">Merek</p>
      <p className="text-white font-medium">{alat.merek}</p>
    </div>
  </div>

  {/* Baris 2 */}
  <div className="grid grid-cols-3 gap-4 mb-4">
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-xs">Type</p>
      <p className="text-white font-medium">{alat.type}</p>
    </div>
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-xs">Tanggal Masuk</p>
      <p className="text-white font-medium">{alat.tanggalMasuk}</p>
    </div>
    <div className="bg-gray-800 p-3 rounded-sm">
      <p className="text-gray-400 text-xs">Jumlah</p>
      <p className="text-white font-medium">{alat.jumlah}</p>
    </div>
  </div>

  {/* Baris 3 */}
  <div className="bg-gray-800 p-4 rounded-sm">
    <h3 className="text-gray-400 text-xs mb-1">Deskripsi</h3>
    <p className="text-gray-300">{alat.deskripsi || "Tidak ada deskripsi"}</p>
  </div>
</Card>




      {/* Tabel Unit */}
      <h3 className="font-semibold mb-2 pt-5">Unit Alat</h3>
      <table className="w-full border border-gray-300 text-white font-semibold bg-gradient-to-br from-black to-gray-800">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="p-2">No</th>
            <th className="p-2">Kode Unit</th>
            <th className="p-2">Nomor Seri</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
        {Array.from({ length: alat.jumlah }).map((_, index) => {
            const inisialNama = alat.nama.substring(0, 3).toUpperCase();
            const kodeUnit = `${inisialNama}-${String(index + 1).padStart(3, "0")}`;

            return (
              <tr
                key={index}
                className="text-white text-sm font-light bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md border-t"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{kodeUnit}</td>
                <td className="p-2">{alat.nomorSeri[index] || "-"}</td>
                <td className="p-2">{alat.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

