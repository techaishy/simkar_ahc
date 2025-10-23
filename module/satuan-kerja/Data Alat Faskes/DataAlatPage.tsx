"use client";

import { useEffect, useState } from "react";
import FilterBar from "./components/FilterBar";
import DataTable from "@/module/satuan-kerja/Data Alat Faskes/components/DataAlatTable";
import FormAlat from "./components/FormAlat";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { Card } from "@/components/ui/card";
import { Alat } from "@/lib/types/AlatFaskes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PaginationControl from "@/components/ui/PaginationControl";

export type Wilayah = {
  id: string;
  nama: string;
};

export default function DataAlatPage() {
  const [allAlat, setAllAlat] = useState<Alat[]>([]);
  const [filteredAlat, setFilteredAlat] = useState<Alat[]>([]);
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Alat | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Alat | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);

  // Fetch list wilayah
  useEffect(() => {
    async function fetchWilayah() {
      try {
        const res = await fetch("/api/satuan-kerja/data-alat/data-lokasi");
        if (!res.ok) throw new Error("Gagal mengambil daftar wilayah");
        const data = await res.json();
        const mapped = data.map((w: any) => ({ id: w.id, nama: w.name }));
        setWilayahList(mapped);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWilayah();
  }, []);

  // Ambil selectedWilayah dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedWilayah");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedWilayah(parsed.id === "all" ? null : parsed);
    }
  }, []);

  useEffect(() => {
    if (selectedWilayah)
      localStorage.setItem("selectedWilayah", JSON.stringify(selectedWilayah));
    else localStorage.removeItem("selectedWilayah");
  }, [selectedWilayah]);

  // Fetch data alat summary atau detail per wilayah
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setAllAlat([]); // reset data lama saat filter berubah
      try {
        let res;
        if (selectedWilayah) {
          const nama = encodeURIComponent(selectedWilayah.nama);
          res = await fetch(`/api/satuan-kerja/data-alat/detail/${nama}`);
        } else {
          res = await fetch("/api/satuan-kerja/data-alat/summary");
        }

        if (!res.ok) throw new Error("Gagal mengambil data alat");
        const json = await res.json();

        const mapped: Alat[] = json.map((item: any, index: number) => ({
          id: `alat-${index}`,
          nama: item.nama_alat,
          jumlah: item.total_unit,
          tanggalKalibrasi: item.tanggalKalibrasi,
          tanggalExpired: item.tanggalExpired,
        }));

        setAllAlat(mapped);
      } catch (err) {
        console.error(err);
        setAllAlat([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedWilayah]);

  // Filter alat berdasarkan query
  useEffect(() => {
    const q = query.trim().toLowerCase();
    const res = q ? allAlat.filter((a) => a.nama.toLowerCase().includes(q)) : allAlat;
    setFilteredAlat(res);
    setCurrentPage(1);
  }, [query, allAlat]);

  // Pagination
  const totalPages = Math.ceil(filteredAlat.length / perPage);
  const paginatedAlat = filteredAlat.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page: number, per: number) => {
    setCurrentPage(page);
    setPerPage(per);
  };

  const handleDelete = (id: string) => {
    setAllAlat((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };


  const handleSave = (payload: Alat[]) => {
    setAllAlat((prev) => {
      const updated = [...prev];
      payload.forEach((alat) => {
        const index = updated.findIndex((a) => a.id === alat.id);
        if (index >= 0) updated[index] = alat;
        else updated.push(alat);
      });
      return updated;
    });
    setShowForm(false);
  };
  

  return (
    <Card className="p-4 w-full">
      <div className="flex text-black items-center">
        <h2 className="text-lg font-semibold mb-4">Data Alat Fasilitas Kesehatan</h2>
      </div>

      {/* Filter */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-black font-semibold text-lg">Satuan Kerja :</p>
        <div className="flex-1 min-w-[250px]">
          <FilterBar
            wilayahList={wilayahList}
            selectedWilayah={selectedWilayah}
            onWilayahChange={setSelectedWilayah}
            query={query}
            onQueryChange={setQuery}
          />
        </div>

        {/* Tambah Data */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
             disabled={!selectedWilayah}
              className={`px-4 py-2 rounded-md bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-lg font-semibold text-white transition-all duration-300 shadow-md ${
                !selectedWilayah
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white"
}`}
              onClick={() => {
                if (!selectedWilayah) return;
                setEditItem(null);
                setShowForm(true);
              }}
            >
              Tambah Alat
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800">
            <DialogHeader>
              <DialogTitle>Tambah Data Alat</DialogTitle>
            </DialogHeader>
            <FormAlat
              wilayahId={selectedWilayah?.id || "default"}
              onClose={() => setShowForm(false)}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-400">Loading data...</p>
        ) : filteredAlat.length === 0 ? (
          <p className="text-gray-400">Tidak ada data untuk wilayah ini.</p>
        ) : (
          <DataTable
            alatList={paginatedAlat}
            selectedWilayah={selectedWilayah}
            onEdit={(a) => { setEditItem(a); setShowForm(true); }}
            onDeleteConfirm={(a) => setDeleteTarget(a)}
          />
        )}
      </div>

      {/* Pagination */}
      <PaginationControl
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={handlePageChange}
      />

      {/* Modal Hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.nama}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </Card>
  );
}
