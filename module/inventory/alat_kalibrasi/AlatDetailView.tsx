"use client";

import { useEffect, useState } from "react";
import type { Alat } from "@/lib/types/alat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormTambahUnit from "./FormTambahUnit";

type AlatDetailViewProps = {
  open: boolean;
  onClose: () => void;
  alat: Alat | null;
};

export default function AlatDetailView({ alat, open, onClose }: AlatDetailViewProps) {
  const [alatDetail, setAlatDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [openTambah, setOpenTambah] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!alat?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/inventory/alat-kalibrator/${alat.id}`);
        if (!res.ok) throw new Error("Gagal fetch detail alat");
        const data = await res.json();
        setAlatDetail(data);
      } catch (err) {
        console.error("Error fetch detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchDetail();
  }, [alat?.id, open]);

  if (loading) return <p className="text-gray-500 p-4">Loading detail...</p>;
  if (!alatDetail) return <p className="text-gray-500 p-4">Tidak ada data alat.</p>;

  return (
    <div className="p-4 overflow-y-auto max-h-[80vh] custom-scrollbar">
      <Card className="bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">📋 Info Alat</h2>

        {/* Tombol tambah unit */}
        <div className="flex justify-end mb-4">
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
                alatId={alatDetail.id}
                namaAlat={alatDetail.nama_alat}
                merekAlat={alatDetail.merk}
                existingUnitsCount={alatDetail.units.length}
                onSuccess={(newUnits) => {
                  setAlatDetail((prev: any) => ({
                    ...prev,
                    units: [...prev.units, ...newUnits],
                  }));
                  setOpenTambah(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Info singkat */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-sm">
            <p className="text-gray-400 text-xs">Kode Barcode</p>
            <p className="text-white font-medium">{alatDetail.kode_barcode}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-sm">
            <p className="text-gray-400 text-xs">Nama Alat</p>
            <p className="text-white font-medium">{alatDetail.nama_alat}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-sm">
            <p className="text-gray-400 text-xs">Merk</p>
            <p className="text-white font-medium">{alatDetail.merk}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-sm">
            <p className="text-gray-400 text-xs">Type</p>
            <p className="text-white font-medium">{alatDetail.type}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-sm">
            <p className="text-gray-400 text-xs">Jumlah</p>
            <p className="text-white font-medium">{alatDetail.jumlah}</p>
          </div>
          {alatDetail.deskripsi && (
            <div className="bg-gray-800 p-3 rounded-sm col-span-3">
              <p className="text-gray-400 text-xs">Deskripsi</p>
              <p className="text-gray-300">{alatDetail.deskripsi}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Table Unit */}
      <h3 className="text-gray-200 font-semibold mb-2 pt-5">Unit Alat</h3>
      <table className="w-full border border-gray-300 text-white font-semibold bg-gradient-to-br from-black to-gray-800">
        <thead>
          <tr className="bg-gray-900 text-left">
            <th className="p-2">No</th>
            <th className="p-2">Kode Unit</th>
            <th className="p-2">Nomor Seri</th>
            <th className="p-2">Kondisi</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {alatDetail.units.map((u: any, idx: number) => (
            <tr
              key={u.id}
              className="text-white text-sm font-light bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md border-t"
            >
              <td className="p-2">{idx + 1}</td>
              <td className="p-2">{u.kode_unit}</td>
              <td className="p-2">{u.nomor_seri || "-"}</td>
              <td className="p-2">{u.kondisi}</td>
              <td className="p-2">{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
