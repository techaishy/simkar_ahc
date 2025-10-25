"use client";

import { useEffect, useState, useRef } from "react";
import FilterBar from "./components/FilterBar";
import DataTable from "@/module/satuan-kerja/Data Alat Faskes/components/DataAlatTable";
import FormAlat from "./components/FormAlat";
import FormEditAlat from "./components/FormEditAlat";
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
  const [deleteTarget, setDeleteTarget] = useState<Alat | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([]);
  const [editTarget, setEditTarget] = useState<Alat | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/satuan-kerja/data-alat/data-lokasi");
        const data = await res.json();
        if (!active) return;
        const mapped = data.map((w: any) => ({ id: w.id, nama: w.name }));
        setWilayahList(mapped);
      } catch (err) {
        console.error("❌ Gagal ambil wilayah:", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedWilayah");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed?.nama)
          setSelectedWilayah(parsed.id === "all" ? null : parsed);
      }
    } catch {
      console.warn("⚠️ LocalStorage selectedWilayah corrupt");
    }
  }, []);

  useEffect(() => {
    if (selectedWilayah) {
      localStorage.setItem("selectedWilayah", JSON.stringify(selectedWilayah));
    } else {
      localStorage.removeItem("selectedWilayah");
    }
  }, [selectedWilayah]);

  useEffect(() => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    async function fetchData() {
      setLoading(true);
      try {
        let url = "";

        if (selectedWilayah) {
          const encoded = encodeURIComponent(selectedWilayah.nama);
          url = `/api/satuan-kerja/data-alat/detail/${encoded}`;
        } else {
          url = `/api/satuan-kerja/data-alat/summary`;
        }

        const res = await fetch(url, { signal: abortController.current?.signal });
        if (!res.ok) throw new Error("Gagal ambil data alat");

        const json = await res.json();
        const mapped: Alat[] = json.map((item: any, i: number) => ({
          id: `${item.nama_alat}-${selectedWilayah?.id || i}`,
          nama: item.nama_alat,
          jumlah: item.total_unit,
          tanggalKalibrasi: item.tanggalKalibrasi,
          tanggalExpired: item.tanggalExpired,
        }));

        setAllAlat(mapped);
      } catch (err: any) {
        if (err.name !== "AbortError")
          console.error("❌ Fetch alat error:", err);
        setAllAlat([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => abortController.current?.abort();
  }, [selectedWilayah]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setFilteredAlat(
      q ? allAlat.filter((a) => a.nama.toLowerCase().includes(q)) : allAlat
    );
    setCurrentPage(1);
  }, [query, allAlat]);

  const totalPages = Math.ceil(filteredAlat.length / perPage);
  const paginatedAlat = filteredAlat.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSaveLocal = (newAlat: Alat[]) => {
    setAllAlat((prev) => {
      const map = new Map<string, Alat>();
      prev.forEach((a) => map.set(a.nama, a));
      newAlat.forEach((a) => map.set(a.nama, a));
      return Array.from(map.values());
    });
    setShowForm(false);
  };

  const handleSaveEdit = (updated: Alat) => {
    setAllAlat((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setShowEditForm(false);
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex text-black items-center">
        <h2 className="text-lg font-semibold mb-4">
          Data Alat Fasilitas Kesehatan
        </h2>
      </div>

      {/* FILTER */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-black font-semibold text-lg">Satuan Kerja :</p>
        <div className="flex-1 min-w-[250px]">
          <FilterBar
            wilayahList={wilayahList}
            selectedWilayah={selectedWilayah}
            onWilayahChange={(wil) => setSelectedWilayah(wil)}
            query={query}
            onQueryChange={setQuery}
          />
        </div>

        {/* Tambah Alat */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              onClick={() => selectedWilayah && setShowForm(true)}
              disabled={!selectedWilayah}
              className={`px-4 py-2 rounded-md text-lg font-semibold shadow-md transition-all duration-300
                ${
                  selectedWilayah
                    ? "bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
            >
              Tambah Alat
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-gradient-to-br from-black via-gray-950 to-gray-800 z-[9999] max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <DialogHeader>
              <DialogTitle>Tambah Data Alat</DialogTitle>
            </DialogHeader>
            <FormAlat
              wilayahId={selectedWilayah?.id || "default"}
              onClose={() => setShowForm(false)}
              onSave={handleSaveLocal}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-400">Loading data...</p>
        ) : filteredAlat.length === 0 ? (
          <p className="text-gray-400">Tidak ada data untuk wilayah ini.</p>
        ) : (
          <DataTable
            alatList={paginatedAlat}
            selectedWilayah={selectedWilayah}
            onEdit={(a: Alat) => {
              setEditTarget(a);
              setShowEditForm(true);
            }}
            onDeleteConfirm={(a) => setDeleteTarget(a)}
          />
        )}
      </div>

      <PaginationControl
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={perPage}
        onPageChange={(p, per) => {
          setCurrentPage(p);
          setPerPage(per);
        }}
      />

      {/* Hapus */}
      {deleteTarget && (
        <DeleteConfirmModal
          name={deleteTarget.nama}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!selectedWilayah) return;

            try {
              const res = await fetch("/api/satuan-kerja/data-alat/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  lokasiId: selectedWilayah.id,
                  nama_alat: deleteTarget.nama,
                }),
              });

              const result = await res.json();

              if (!res.ok) {
                console.error("❌ Gagal hapus:", result.error || result);
                alert(result.error || "Gagal menghapus data");
                return;
              }

              // Jika berhasil
              setAllAlat((prev) => prev.filter((a) => a.id !== deleteTarget.id));
              alert("✅ Data berhasil dihapus");
            } catch (err) {
              console.error("❌ Error hapus data:", err);
              alert("Terjadi kesalahan saat menghapus data");
            } finally {
              setDeleteTarget(null);
            }
          }}
        />
      )}

      {/* Edit */}
      {showEditForm && editTarget && (
        <FormEditAlat
          initial={editTarget}
          wilayahId={selectedWilayah?.id || "default"}
          onClose={() => setShowEditForm(false)}
          onSave={handleSaveEdit}
        />
      )}
    </Card>
  );
}
