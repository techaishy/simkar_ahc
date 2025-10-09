
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KondisiKalibrator, BarangItem } from '@/lib/types/suratkeluar'

export default function FormSuratKeluarAlat() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Nomor surat & keperluan jadi state terpisah
  const [nomorSurat, setNomorSurat] = useState('')
  const [keperluan, setKeperluan] = useState('')

  const [barangList, setBarangList] = useState<BarangItem[]>([
    {
      nomorSurat: '',
      nama: '',
      merk: '',
      type: '',
      noSeri: '',
      kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' },
    },
  ])

  const addRow = () => {
    setBarangList(prev => [
      ...prev,
      {
        nomorSurat: '',
        nama: '',
        merk: '',
        type: '',
        noSeri: '',
        kondisi: { accesoris: '', kabel: '', tombol: '', fungsi: '', fisik: '' },
      },
    ])
  }

  const generateNomorSurat = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')

    const storageKey = `lastNomorSurat_${month}_${year}`
    let lastNumber = parseInt(localStorage.getItem(storageKey) || '0', 10)
    lastNumber += 1

    localStorage.setItem(storageKey, lastNumber.toString())

    const nomor = `${String(lastNumber).padStart(3, '0')}/SSTA-AHC/${month}/${year}`
    setNomorSurat(nomor)
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
      year: 'numeric',
    })
  }

  const handleSubmit = async () => {
    setLoading(true)

    const newSurat = {
      nomorSurat,
      tanggal: getCurrentDate(),
      keperluan,
      barangList,
      statusManajer: 'Pending',
      statusAdmin: 'Pending',
      createdAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('surat_alat') || '[]')
      existing.push(newSurat)
      localStorage.setItem('surat_alat', JSON.stringify(existing))

      alert('✅ Surat keluar alat berhasil disimpan!')
      router.push('/surat-keluar/approval-surat-alat')
    } catch (err) {
      console.error('🔥 Error kirim surat:', err)
      alert('❌ Gagal mengirim surat. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
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
            name="nomorSurat"
            value={nomorSurat}
            onChange={(e) => setNomorSurat(e.target.value)}
            className="flex-1 px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Masukkan nomor surat atau generate otomatis"
          />
          <button
            type="button"
            onClick={generateNomorSurat}
            className="px-4 py-3 bg-gradient-to-br from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] transition-all duration-300 border-purple-200 rounded-sm hover:text-black text-white"
          >
            Auto
          </button>
        </div>
      </div>

      <p className="text-sm text-center sm:text-left">Tanggal: {getCurrentDate()}</p>

      {/* Keperluan */}
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

      {/* Tabel Barang */}
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th colSpan={4} className="border p-2 bg-gray-200 text-xs sm:text-sm">
                Spesifikasi Alat Kalibrator
              </th>
              <th colSpan={5} className="border p-2 bg-gray-200 text-xs sm:text-sm">
                Kondisi Alat Kalibrator
              </th>
              <th rowSpan={2} className="border p-2 text-xs sm:text-sm">
                Aksi
              </th>
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

                {/* Kondisi */}
                <td className="border p-1 sm:p-2">
                  <select
                    value={item.kondisi.accesoris}
                    onChange={(e) =>
                      handleKondisiChange(index, 'accesoris', e.target.value)
                    }
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
                        handleKondisiChange(
                          index,
                          key as keyof KondisiKalibrator,
                          e.target.value
                        )
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
