"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { KotaWilayah } from "@/lib/types/satuankerja";

type Props = {
  onSave: (kotaBaru: KotaWilayah) => void;
  onClose?: () => void;
};

export default function TambahWilayahForm({ onSave, onClose }: Props) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<KotaWilayah>({
    id: "",
    nama_wilayah: "",
    deskripsi: "",
    jumlahPuskesmas: 0,
    jumlahRS: 0,
    jumlahKL: 0,
    populasi: "",
    puskesmas: [],
    rsPemerintah: [],
    rsSwasta: [],
    rsTentara: [],
    klinik: [],
  });

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.id.trim()) errors.id = "ID Kota wajib diisi.";
    if (!formData.nama_wilayah.trim()) errors.nama_wilayah = "Nama Kota wajib diisi.";
    if (!(formData.deskripsi ?? "").trim()) errors.deskripsi = "Deskripsi wajib diisi.";
    return errors;
  };

  const capitalizeWords = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "nama_wilayah"
          ? capitalizeWords(value) 
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; 
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/satuan-kerja/wilayah-kerja/wilayah/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_wilayah: formData.nama_wilayah,
          deskripsi: formData.deskripsi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menambahkan data wilayah ❌");
        return;
      }

      if (onSave) onSave(formData);
      alert("✅ Data wilayah berhasil ditambahkan!");

      if (onClose) onClose();
      else router.push("/satuan_kerja");
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
    >
      {/* ID Kota */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-1">
          ID Kota (slug)
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="contoh: banda-aceh"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
        {fieldErrors.id && (
          <p className="text-sm text-red-400 mt-1">{fieldErrors.id}</p>
        )}
      </div>

      {/* Nama Kota */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-1">
          Nama Kota
        </label>
        <input
          type="text"
          name="nama_wilayah"
          value={formData.nama_wilayah}
          onChange={handleChange}
          placeholder="contoh: Kota Banda Aceh"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
        />
        {fieldErrors.nama_wilayah && (
          <p className="text-sm text-red-400 mt-1">
            {fieldErrors.nama_wilayah}
          </p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-50 mb-1">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          placeholder="contoh: Ibu kota Provinsi Aceh dengan fasilitas kesehatan lengkap"
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
          rows={3}
        />
        {fieldErrors.deskripsi && (
          <p className="text-sm text-red-400 mt-1">{fieldErrors.deskripsi}</p>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className="px-6 py-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] text-white hover:text-black px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
        >
          <Save className="w-5 h-5" />
          {isSubmitting ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>
    </form>
  );
}
