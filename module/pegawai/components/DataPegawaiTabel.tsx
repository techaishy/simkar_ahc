
"use client";

import { useState, useRef } from "react";
import PrintButton from "@/components/ui/printButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import PegawaiForm from "./PegawaiForm";
import { Pegawai } from "../types/pegawai";

const dummyPegawai: Pegawai[] = [
  {
    id: "1",
    name: "Andi Wijaya",
    nip: "1987654321",
    position: "Teknisi",
    NIK: "123456789123",
    phone: "081234567890",
    emailPribadi: "andi@gmail.com",
    status: "Aktif",
  },
  {
    id: "2",
    name: "Siti Aminah",
    nip: "1987654322",
    position: "Manager",
    NIK: "123456",
    phone: "081298765432",
    emailPribadi: "siti@gmail.com",
    status: "Aktif",
  },
  {
    id: "3",
    name: "Budi Santoso",
    nip: "1987654323",
    position: "Admin",
    NIK: "123456",
    phone: "081212345678",
    emailPribadi: "budi@gmail.com",
    status: "Nonaktif",
  },
];

export default function DataPegawaiTable() {
  const tableRef = useRef<HTMLTableElement>(null);

  const [pegawai, setPegawai] = useState<Pegawai[]>(dummyPegawai);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

  // state modal tambah
  const [openTambah, setOpenTambah] = useState(false);
  // state modal edit
  const [openEdit, setOpenEdit] = useState(false);

  const handleSave = (pegawaiBaru: Pegawai) => {
    setPegawai((prev) => [
      ...prev,
      { ...pegawaiBaru, id: String(prev.length + 1) },
    ]);
    setOpenTambah(false);
  };

  const handleUpdate = (pegawaiBaru: Pegawai) => {
    setPegawai((prev) =>
      prev.map((pg) => (pg.id === pegawaiBaru.id ? pegawaiBaru : pg))
    );
    setOpenEdit(false);
  };

  return (
    <Card className="p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Data Pegawai</h2>
      <div className="flex flex-wrap gap-2 justify-end mb-4">
        {/* Tambah Pegawai */}
        <Dialog open={openTambah} onOpenChange={setOpenTambah}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 text-white font-semibold bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md">
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800">
            <DialogHeader>
              <DialogTitle>Tambah Pegawai</DialogTitle>
            </DialogHeader>
            <PegawaiForm onSave={handleSave} />
          </DialogContent>
        </Dialog>

        <PrintButton
          printRef={tableRef}
          title="Data Pegawai"
          label="Cetak Data"
        />
      </div>

      {/* Tabel Pegawai */}
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="min-w-[400px] w-full border-collapse text-xs md:text-sm"
        >
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Nama Pegawai</th>
              <th className="p-2">NIP</th>
              <th className="p-2">Jabatan</th>
              <th className="p-2 hidden md:table-cell">NIK</th>
              <th className="p-2 hidden md:table-cell">Telpon</th>
              <th className="p-2 hidden md:table-cell">Email</th>
              <th className="p-2 hidden md:table-cell">Status</th>
              <th className="p-2 hidden md:table-cell">Aksi</th>
              <th className="p-2 block md:hidden">Detail</th>
            </tr>
          </thead>
          <tbody>
            {pegawai.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.nip}</td>
                <td className="p-2">{p.position}</td>
                <td className="p-2 hidden md:table-cell">{p.NIK}</td>
                <td className="p-2 hidden md:table-cell">{p.phone}</td>
                <td className="p-2 hidden md:table-cell">{p.emailPribadi}</td>
                <td className="p-2 hidden md:table-cell">
                  <Badge variant={p.status === "Aktif" ? "default" : "secondary"}>
                    {p.status}
                  </Badge>
                </td>

                {/* Aksi */}
                <td className="p-2 hidden md:table-cell text-right relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 border rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="bg-white text-black z-[9999] border p-2 shadow-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPegawai(p);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setPegawai(pegawai.filter((item) => item.id !== p.id))
                        }
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>

                {/* Mobile: tombol detail */}
                <td className="p-2 block md:hidden">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="text-blue-600"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPegawai(p)}
                      >
                        Lihat Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-xl bg-gradient-to-br from-black via-gray-950 to-gray-800 shadow-lg sm:max-w-sm w-full">
                      <DialogHeader>
                        <DialogTitle>Detail Pegawai</DialogTitle>
                        <DialogDescription>
                          Informasi lengkap tentang pegawai.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedPegawai && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">ID</span>
                            <span className="col-span-2">
                              {selectedPegawai.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Nama</span>
                            <span className="col-span-2">
                              {selectedPegawai.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">NIP</span>
                            <span className="col-span-2">
                              {selectedPegawai.nip}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Jabatan</span>
                            <span className="col-span-2">
                              {selectedPegawai.position}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">NIK</span>
                            <span className="col-span-2">
                              {selectedPegawai.NIK}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Telepon</span>
                            <span className="col-span-2">
                              {selectedPegawai.phone}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Email</span>
                            <span className="col-span-2">
                              {selectedPegawai.emailPribadi}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Status</span>
                            <span className="col-span-2">
                              <Badge
                                variant={
                                  selectedPegawai.status === "Aktif"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {selectedPegawai.status}
                              </Badge>
                            </span>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Pegawai</DialogTitle>
          </DialogHeader>
          {selectedPegawai && (
            <PegawaiForm initialData={selectedPegawai} onSave={handleUpdate} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
