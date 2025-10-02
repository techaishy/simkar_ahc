"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Alat, AlatUnit } from "@/lib/types/alat";

type Props = {
  onSave: (data: Alat, units: AlatUnit[]) => void;
  initialData?: Alat;
};

export default function AlatForm({ onSave, initialData }: Props) {
  const [form, setForm] = useState<Alat>(
    initialData || {
      id: "",
      kode_barcode: "",
      nama_alat: "",
      merk: "",
      type: "",
      jumlah: 0,
      created_at: "",
      updated_at: "",
      units: [],
    }
  );

  const [jumlah, setJumlah] = useState<number>(form.jumlah ?? 0);
  const [nomorSeri, setNomorSeri] = useState<string[]>(
    form.units?.map(u => u.nomor_seri ?? "") || []
  );

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const keyMap: Record<string, keyof Alat> = {
      kode: "kode_barcode",
      nama: "nama_alat",
      merek: "merk",
      type: "type",
      tahunBeli: "created_at",
    };

    const key = keyMap[name] ?? (name as keyof Alat);
    setForm({ ...form, [key]: value });
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setJumlah(val);
    setForm({ ...form, jumlah: val });

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

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.nama_alat?.trim()) errors.nama = "Nama alat wajib diisi";
    if (!form.kode_barcode?.trim()) errors.kode = "Kode alat wajib diisi";
    if ((form.jumlah ?? 0) <= 0) errors.jumlah = "Jumlah harus lebih dari 0";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const alatRes = await fetch("/api/inventory/alat-kalibrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_alat: form.nama_alat,
          merk: form.merk,
          type: form.type,
          jumlah: form.jumlah,
          tanggal_masuk: form.created_at,
          kode_barcode: form.kode_barcode,
        }),
      });

      if (!alatRes.ok) throw new Error("Gagal membuat alat");

      const alatData: Alat = await alatRes.json();

      // Siapkan units
      const units: AlatUnit[] = nomorSeri.map((ns, i) => ({
        id: "",
        alat_id: alatData.id,
        kode_unit: `${alatData.kode_barcode}-${i + 1}`,
        nomor_seri: ns,
        kondisi: "Baik",
        status: "TERSEDIA",
      }));

      const unitRes = await fetch(`/api/inventory/alat-kalibrator/${alatData.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units }),
      });

      if (!unitRes.ok) throw new Error("Gagal menambahkan unit");

      alert("Alat dan unit berhasil disimpan!");
      setForm({
        id: "",
        kode_barcode: "",
        nama_alat: "",
        merk: "",
        type: "",
        jumlah: 0,
        created_at: "",
        updated_at: "",
        units: [],
      });
      setJumlah(0);
      setNomorSeri([]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan");
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
          <Input name="kode" value={form.kode_barcode} onChange={handleChange} />
          {fieldErrors.kode && (
            <p className="text-red-500 text-sm">{fieldErrors.kode}</p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Nama Alat</Label>
          <Input name="nama" value={form.nama_alat} onChange={handleChange} />
          {fieldErrors.nama && (
            <p className="text-red-500 text-sm">{fieldErrors.nama}</p>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Merek</Label>
          <Input name="merek" value={form.merk} onChange={handleChange} />
        </div>

        <div>
          <Label className="mb-2 block">Type</Label>
          <Input name="type" value={form.type} onChange={handleChange} />
        </div>

        <div>
          <Label className="mb-2 block">Tahun Beli</Label>
          <Input
            type="date"
            name="tahunBeli"
            value={form.created_at}
            onChange={handleChange}
          />
        </div>

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
