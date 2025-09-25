"use client";

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
import { generateKodeUnit } from "@/lib/utils/generateKodeUnit";

export type UnitBaru = {
  kode_unit: string;
  nomor_seri: string;
  status: "TERSEDIA" | "DIGUNAKAN" | "MAINTENANCE";
  kondisi: string;
};

interface FormTambahUnitProps {
  alatId: string;
  namaAlat: string;
  merekAlat: string;
  existingUnitsCount: number; 
  onSuccess: (newUnits: UnitBaru[]) => void; 
}

export default function FormTambahUnit({
  alatId,
  namaAlat,
  merekAlat,
  existingUnitsCount,
  onSuccess,
}: FormTambahUnitProps) {
  const [jumlah, setJumlah] = useState(1);
  const [nomorSeri, setNomorSeri] = useState<string[]>([""]);
  const [status, setStatus] = useState<UnitBaru["status"]>("TERSEDIA");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jumlah <= 0) return;

    setLoading(true);
    try {
      const units: UnitBaru[] = nomorSeri.map((ns, i) => ({
        kode_unit: generateKodeUnit(alatId, existingUnitsCount + i),
        nomor_seri: ns,
        status,
        kondisi: "Baik",
      }));

      const res = await fetch(`/api/inventory/alat-kalibrator/${alatId}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units }),
      });

      if (!res.ok) throw new Error("Gagal tambah unit");

      await res.json();
      onSuccess(units); // kirim unit baru ke parent agar langsung bisa di-merge
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan unit baru");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input jumlah unit */}
      <div>
        <Label className="mb-2 block">Jumlah Unit</Label>
        <Input
          type="number"
          min={1}
          value={jumlah}
          onChange={(e) => handleJumlahChange(Number(e.target.value))}
        />
      </div>

      {/* Input nomor seri */}
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

      {/* Pilihan status unit */}
      <div>
        <Label className="mb-2 block">Status</Label>
        <Select value={status} onValueChange={(val) => setStatus(val as UnitBaru["status"])}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-black to-gray-900">
            <SelectItem value="TERSEDIA">Tersedia</SelectItem>
            <SelectItem value="DIGUNAKAN">Digunakan</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
