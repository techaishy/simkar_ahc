  "use client";

  import { useEffect, useMemo, useState } from "react";
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
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";




  export type Wilayah = {
    id: string;
    nama: string;
  };

  export default function DataAlatPage() {
    const [allAlat, setAllAlat] = useState<Alat[]>([]);
    const [filteredAlat, setFilteredAlat] = useState<Alat[] | null>(null);
    const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
    const [query, setQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<Alat | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Alat | null>(null);

    // dummy list wilayah — ganti dengan fetch API dari server
    const wilayahList: Wilayah[] = useMemo(
      () => [
        { id: "w1", nama: "Puskesmas A" },
        { id: "w2", nama: "Puskesmas B" },
        { id: "w3", nama: "Rumah Sakit C" },
      ],
      []
    );

    useEffect(() => {
      const saved = localStorage.getItem("selectedWilayah");
      if (saved) {
        const parsed = JSON.parse(saved) as Wilayah;
        setSelectedWilayah(parsed);
      }
    }, []);

    useEffect(() => {
      if (selectedWilayah) {
        localStorage.setItem("selectedWilayah", JSON.stringify(selectedWilayah));
      } else {
        localStorage.removeItem("selectedWilayah");
      }
    }, [selectedWilayah]);

    // handle filter/search change
    useEffect(() => {
      let res = allAlat;

      // 🔎 filter by search
      if (query.trim()) {
        const q = query.toLowerCase();
        res = res.filter((a) => a.nama.toLowerCase().includes(q));
      }

      if (selectedWilayah) {
        // 🔹 kalau ada wilayah → isi tanggal kalibrasi & expired dummy
        res = res.map((r, i) => ({
          ...r,
          kalibrasi: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 30)
            .toISOString()
            .slice(0, 10),
          expired: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 30)
            .toISOString()
            .slice(0, 10),
        }));
      } else {
        // 🔹 kalau belum pilih wilayah → kosongkan tanggal
        res = res.map((r) => ({
          ...r,
          kalibrasi: null,
          expired: null,
        }));
      }

      setFilteredAlat(res);
    }, [query, allAlat, selectedWilayah]);

    const handleDelete = (id: string) => {
      setAllAlat((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
    };

    const handleSave = (payload: Alat) => {
      if (editItem) {
        setAllAlat((prev) =>
          prev.map((p) => (p.id === payload.id ? payload : p))
        );
        setEditItem(null);
      } else {
        setAllAlat((prev) => [payload, ...prev]);
      }
      setShowForm(false);
    };

    return (
      <Card className="p-4 w-full">
        <div className="flex text-black items-center ">
          <h2 className="text-lg font-semibold mb-4">
            Data Alat Fasilitas Kesehatan
          </h2>
        </div>

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

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button
                className="px-4 py-2 rounded-md bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-lg font-semibold text-white transition-all duration-300 shadow-md"
                onClick={() => {
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
              <FormAlat   wilayahId={selectedWilayah?.id || "default"} 
  onClose={() => setShowForm(false)}
  onSave={handleSave}/>
              </DialogContent>
              </Dialog>
       
        </div>

        <div className="mt-4">
          <DataTable
            alatList={filteredAlat ?? []}
            selectedWilayah={selectedWilayah}
            onEdit={(a) => {
              setEditItem(a);
              setShowForm(true);
            }}
            onDeleteConfirm={(a) => setDeleteTarget(a)}
          />
        </div> 

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
