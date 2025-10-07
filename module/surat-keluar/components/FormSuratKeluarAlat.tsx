// 'use client'

// import React, { useState } from 'react'
// import { KondisiKalibrator } from '@/lib/types/suratkeluar'
// import { BarangItem } from '@/lib/types/suratkeluar'


// export default function FormSuratKeluarAlat() {
//   const [keperluan, setKeperluan] = useState('')
//   const [barangList, setBarangList] = useState<BarangItem[]>([
//     {
//       nama: '',
//       merk: '',
//       type: '',
//       noSeri: '',
//       kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' }
//     }
//   ])

//   const addRow = () => {
//     setBarangList(prev => [
//       ...prev,
//       {
//         nama: '',
//         merk: '',
//         type: '',
//         noSeri: '',
//         kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' }
//       }
//     ])
//   }

//   const handleChange = (index: number, field: keyof BarangItem, value: any) => {
//     const updated = [...barangList]
//     // @ts-ignore
//     updated[index][field] = value
//     setBarangList(updated)
//   }

//   const handleKondisiChange = (index: number, field: keyof KondisiKalibrator, value: string) => {
//     const updated = [...barangList]
//     updated[index].kondisi[field] = value
//     setBarangList(updated)
//   }

//   const removeRow = (index: number) => {
//     setBarangList(barangList.filter((_, i) => i !== index))
//   }

//   const getCurrentDate = () => {
//     const today = new Date()
//     return today.toLocaleDateString('id-ID', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     })
//   }

//   const handleSubmit = () => {
//     console.log({
//       tanggal: getCurrentDate(),
//       keperluan,
//       barangList
//     })
//     alert('Data berhasil dicetak ke console.log')
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-xl font-bold">SURAT SERAH TERIMA BARANG</h1>
//       <p className="text-sm">Tanggal: {getCurrentDate()}</p>

//       <div>
//         <label className="block font-medium mb-2">Keperluan</label>
//         <input
//           type="text"
//           value={keperluan}
//           onChange={(e) => setKeperluan(e.target.value)}
//           className="w-full px-4 py-2 border rounded"
//           placeholder="Isi keperluan surat..."
//         />
//       </div>

//       <table className="w-full border text-sm">
//         <thead>
//           <tr className="bg-gray-100 text-center">
//           <th colSpan={4} className="border p-2 bg-gray-200">Spesifikasi Alat Kalibrator</th>
//             <th colSpan={5} className="border p-2 bg-gray-200">Kondisi Alat Kalibrator</th>
//             <th rowSpan={2} className="border p-2">Aksi</th>
//           </tr>
//           <tr className="bg-gray-100 text-center">
//           <th rowSpan={2} className="border p-2">Nama Alat</th>
//             <th rowSpan={2} className="border p-2">Merk</th>
//             <th rowSpan={2} className="border p-2">Type</th>
//             <th rowSpan={2} className="border p-2">No. Seri</th>
//             <th className="border p-2">Accesoris</th>
//             <th className="border p-2">Kabel</th>
//             <th className="border p-2">Tombol</th>
//             <th className="border p-2">Fungsi</th>
//             <th className="border p-2">Fisik</th>
//           </tr>
//         </thead>

//         <tbody>
//           {barangList.map((item, index) => (
//             <tr key={index} className="text-center">
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={item.nama}
//                   onChange={(e) => handleChange(index, 'nama', e.target.value)}
//                   className="w-full px-2 py-1 border rounded"
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={item.merk}
//                   onChange={(e) => handleChange(index, 'merk', e.target.value)}
//                   className="w-full px-2 py-1 border rounded"
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={item.type}
//                   onChange={(e) => handleChange(index, 'type', e.target.value)}
//                   className="w-full px-2 py-1 border rounded"
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={item.noSeri}
//                   onChange={(e) => handleChange(index, 'noSeri', e.target.value)}
//                   className="w-full px-2 py-1 border rounded"
//                 />
//               </td>

//               {/* Kondisi kalibrator */}
//               <td className="border p-2">
//                 <select
//                   value={item.kondisi.accesoris}
//                   onChange={(e) => handleKondisiChange(index, 'accesoris', e.target.value)}
//                   className="w-full border rounded px-2 py-1"
//                 >
//                   <option value="">-- Pilih --</option>
//                   <option value="Ada">Ada</option>
//                   <option value="Tidak Ada">Tidak Ada</option>
//                 </select>
//               </td>
//               {['kabel', 'tombol', 'fungsi', 'fisik'].map((key) => (
//                 <td key={key} className="border p-2">
//                   <select
//                     value={item.kondisi[key as keyof KondisiKalibrator]}
//                     onChange={(e) =>
//                       handleKondisiChange(index, key as keyof KondisiKalibrator, e.target.value)
//                     }
//                     className="w-full border rounded px-2 py-1"
//                   >
//                     <option value="">-- Pilih --</option>
//                     <option value="Baik">Baik</option>
//                     <option value="Kurang">Kurang</option>
//                     <option value="Rusak">Rusak</option>
//                   </select>
//                 </td>
//               ))}

//               <td className="border p-2">
//                 <button
//                   onClick={() => removeRow(index)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   Hapus
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex gap-3">
//         <button
//           onClick={addRow}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           + Tambah Barang
//         </button>

//         <button
//           onClick={handleSubmit}
//           className="flex-1 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
//         >
//           Submit / Preview
//         </button>
//       </div>
//     </div>
//   )
// }
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KondisiKalibrator, BarangItem } from '@/lib/types/suratkeluar'

export default function FormSuratKeluarAlat() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [keperluan, setKeperluan] = useState('')
  const [barangList, setBarangList] = useState<BarangItem[]>([
    {
      nama: '',
      merk: '',
      type: '',
      noSeri: '',
      kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' }
    }
  ])

  const addRow = () => {
    setBarangList(prev => [
      ...prev,
      {
        nama: '',
        merk: '',
        type: '',
        noSeri: '',
        kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' }
      }
    ])
  }

  const handleChange = (index: number, field: keyof BarangItem, value: any) => {
    const updated = [...barangList]
    // @ts-ignore
    updated[index][field] = value
    setBarangList(updated)
  }

  const handleKondisiChange = (index: number, field: keyof KondisiKalibrator, value: string) => {
    const updated = [...barangList]
    updated[index].kondisi[field] = value
    setBarangList(updated)
  }

  const removeRow = (index: number) => {
    setBarangList(barangList.filter((_, i) => i !== index))
  }

  const getCurrentDate = () => {
    const today = new Date()
    return today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSubmit = async () => {
    setLoading(true);
  
    const newSurat = {
      tanggal: getCurrentDate(),
      keperluan,
      barangList,
      statusManajer: "Pending",
      statusAdmin: "Pending",
      createdAt: new Date().toISOString(),
    };
  
    try {
      // ✅ Gunakan key yang sama dengan halaman ApprovalSuratAlat
      const existing = JSON.parse(localStorage.getItem("surat_alat") || "[]");
      existing.push(newSurat);
      localStorage.setItem("surat_alat", JSON.stringify(existing));
  
      alert("✅ Surat keluar alat berhasil disimpan!");
      router.push("/approval-surat-alat"); // arahkan ke halaman approval (optional)
    } catch (err) {
      console.error("🔥 Error kirim surat:", err);
      alert("❌ Gagal mengirim surat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async () => {
  //   setLoading(true)

  //   const newSurat = {
  //     tanggal: getCurrentDate(),
  //     keperluan,
  //     barangList,
  //     statusOwner: 'Pending',
  //     statusAdm: 'Pending',
  //     createdAt: new Date().toISOString()
  //   }

  //   try {
  //     // Simpan ke localStorage
  //     const existing = JSON.parse(localStorage.getItem("suratAlat") || "[]");
  //     existing.push(newSurat);
  //     localStorage.setItem("suratAlat", JSON.stringify(existing));
  
  //     alert("✅ Surat keluar alat berhasil disimpan!");
  //   } catch (err) {
  //     console.error("🔥 Error kirim surat:", err);
  //     alert("❌ Gagal mengirim surat. Silakan coba lagi.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">
        SURAT SERAH TERIMA ALAT KALIBRATOR
      </h1>
      <p className="text-sm text-center sm:text-left">Tanggal: {getCurrentDate()}</p>

      <div>
        <label className="block font-medium mb-2 text-sm sm:text-base">Keperluan</label>
        <input
          type="text"
          value={keperluan}
          onChange={(e) => setKeperluan(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
          placeholder="Isi keperluan surat..."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th colSpan={4} className="border p-2 bg-gray-200 text-xs sm:text-sm">Spesifikasi Alat Kalibrator</th>
              <th colSpan={5} className="border p-2 bg-gray-200 text-xs sm:text-sm">Kondisi Alat Kalibrator</th>
              <th rowSpan={2} className="border p-2 text-xs sm:text-sm">Aksi</th>
            </tr>
            <tr className="bg-gray-100 text-center text-xs sm:text-sm">
              <th className="border p-2">Nama Alat</th>
              <th className="border p-2">Merk</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">No. Seri</th>
              <th className="border p-2">Accesoris</th>
              <th className="border p-2">Kabel</th>
              <th className="border p-2">Tombol</th>
              <th className="border p-2">Fungsi</th>
              <th className="border p-2">Fisik</th>
            </tr>
          </thead>

          <tbody>
            {barangList.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-1 sm:p-2">
                  <input
                    type="text"
                    value={item.nama}
                    onChange={(e) => handleChange(index, 'nama', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="text"
                    value={item.merk}
                    onChange={(e) => handleChange(index, 'merk', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="text"
                    value={item.noSeri}
                    onChange={(e) => handleChange(index, 'noSeri', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  />
                </td>

                <td className="border p-1 sm:p-2">
                  <select
                    value={item.kondisi.accesoris}
                    onChange={(e) => handleKondisiChange(index, 'accesoris', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs sm:text-sm"
                  >
                    <option value="">-- Pilih --</option>
                    <option value="Ada">Ada</option>
                    <option value="Tidak Ada">Tidak Ada</option>
                  </select>
                </td>
                {['kabel', 'tombol', 'fungsi', 'fisik'].map((key) => (
                  <td key={key} className="border p-1 sm:p-2">
                    <select
                      value={item.kondisi[key as keyof KondisiKalibrator]}
                      onChange={(e) =>
                        handleKondisiChange(index, key as keyof KondisiKalibrator, e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 text-xs sm:text-sm"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="Baik">Baik</option>
                      <option value="Kurang">Kurang</option>
                      <option value="Rusak">Rusak</option>
                    </select>
                  </td>
                ))}

                <td className="border p-1 sm:p-2">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={addRow}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          + Tambah Barang
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`py-2 px-4 bg-black text-white font-semibold rounded hover:bg-gray-800 text-sm sm:text-base ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Menyimpan...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
