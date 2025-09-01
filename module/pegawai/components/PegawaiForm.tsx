// module/pegawai/components/PegawaiForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pegawai } from "../types/pegawai";


type Props = {
  onSave: (pegawai: Pegawai) => void;
  initialData?: Pegawai;
};

export default function PegawaiForm({ onSave, initialData }: Props) {
  const [form, setForm] = useState<Pegawai>(
    initialData || {
      id: "0",
      name: "",
      nip: "",
      position: "",
      NIK: "",
      phone: "",
      emailPribadi: "",
      status: "Aktif",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setForm({
      id: "0",
      name: "",
      nip: "",
      position: "",
      NIK: "",
      phone: "",
      emailPribadi: "",
      status: "Aktif",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 space-y-4">
      <div>
        <Label>Nama Pegawai</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <Label>NIP</Label>
        <Input name="nip" value={form.nip} onChange={handleChange} required />
      </div>
      <div>
        <Label>Jabatan</Label>
        <Input name="position" value={form.position} onChange={handleChange} required />
      </div>
      <div>
        <Label>NIK</Label>
        <Input name="NIK" value={form.NIK} onChange={handleChange} required />
      </div>
      <div>
        <Label>Telpon</Label>
        <Input name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" name="emailPribadi" value={form.emailPribadi} onChange={handleChange} required />
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(val: "Aktif" | "Nonaktif") =>
            setForm({ ...form, status: val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aktif">Aktif</SelectItem>
            <SelectItem value="Nonaktif">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">{initialData ? "Simpan Perubahan" : "Tambah"}</Button>
      </div>
    </form>
  );
}
