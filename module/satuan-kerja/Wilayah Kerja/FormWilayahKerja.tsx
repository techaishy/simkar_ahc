
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { KotaWilayah } from "@/lib/types/satuankerja";


type Props = {
  onSave: (kotaBaru: KotaWilayah) => void;
  onClose?: () => void;
};

export default function TambahWilayahForm({ onSave }: Props) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<KotaWilayah>({
    id: "",
    nama: "",
    deskripsi: "",
    jumlahPuskesmas: 0,
    jumlahRS: 0,
    populasi: "",
  });

  const validate = () => {
    const errors: Record<string, string> = {};;
    if (!formData.id.trim()) errors.id = "ID Kota wajib diisi.";
    if (!formData.nama.trim()) errors.nama = "Nama Kota wajib diisi.";
    if ((formData.jumlahPuskesmas ?? 0) <= 0) errors.jumlahPuskesmas = "Jumlah Puskesmas wajib diisi.";

    if ((formData.jumlahRS ?? 0 ) <= 0) 
      errors.jumlahRS = "Jumlah Rumah Sakit wajib diisi.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
};



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "jumlahPuskesmas" || name === "jumlahRS"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validate()) {
      
    return;}
   
   if (onSave){ 
  onSave(formData);}
    alert("Data wilayah berhasil ditambahkan 🚀");
    router.push("/satuan_kerja");

  };

  return (
   
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* ID Kota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Kota (slug)
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="contoh: banda-aceh"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Nama Kota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kota
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="contoh: Kota Banda Aceh"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="contoh: Ibu kota Provinsi Aceh dengan fasilitas kesehatan lengkap"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                rows={3}
                required
              />
            </div>

            {/* Jumlah Puskesmas & RS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Puskesmas
                </label>
                <input
                  type="number"
                  name="jumlahPuskesmas"
                  value={formData.jumlahPuskesmas}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Rumah Sakit
                </label>
                <input
                  type="number"
                  name="jumlahRS"
                  value={formData.jumlahRS}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            </div>

            {/* Populasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Populasi
              </label>
              <input
                type="text"
                name="populasi"
                value={formData.populasi}
                onChange={handleChange}
                placeholder="contoh: 265.111"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black"
                required
              />
            </div>
        
        

        {/* FOOTER BUTTON */}
        <div className="px-6 py-4 border-t">
          <button
            type="submit"
            
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] text-white hover:text-black px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Save className="w-5 h-5" />
            Simpan Data
          </button>
        </div>
        </form>
  );
}