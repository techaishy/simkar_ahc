// "use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Alat } from "@/lib/types/alat";

interface FormTambahUnitProps {
  onSave: (data: { nomorSeri: string[]; jumlah: number }) => void;
  initialData?: Alat; 
}

export default function FormTambahUnit({ onSave, initialData }: FormTambahUnitProps) {
    const [form, setForm] = useState<Alat>(
        initialData || {
          id: "",
          kodeAlat: "",
          kodeUnit: "",
          nama: "",
          tanggalMasuk: "",
          merek: "",
          nomorSeri: [],
          type: "",
          jumlah: 0,
          status: "TERSEDIA",
          deskripsi: "",
          units: [],
        }
        );
  const [jumlah, setJumlah] = useState(1);
  const [nomorSeri, setNomorSeri] = useState<string[]>([""]);

  const handleJumlahChange = (val: number) => {
    setJumlah(val);
    if (val > nomorSeri.length) {
      setNomorSeri([...nomorSeri, ...Array(val - nomorSeri.length).fill("")]);
    } else {
      setNomorSeri(nomorSeri.slice(0, val));
    }
  };

  const handleNomorSeriChange = (index: number, value: string) => {
    const updated = [...nomorSeri];
    updated[index] = value;
    setNomorSeri(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumlah > 0) {
      onSave({ jumlah, nomorSeri });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white">Jumlah Unit</label>
        <Input
          type="number"
          value={jumlah}
          onChange={(e) => handleJumlahChange(Number(e.target.value))}
          min={1}
        />
      </div>

      {Array.from({ length: jumlah }).map((_, i) => (
        <div key={i}>
          <label className="block text-sm text-white">
            Nomor Seri {i + 1}
          </label>
          <Input
            type="text"
            value={nomorSeri[i] || ""}
            onChange={(e) => handleNomorSeriChange(i, e.target.value)}
          />

          
        </div>
      ))}

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
            <SelectContent className="bg-gradient-to-br from-black to-gray-900 ">
              <SelectItem value="TERSEDIA">Tersedia</SelectItem>
              <SelectItem value="DIGUNAKAN">Digunakan</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <Button type="submit" className="w-full">
        Simpan
      </Button>
    </form>
  );
}
