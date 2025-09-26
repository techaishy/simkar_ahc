"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FormSuratDinasLuar() {
  const [formData, setFormData] = useState({
    nomorSurat: "",
    namaPegawai: "",
    tujuan: "",
    tanggalBerangkat: "",
    tanggalKembali: "",
    keterangan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Surat Dinas Luar:", formData);
    // TODO: connect ke API / simpan ke database
  };

  return (
    <Card>
    
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nomorSurat">Nomor Surat</Label>
            <Input id="nomorSurat" name="nomorSurat" value={formData.nomorSurat} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="namaPegawai">Nama Pegawai</Label>
            <Input id="namaPegawai" name="namaPegawai" value={formData.namaPegawai} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tujuan">Tujuan Dinas</Label>
            <Input id="tujuan" name="tujuan" value={formData.tujuan} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tanggalBerangkat">Tanggal Berangkat</Label>
              <Input type="date" id="tanggalBerangkat" name="tanggalBerangkat" value={formData.tanggalBerangkat} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="tanggalKembali">Tanggal Kembali</Label>
              <Input type="date" id="tanggalKembali" name="tanggalKembali" value={formData.tanggalKembali} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="keterangan">Keterangan</Label>
            <textarea
    id="keterangan"
    name="keterangan"
    value={formData.keterangan}
    onChange={handleChange}
    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>
          <Button type="submit" className="w-full">
            Simpan Surat Dinas
          </Button>
        </form>

    </Card>
  );
}
