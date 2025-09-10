"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Karyawan } from "../../../lib/types/karyawan";
import { UserRole } from "@/lib/types/user";

type Props = {
  onSave: (data: Karyawan) => void;
  initialData?: Karyawan;
};

export default function PegawaiForm({ onSave, initialData }: Props) {
  const [form, setForm] = useState<Karyawan & { role?: UserRole }>(
    initialData
      ? initialData
      : {
          id: "",
          customId: "",
          name: "",
          nip: "",
          nik: "",
          npwp: "",
          emailPribadi: "",
          phone: "",
          address: "",
          birthDate: "",
          tempatLahir: "",
          jenisKelamin: "",
          agama: "",
          joinDate: "",
          position: "",
          department: "",
          pendidikan: "",
          golongan: "",
          kontakDarurat: "",
          hubunganDarurat: "",
          status: "AKTIF",
          role: "KARYAWAN",
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitToAPI = async () => {
    setLoading(true);
    setError("");
    try {
      const url = initialData
        ? `/api/pegawai/${initialData.customId}`
        : `/api/pegawai`;

      const method = initialData ? "PUT" : "POST";

      const bodyData: any = {
        ...form,
        role: form.role, 
      };

      if (initialData) {
        bodyData.tp = form.phone;
        bodyData.jK = form.jenisKelamin;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data");

      onSave(initialData ? data : data.karyawan);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitToAPI();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar"
    >
      {error && <p className="text-red-600">{error}</p>}

      {/* Identitas Pribadi */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Identitas Pribadi</h3>
        <div>
          <Label className="mb-2 block">Nama Pegawai</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-2 block">NIK</Label>
          <Input name="nik" value={form.nik} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-2 block">NPWP</Label>
          <Input name="npwp" value={form.npwp} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Email Pribadi</Label>
          <Input type="email" name="emailPribadi" value={form.emailPribadi} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Telepon</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Alamat</Label>
          <Input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Tempat Lahir</Label>
            <Input name="tempatLahir" value={form.tempatLahir} onChange={handleChange} />
          </div>
          <div>
            <Label className="mb-2 block">Tanggal Lahir</Label>
            <Input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label className="mb-2 block">Jenis Kelamin</Label>
          <Select value={form.jenisKelamin} onValueChange={(val) => setForm({ ...form, jenisKelamin: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Agama</Label>
          <Input name="agama" value={form.agama} onChange={handleChange} />
        </div>
      </div>

      {/* Data Kepegawaian */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Data Kepegawaian</h3>
        <div>
          <Label className="mb-2 block">NIP</Label>
          <Input name="nip" value={form.nip} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Jabatan</Label>
          <Input name="position" value={form.position} onChange={handleChange} required />
        </div>
        <div>
          <Label className="mb-2 block">Departemen</Label>
          <Input name="department" value={form.department} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Tanggal Masuk</Label>
          <Input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Pendidikan</Label>
          <Input name="pendidikan" value={form.pendidikan} onChange={handleChange} />
        </div>
        <div>
          <Label className="mb-2 block">Golongan</Label>
          <Input name="golongan" value={form.golongan} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Kontak Darurat</Label>
            <Input name="kontakDarurat" value={form.kontakDarurat} onChange={handleChange} />
          </div>
          <div>
            <Label className="mb-2 block">Hubungan</Label>
            <Input name="hubunganDarurat" value={form.hubunganDarurat} onChange={handleChange} />
          </div>
        </div>

        {/* Role hanya muncul saat create */}
        {!initialData && (
          <div>
            <Label className="mb-2 block">Role</Label>
            <Select value={form.role} onValueChange={(val: UserRole) => setForm({ ...form, role: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="DIREKTUR">Direktur</SelectItem>
                <SelectItem value="MANAJER">Manajer</SelectItem>
                <SelectItem value="KARYAWAN">Karyawan</SelectItem>
                <SelectItem value="TEKNISI">Teknisi</SelectItem>
                <SelectItem value="KEUANGAN">Keuangan</SelectItem>
                <SelectItem value="KEPALA_GUDANG">Kepala Gudang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status */}
        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={form.status}
            onValueChange={(val: "AKTIF" | "NONAKTIF" | "DITANGGUHKAN") => setForm({ ...form, status: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AKTIF">Aktif</SelectItem>
              <SelectItem value="NONAKTIF">Nonaktif</SelectItem>
              <SelectItem value="DITANGGUHKAN">Ditangguhkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tombol Submit */}
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
