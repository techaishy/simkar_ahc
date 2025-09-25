
"use client";

import { useState, useRef, useEffect } from "react";
import PrintButton from "@/components/ui/printButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlatDetailView from "./AlatDetailView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import AlatForm from "./AlatForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import PaginationControl from "@/components/ui/PaginationControl";

import type { Alat } from "@/lib/types/alat";
import SearchBar from "@/components/ui/searchbar";

export default function DataAlatTable() {
  const tableRef = useRef<HTMLTableElement>(null);
  const [alat, setAlat] = useState<Alat[]>([]);
  const [filteredAlat, setFilteredAlat] = useState<Alat[]>([]);

  const [selectedAlat, setSelectedAlat] = useState<Alat | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedDetailAlat, setSelectedDetailAlat] = useState<Alat | null>(null);
  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(7);

  // Ambil data alat dari API
  useEffect(() => {
    const fetchAlat = async () => {
      try {
        const res = await fetch("/api/alat");
        if (!res.ok) throw new Error("Gagal fetch alat");
        const data: Alat[] = await res.json();
        setAlat(data);
        setFilteredAlat(data); // default tampil semua
      } catch (error) {
        console.error("Error fetching alat:", error);
      }
    };
    fetchAlat();
  }, []);

  const totalPages = Math.ceil(filteredAlat.length / perPage);
  const paginatedData = filteredAlat.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page: number, perPage: number) => {
    setCurrentPage(page);
    setPerPage(perPage);
  };

    const handleSave = (alatBaru: Alat) => {
      setAlat((prev) => [...prev, alatBaru]);
      setFilteredAlat((prev) => [...prev, alatBaru]);
      setOpenTambah(false);
    };

  const handleUpdate = (alatUpdate: Alat) => {
    setAlat((prev) => prev.map((a) => (a.id === alatUpdate.id ? alatUpdate : a)));
    setFilteredAlat((prev) => prev.map((a) => (a.id === alatUpdate.id ? alatUpdate : a)));
    setOpenEdit(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAlat) return;
    try {
      const res = await fetch(`/api/alat/${selectedAlat.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAlat((prev) => prev.filter((a) => a.id !== selectedAlat.id));
        setFilteredAlat((prev) => prev.filter((a) => a.id !== selectedAlat.id));
      } else {
        console.error("Gagal hapus alat");
      }
    } catch (error) {
      console.error("Error deleting alat:", error);
    } finally {
      setOpenDelete(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAlat(alat); // kalau kosong, tampil semua
      return;
    }
    const lower = query.toLowerCase();
    setFilteredAlat(
      alat.filter(
        (a) =>
          a.nama.toLowerCase().includes(lower) ||
          a.merek.toLowerCase().includes(lower) ||
          a.type.toLowerCase().includes(lower)
      )
    );
    setCurrentPage(1); // reset ke page 1 tiap kali search
  };

  return (
    <Card className="p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Data Alat Kalibrasi</h2>

      

      {/* Action */}
      <div className="flex flex-wrap gap-2 justify-end mb-4 mt-4">
      <SearchBar placeholder="Cari alat kalibrasi..." onSearch={handleSearch} />
        {/* Tambah Alat */}
        <Dialog open={openTambah} onOpenChange={setOpenTambah}>
          <DialogTrigger asChild>
            <Button className="px-3 py-2 text-white font-semibold bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md">
              Alat Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800">
            <DialogHeader>
              <DialogTitle>Tambah Data Alat</DialogTitle>
            </DialogHeader>
            <AlatForm onSave={handleSave} />
          </DialogContent>
        </Dialog>

        <PrintButton printRef={tableRef} title="Data Alat Kalibrasi" label="Cetak Data" />
      </div>

      {/* Tabel Alat */}
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="min-w-[500px] w-full border-collapse text-xs md:text-sm"
        >
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="p-2">Nama Alat</th>
              <th className="p-2">Tanggal Masuk</th>
              <th className="p-2">Merek</th>
              <th className="p-2">Type</th>
              <th className="p-2">Jumlah</th>
              <th className="p-2 no-print">Detail</th>
              <th className="p-2 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 text-left border-t">
                <td className="p-2">{a.nama}</td>
                <td className="p-2">{a.tanggalMasuk}</td>
                <td className="p-2">{a.merek}</td>
                <td className="p-2">{a.type}</td>
                <td className="p-2">{a.jumlah}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setSelectedDetailAlat(a);
                      setOpenDetail(true);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Detail
                  </button>
                </td>

                {/* Aksi */}
                <td className="p-2 text-left relative no-print">
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
                          setSelectedAlat(a);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedAlat(a);
                          setOpenDelete(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Dialog Detail */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-black via-gray-950 to-gray-800">
          <DialogHeader>
            <DialogTitle>Detail Alat</DialogTitle>
          </DialogHeader>
          {selectedDetailAlat && (
            <AlatDetailView
              open={openDetail}
              onClose={() => setOpenDetail(false)}
              alat={selectedDetailAlat}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Alat</DialogTitle>
          </DialogHeader>
          {selectedAlat && (
            <AlatForm
              initialData={{
                ...selectedAlat,
              }}
              onSave={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        namaAlat={selectedAlat?.nama}
      />
    </Card>
  );
}
