"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Alat } from "@/lib/types/alat";
import { Value } from "@radix-ui/react-select";


type Props = {
  onSave: (data: Alat) => void;
  initialData?: Alat;
};

export default function AlatForm({ onSave, initialData }: Props) {
  const [form, setForm] = useState<Alat>(
    initialData || {
        id: "",
      kodeAlat: "",
      kodeUnit: "",
      nama: "",
      tanggalMasuk: "",
      merek: "",
      nomorSeri: "",
      type: "",
      jumlah: 0,
      status: "TERSEDIA",
      deskripsi: "",
    }
  );

  const [jumlah, setJumlah] = useState<number>(0)
  const [nomorSeri, setNomorSeri] = useState<string[]>([])

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setJumlah(val)

    setForm({ ...form, jumlah: val });

        if (val > nomorSeri.length) {
          setNomorSeri([...nomorSeri, ...Array(val - nomorSeri.length).fill("")])
        } else {
          setNomorSeri(nomorSeri.slice(0, val))
        }
      }
    
      const handleNomorSeriChange = (index: number, value: string) => {
        const updated = [...nomorSeri]
        updated[index] = value
        setNomorSeri(updated)
      }

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.nama.trim()) errors.nama = "Nama alat wajib diisi";
    if (!form.kodeAlat.trim()) errors.kode = "Kode alat wajib diisi";
    if (form.jumlah <= 0) errors.jumlah = "Jumlah harus lebih dari 0";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      onSave(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar"
    >
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Data Alat</h3>
        <div>
          <Label className="mb-2 block">Kode Alat</Label>
          <Input name="kode" value={form.kodeAlat} onChange={handleChange} />
          {fieldErrors.kode && (
            <p className="text-red-500 text-sm">{fieldErrors.kode}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Nama Alat</Label>
          <Input name="nama" value={form.nama} onChange={handleChange} />
          {fieldErrors.nama && (
            <p className="text-red-500 text-sm">{fieldErrors.nama}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Deskripsi</Label>
          <Input
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-2 block">Merek</Label>
          <Input name="merek" value={form.merek} onChange={handleChange} />
        </div>
        <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Jumlah</Label>
          <Input
            type="number"
            min={0}
            name="jumlah"
            value={jumlah === 0 ? "" : jumlah}
            onChange={handleJumlahChange}
          />
          {fieldErrors.jumlah && (
            <p className="text-red-500 text-sm">{fieldErrors.jumlah}</p>
          )}
        </div>

        {Array.from({ length: jumlah }).map((_, i) => (
        <div key={i}>
          <Label className="mb-2 block">Nomor Seri {i + 1}</Label>
          <Input
            type="text"
            value={nomorSeri[i] || ""}
            onChange={(e) => handleNomorSeriChange(i, e.target.value)}
          />
        </div>
      ))}

    </div>

        <div>
          <Label className="mb-2 block">Type</Label>
          <Input 
          name="type" 
          value={form.type} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Tahun Beli</Label>
          <Input
            type="date"
            name="tahunBeli"
            value={form.tanggalMasuk}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={form.status}
            onValueChange={(val: Alat["status"]) =>
              setForm({ ...form, status: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TERSEDIA">Tersedia</SelectItem>
              <SelectItem value="DIPAKAI">Dipakai</SelectItem>
              <SelectItem value="RUSAK">Rusak</SelectItem>
              <SelectItem value="KALIBRASI">Kalibrasi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          className="font-semibold bg-gradient-to-br from-black to-gray-900 
                     hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah"}
        </Button>
      </div>
    </form>
  );
}
