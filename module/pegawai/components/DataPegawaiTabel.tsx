"use client";

import { useState, useRef, useEffect } from "react";
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
import type { Karyawan } from "@/lib/types/karyawan";
import { statusLabel, statusVariant } from "@/lib/types/helper";

import PaginationControl from "@/components/ui/PaginationControl";

export default function DataPegawaiTable() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [Karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(7);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const res = await fetch("/api/pegawai");
        if (!res.ok) throw new Error("Gagal fetch Karyawan");
        const data: Karyawan[] = await res.json();
        setKaryawan(data);
      } catch (error) {
        console.error("Error fetching pegawai:", error);
      }
    };
    fetchKaryawan();
  }, []);

  const totalPages = Math.ceil(Karyawan.length / perPage);
  const paginatedData = Karyawan.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page: number, newPerPage: number) => {
    setCurrentPage(page);
    setPerPage(newPerPage);
  };

  const handleSave = (KaryawanBaru: Karyawan) => {
    setKaryawan((prev) => [
      ...prev,
      { ...KaryawanBaru, id: String(prev.length + 1) },
    ]);
    setOpenTambah(false);
  };

  const handleUpdate = (KaryawanBaru: Karyawan) => {
    setKaryawan((prev) =>
      prev.map((pg) => (pg.id === KaryawanBaru.id ? KaryawanBaru : pg))
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
              <th className="p-2 hidden md:table-cell no-print">Aksi</th>
              <th className="p-2 block md:hidden no-print">Detail</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.nip}</td>
                <td className="p-2">{p.position}</td>
                <td className="p-2 hidden md:table-cell">{p.nik}</td>
                <td className="p-2 hidden md:table-cell">{p.phone}</td>
                <td className="p-2 hidden md:table-cell">{p.emailPribadi}</td>
                <td className="p-2 hidden md:table-cell">
                  <Badge variant={statusVariant[p.status]}>
                    {p.status}
                  </Badge>
                </td>

                {/* Aksi */}
                <td className="p-2 hidden md:table-cell text-right relative no-print">
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
                          setSelectedKaryawan(p);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setKaryawan(Karyawan.filter((item) => item.id !== p.id))
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
                <td className="p-2 block md:hidden no-print">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="text-blue-600"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedKaryawan(p)}
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
                      {selectedKaryawan && (
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">ID</span>
                            <span className="col-span-2">
                              {selectedKaryawan.id}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Nama</span>
                            <span className="col-span-2">
                              {selectedKaryawan.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">NIP</span>
                            <span className="col-span-2">
                              {selectedKaryawan.nip}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Jabatan</span>
                            <span className="col-span-2">
                              {selectedKaryawan.position}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">NIK</span>
                            <span className="col-span-2">
                              {selectedKaryawan.nik}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Telepon</span>
                            <span className="col-span-2">
                              {selectedKaryawan.phone}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Email</span>
                            <span className="col-span-2">
                              {selectedKaryawan.emailPribadi}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <span className="font-medium">Status</span>
                            <span className="col-span-2">
                              <Badge variant={statusVariant[selectedKaryawan.status]}>
                                {selectedKaryawan.status}
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

      {/* Kontrol pagination + dropdown jumlah data */}
      <div className="mt-4 flex justify-between items-center">
        {/* Dropdown jumlah data per halaman */}
        <div className="flex items-center gap-2 text-sm">
          <span>Tampilkan</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm bg-white text-black"
          >
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span>data</span>
        </div>

        <PaginationControl
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Pegawai</DialogTitle>
          </DialogHeader>
          {selectedKaryawan && (
            <PegawaiForm
              initialData={{
                ...selectedKaryawan,
                customId: selectedKaryawan.id,
              }}
              onSave={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
