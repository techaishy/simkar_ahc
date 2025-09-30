"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function FormSuratBarangKeluar() {
  const [formData, setFormData] = useState({
    nomorSurat: "",
    namaBarang: "",
    jumlah: "",
    tujuan: "",
    tanggalKeluar: "",
    keterangan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Surat Barang Keluar:", formData);
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
            <Label htmlFor="namaBarang">Nama Barang</Label>
            <Input id="namaBarang" name="namaBarang" value={formData.namaBarang} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="jumlah">Jumlah Barang</Label>
            <Input type="number" id="jumlah" name="jumlah" value={formData.jumlah} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tujuan">Tujuan Pengiriman</Label>
            <Input id="tujuan" name="tujuan" value={formData.tujuan} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="tanggalKeluar">Tanggal Keluar</Label>
            <Input type="date" id="tanggalKeluar" name="tanggalKeluar" value={formData.tanggalKeluar} onChange={handleChange} />
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
            Simpan Surat Barang Keluar
          </Button>
        </form>
    </Card>
  );
}
