"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuratKeluarTable() {
  // Dummy data
  const data = [
    {
      id: 1,
      nomorSurat: "001/DL/2025",
      jenis: "Surat Dinas Luar",
      tujuan: "Bandung",
      tanggal: "2025-09-26",
    },
    {
      id: 2,
      nomorSurat: "002/BK/2025",
      jenis: "Surat Barang Keluar",
      tujuan: "Jakarta",
      tanggal: "2025-09-27",
    },
  ];

  return (
    <Card className="mt-6 p-4">
      <h2 className="text-lg font-semibold mb-4">Daftar Surat Keluar</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">No</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Nomor Surat</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Jenis Surat</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Tujuan</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Tanggal</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-200 px-4 py-2">{item.nomorSurat}</td>
                <td className="border border-gray-200 px-4 py-2">{item.jenis}</td>
                <td className="border border-gray-200 px-4 py-2">{item.tujuan}</td>
                <td className="border border-gray-200 px-4 py-2">{item.tanggal}</td>
                <td className="border border-gray-200 px-4 py-2 space-x-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
