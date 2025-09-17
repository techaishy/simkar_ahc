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


type Props = {
  onSave: (data: Alat) => void;
  initialData?: Alat;
};

export default function AlatForm({ onSave, initialData }: Props) {
  const [form, setForm] = useState<Alat>(
    initialData || {
        id: "",
      kode: "",
      nama: "",
      kategori: "",
      merek: "",
      nomorSeri: "",
      jumlah: 1,
      tersedia: "",
      tanggalMasuk: "",
      status: "Tersedia",
    }
  );

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.nama.trim()) errors.nama = "Nama alat wajib diisi";
    if (!form.kode.trim()) errors.kode = "Kode alat wajib diisi";
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
          <Input name="kode" value={form.kode} onChange={handleChange} />
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
          <Label className="mb-2 block">Kategori</Label>
          <Input
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-2 block">Merek/Model</Label>
          <Input name="merek" value={form.merek} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Nomor Seri</Label>
          <Input
            name="nomorSeri"
            value={form.nomorSeri}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label className="mb-2 block">Jumlah</Label>
          <Input
            type="number"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
          />
          {fieldErrors.jumlah && (
            <p className="text-red-500 text-sm">{fieldErrors.jumlah}</p>
          )}
        </div>
        <div>
          <Label className="mb-2 block">Lokasi</Label>
          <Input name="lokasi" value={form.tersedia} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Tanggal Masuk</Label>
          <Input
            type="date"
            name="tanggalMasuk"
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
