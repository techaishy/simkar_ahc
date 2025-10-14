'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'
import { FormData } from '@/lib/types/satuankerja'


interface FormTambahFasilitasProps {
  tipe: 'puskesmas' | 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'klinik'
  onSave: (data: FormData) => void
  onCancel?: () => void
}

export default function FormTambahFasilitas({ tipe, onSave, onCancel }: FormTambahFasilitasProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    alamat: '',
    telp: '',
    jamBuka: '',
    jenisPelayanan: '',
    tipe: tipe,
    alat: []
  })

  const [currentAlat, setCurrentAlat] = useState({ nama: '', unit: 0 })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddAlat = () => {
    if (currentAlat.nama.trim() && currentAlat.unit > 0) {
      setFormData(prev => ({
        ...prev,
        alat: [...prev.alat, { ...currentAlat }]
      }))
      setCurrentAlat({ nama: '', unit: 0 })
    }
  }

  const handleRemoveAlat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alat: prev.alat.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nama.trim()) newErrors.nama = 'Nama fasilitas wajib diisi'
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi'
    if (!formData.telp.trim()) newErrors.telp = 'Nomor telepon wajib diisi'
    if (!formData.jamBuka.trim()) newErrors.jamBuka = 'Jam operasional wajib diisi'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const getTipeLabel = () => {
    switch (tipe) {
      case 'puskesmas': return 'Puskesmas'
      case 'rs-pemerintah': return 'Rumah Sakit Pemerintah'
      case 'rs-swasta': return 'Rumah Sakit Swasta'
      case 'rs-tentara': return 'Rumah Sakit Tentara'
      case 'klinik': return 'Klinik'
      default: return 'Fasilitas Kesehatan'
    }
  }

  const showJenisPelayanan = tipe !== 'puskesmas' && tipe !== 'klinik'

  return (

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar p-6 rounded-xl shadow-lg">
        
          <div>
            <h2 className="text-2xl font-bold text-gray-50">Tambah Data {getTipeLabel()}</h2>
            <p className="text-sm text-gray-100 mt-1">Isi semua informasi fasilitas kesehatan dengan lengkap</p>
          </div>
  

        {/* Nama Fasilitas */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-50">
            Nama {getTipeLabel()} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            placeholder={`Contoh: ${getTipeLabel()} Banda Sakti`}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
              errors.nama ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-50">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            placeholder="Contoh: Jl. Banda Sakti No. 123, Kecamatan Banda Sakti, Lhokseumawe"
            rows={3}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
              errors.alamat ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
        </div>

        {/* Telepon dan Jam Buka */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-50">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="telp"
              value={formData.telp}
              onChange={handleInputChange}
              placeholder="Contoh: 0645-41234"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                errors.telp ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.telp && <p className="text-sm text-red-500">{errors.telp}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-50">
              Jam Operasional <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jamBuka"
              value={formData.jamBuka}
              onChange={handleInputChange}
              placeholder="Contoh: 08:00 - 20:00 atau 24 Jam"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                errors.jamBuka ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jamBuka && <p className="text-sm text-red-500">{errors.jamBuka}</p>}
          </div>
        </div>

        {/* Jenis Pelayanan (untuk RS) */}
        {showJenisPelayanan && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-50">
              Jenis Pelayanan
            </label>
            <input
              type="text"
              name="jenisPelayanan"
              value={formData.jenisPelayanan}
              onChange={handleInputChange}
              placeholder="Contoh: IGD, Rawat Inap, ICU, Rawat Jalan"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500">Pisahkan dengan koma untuk beberapa jenis pelayanan</p>
          </div>
        )}

        {/* Data Alat Section */}
        <div className="space-y-4 pt-4 border-t-2 border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-50 flex items-center gap-2">
              Data Alat Kesehatan
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Opsional
            </span>
          </div>

          {/* Input Alat Baru */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Tambah Alat Baru:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 text-black space-y-1">
                <label className="block text-xs font-medium text-gray-600">Nama Alat</label>
                <input
                  type="text"
                  value={currentAlat.nama}
                  onChange={(e) => setCurrentAlat(prev => ({ ...prev, nama: e.target.value }))}
                  placeholder="Contoh: Tensimeter Digital, Stetoskop"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                />
              </div>
              <div className="space-y-1 text-black">
                <label className="block text-xs font-medium text-gray-600">Jumlah Unit</label>
                <input
                  type="number"
                  min="1"
                  value={currentAlat.unit || ''}
                  onChange={(e) => setCurrentAlat(prev => ({ ...prev, unit: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAlat}
              disabled={!currentAlat.nama.trim() || currentAlat.unit <= 0}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Alat ke Daftar
            </button>
          </div>

          {/* Daftar Alat */}
          {formData.alat.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Daftar Alat yang Ditambahkan:
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {formData.alat.map((alat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{alat.nama}</p>
                      <p className="text-sm text-indigo-600 font-medium mt-1">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded">
                          {alat.unit} unit
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlat(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Hapus alat"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">Belum ada alat yang ditambahkan</p>
              <p className="text-gray-400 text-xs mt-1">Tambahkan alat menggunakan form di atas</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-50 hover:text-black rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
          >
            <Save className="w-5 h-5" />
            Simpan Data Fasilitas
          </button>
        </div>
      </form>
  )
}