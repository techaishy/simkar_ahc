'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SuratKeluarAlat, alatItem } from '@/lib/types/suratkeluar';
import { useAuth } from '@/context/authContext';
import { KondisiAlat } from '@prisma/client';
import AlertMessage from "@/components/ui/alert"

export default function FormSuratKeluarAlat() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [alatList, setAlatList] = useState<
    {
      id: string;
      nama_alat: string;
      merk: string;
      type: string;
      units: { nomor_seri: string; kode_unit: string; kondisi: string }[];
    }[]
  >([]);

  useEffect(() => {
    if (user?.customId) {
      setSurat(prev => ({ ...prev, pembuatId: user.customId }));
    }
  }, [user]);

  const [searchTerm, setSearchTerm] = useState<Record<number, string>>({});

  // State utama surat
  const [surat, setSurat] = useState<SuratKeluarAlat>({
    nomorSurat: '',
    tanggal: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    keperluan: '',
    statusManajer: 'Pending',
    createdAt: new Date().toISOString(),
    pembuatId: '',
    daftarAlat: [
      {
        nomorSurat: '',
        nama: '',
        merk: '',
        type: '',
        noSeri: '',
        kodeUnit:'',
        kondisi: {
          accessories: '',
          kabel: '',
          tombol: '',
          fungsi: '',
          fisik: '',
        },
      },
    ],
  });

  // 🔹 Ambil data alat dari API
  useEffect(() => {
    const fetchAlat = async () => {
      try {
        console.log("🚀 Fetching data alat dari API...");
        const res = await fetch('/api/surat-alat/data');
        if (!res.ok) throw new Error('Gagal fetch data');
        const data = await res.json();
        setAlatList(data.alat || []);
      } catch (err) {
        console.error('❌ Gagal mengambil data alat:', err);
      }
    };
    fetchAlat();
  }, []);
  
  const [alertData, setAlertData] = useState({
    show: false,
    type: "success" as "success" | "error" | "info" | "warning",
    message: ""
  })

  // 🔹 Tambah baris baru
  const addRow = () => {
    
    setSurat(prev => ({
      ...prev,
       daftarAlat: [
        ...prev.daftarAlat,
        {
          nomorSurat: '',
          nama: '',
          merk: '',
          type: '',
          noSeri: '',
          kodeUnit:'',
          kondisi: {
            accessories: '',
            kabel: '',
            tombol: '',
            fungsi: '',
            fisik: '',
          },
        },
      ],
    }));
  };

  // 🔹 Hapus baris
  const removeRow = (index: number) => {
    setSurat(prev => ({
      ...prev,
      daftarAlat: prev.daftarAlat.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Update field alat
  const handleChangeItem = (
    index: number,
    field: keyof alatItem,
    value: string
  ) => {
    const updated = [...surat.daftarAlat];
    (updated[index] as any)[field] = value;
    setSurat(prev => ({ ...prev, daftarAlat: updated }));
  };

  // 🔹 Update kondisi alat
  const handleKondisiChange = (
    index: number,
    field: keyof alatItem['kondisi'],
    value: string
  ) => {
    const updated = [...surat.daftarAlat];
    updated[index].kondisi[field] = value;
    setSurat(prev => ({ ...prev, daftarAlat: updated }));
  };

  // 🔹 Generate nomor surat otomatis (local storage)
  const generateNomorSurat = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const key = `lastNomorSurat_${month}_${year}`;
    let last = parseInt(localStorage.getItem(key) || '0', 10);
    last += 1;
    localStorage.setItem(key, last.toString());
    const nomor = `${String(last).padStart(3, '0')}/SSTA-AHC/${month}/${year}`;
    setSurat(prev => ({ ...prev, nomorSurat: nomor }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const sanitizedSurat: SuratKeluarAlat = {
        ...surat,
        daftarAlat: surat.daftarAlat.map(item => ({
          ...item,
          nama: item.nama || "-",
          merk: item.merk || "-",
          type: item.type || "-",
          noSeri: item.noSeri || "-",
          kodeUnit: item.kodeUnit || "-",
          kondisi: {
            accessories: item.kondisi?.accessories ||  "Belum Dicek",
            kabel: item.kondisi?.kabel ||  KondisiAlat.BELUM_DICEK,
            tombol: item.kondisi?.tombol ||  KondisiAlat.BELUM_DICEK,
            fungsi: item.kondisi?.fungsi ||  KondisiAlat.BELUM_DICEK,
            fisik: item.kondisi?.fisik ||  KondisiAlat.BELUM_DICEK,
          },
        })),
      };

      const existing = JSON.parse(localStorage.getItem("surat_alat") || "[]");
      existing.push(sanitizedSurat);
      localStorage.setItem("surat_alat", JSON.stringify(existing));
      console.log("Surat Berhasil Ditambahkan ");

      // 🔹 Kirim ke API
      const res = await fetch("/api/surat-alat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedSurat),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Gagal submit ke API:", data);
        alert(`Gagal submit ke server: ${data.error || "Unknown error"}`);
        return;
      }
      alert("✅ Surat keluar alat berhasil disimpan!");

      router.push("/surat_keluar/approval_surat_alat");
    } catch (err) {
      console.error("❌ Error saat submit:", err);
      alert("Terjadi kesalahan saat submit surat.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <AlertMessage
        type={alertData.type}
        message={alertData.message}
        show={alertData.show}
        onClose={() => setAlertData({ ...alertData, show: false })}
      />
    <div className="p-4 sm:p-6 space-y-6">
  
      
      <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">
        SURAT SERAH TERIMA ALAT KALIBRATOR
      </h1>
     

      {/* Nomor Surat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor Surat
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={surat.nomorSurat}
            onChange={e =>
              setSurat(prev => ({ ...prev, nomorSurat: e.target.value }))
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Masukkan nomor surat atau generate otomatis"
          />
          <button
            type="button"
            onClick={generateNomorSurat}
            className="px-4 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Keperluan */}
      <div>
        <label className="block font-medium mb-2 text-sm sm:text-base">
          Keperluan
        </label>
        <input
          type="text"
          value={surat.keperluan}
          onChange={e =>
            setSurat(prev => ({ ...prev, keperluan: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
          placeholder="Isi keperluan surat..."
        />
      </div>

      {/* Tabel */}
      <div className="overflow-visible">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th colSpan={5} className="border p-2 bg-gray-200">
                Spesifikasi Alat Kalibrator
              </th>
              <th colSpan={5} className="border p-2 bg-gray-200">
                Kondisi Alat Kalibrator
              </th>
              <th rowSpan={2} className="border p-2">
                Aksi
              </th>
            </tr>
            <tr className="bg-gray-100 text-xs sm:text-sm text-center">
                <th className="border p-2">Nama Alat</th>
                <th className="border p-2">Merk</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Kode Unit</th>
                <th className="border p-2">No. Seri</th>
                <th className="border p-2">Accessories</th>
                <th className="border p-2">Kabel</th>
                <th className="border p-2">Tombol</th>
                <th className="border p-2">Fungsi</th>
                <th className="border p-2">Fisik</th>
            </tr>
          </thead>
          {/* 🔹 PERUBAHAN 2: Update tbody dengan searchTerm per-index */}
          <tbody>
            {surat.daftarAlat.map((item, index) => {
              const currentSearchTerm = searchTerm[index] || "";
              
              return (
                <tr key={index} className="text-center relative">
                  {/* 🔹 Nama Alat */}
                  <td className="border p-1 relative">
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChangeItem(index, "nama", val);
                        setSearchTerm({ ...searchTerm, [index]: val });
                      }}
                      onBlur={() => setTimeout(() => {
                        const newSearch = { ...searchTerm };
                        newSearch[index] = "";
                        setSearchTerm(newSearch);
                      }, 200)}
                      placeholder="Ketik nama alat..."
                      className="w-full border rounded px-2 py-1 text-xs"
                    />
                    {currentSearchTerm && (
                      <ul className="absolute z-20 bg-white border mt-1 rounded shadow-md w-full max-h-40 overflow-y-auto text-left text-xs">
                        {alatList
                          .filter((a) =>
                            a.nama_alat.toLowerCase().includes(currentSearchTerm.toLowerCase())
                          )
                          .map((a) => (
                            <li
                              key={a.id}
                              onMouseDown={() => {
                                handleChangeItem(index, "nama", a.nama_alat);
                                handleChangeItem(index, "merk", "");
                                handleChangeItem(index, "type", "");
                                handleChangeItem(index, "noSeri", "");
                                handleChangeItem(index, "kodeUnit", "");
                                const newSearch = { ...searchTerm };
                                newSearch[index] = "";
                                setSearchTerm(newSearch);
                              }}
                              className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                            >
                              {a.nama_alat}
                            </li>
                          ))}
                        {alatList.filter((a) =>
                          a.nama_alat.toLowerCase().includes(currentSearchTerm.toLowerCase())
                        ).length === 0 && (
                          <li className="px-2 py-1 text-gray-400 italic">Tidak ditemukan</li>
                        )}
                      </ul>
                    )}
                  </td>

                  {/* 🔹 Merk */}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={item.merk}
                      readOnly
                      className="w-full px-2 py-1 border rounded bg-gray-100 text-xs"
                    />
                  </td>

                  {/* 🔹 Type */}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={item.type}
                      readOnly
                      className="w-full px-2 py-1 border rounded bg-gray-100 text-xs"
                    />
                  </td>

                  {/* 🔹 Kode Unit */}
                  <td className="border p-1">
                    <select
                      value={item.kodeUnit || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChangeItem(index, "kodeUnit", val);

                        // cari alat dan unit terkait
                        const alat = alatList.find((a) => a.nama_alat === item.nama);
                        const unit = alat?.units?.find((u) => u.kode_unit === val);

                        // isi otomatis merk, type, noSeri (jika ada)
                        handleChangeItem(index, "merk", alat?.merk || "");
                        handleChangeItem(index, "type", alat?.type || "");
                        handleChangeItem(index, "noSeri", unit?.nomor_seri || "");
                      }}
                      disabled={!item.nama}
                      className={`w-full border rounded px-2 py-1 text-xs ${
                        !item.nama ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">-- Pilih Kode Unit --</option>
                      {alatList
                        .find((a) => a.nama_alat === item.nama)
                        ?.units?.filter((u) => {
                          const sudahDipakai = surat.daftarAlat.some(
                            (itm, i) => 
                              i !== index && 
                              itm.nama === item.nama && 
                              itm.kodeUnit === u.kode_unit
                          );
                          return !sudahDipakai;
                        })
                        .map((u, idx) => (
                          <option key={idx} value={u.kode_unit}>
                            {u.kode_unit}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* 🔹 Nomor Seri (opsional) */}
                  <td className="border p-1">
                    <input
                      type="text"
                      value={item.noSeri || ""}
                      readOnly
                      className="w-full px-2 py-1 border rounded bg-gray-100 text-xs"
                    />
                  </td>

                  {/* 🔹 Kondisi Alat */}
                  {(
                    ["accessories", "kabel", "tombol", "fungsi", "fisik"] as (
                      keyof alatItem["kondisi"]
                    )[]
                  ).map((key) => (
                    <td key={key} className="border p-1">
                      <select
                        value={item.kondisi[key]}
                        onChange={(e) => handleKondisiChange(index, key, e.target.value)}
                        className="w-full border rounded px-2 py-1 text-xs"
                      >
                        <option value="">-- Pilih --</option>
                        {key === "accessories" ? (
                          <>
                            <option value="Ada">Ada</option>
                            <option value="Tidak Ada">Tidak Ada</option>
                          </>
                        ) : (
                          <>
                            <option value="BAIK">Baik</option>
                            <option value="KURANG">Kurang</option>
                            <option value="RUSAK">Rusak</option>
                          </>
                        )}
                      </select>
                    </td>
                  ))}

                  {/* 🔹 Tombol Hapus */}
                  <td className="border p-1">
                    <button
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Tombol aksi */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          + Tambah Barang
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`py-2 px-4 bg-black text-white font-semibold rounded hover:bg-gray-800 text-sm ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Menyimpan...' : 'Submit'}
        </button>
      </div>
    </div>

    </>
  );
}
