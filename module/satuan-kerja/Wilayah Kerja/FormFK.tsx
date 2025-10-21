'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, MapPin } from 'lucide-react'
import { FormData, Alat } from '@/lib/types/satuankerja'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface FormTambahFasilitasProps {
  tipe: 'puskesmas' | 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'klinik'
  wilayahKerja: string
  onSave: (data: FormData) => void
  onCancel?: () => void
}

function MapPicker({ onSelect, lokasi }: { onSelect: (lat: number, lng: number) => void, lokasi: { lat: number; lng: number } | null }) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  useEffect(() => {
    if (lokasi) {
      map.flyTo([lokasi.lat, lokasi.lng], 16, { animate: true })
    }
  }, [lokasi, map])

  return null
}

export default function FormTambahFasilitas({ tipe, wilayahKerja, onSave, onCancel }: FormTambahFasilitasProps) {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    alamat: '',
    telp: '',
    jamBuka: '',
    jenisPelayanan: '',
    tipe: tipe,
    alat: [],
    // latitude: 0,
    // longitude: 0,
    // radius:20,
  })

  const [lokasi, setLokasi] = useState<{ lat: number; lng: number } | null>(null)
  const [currentAlat, setCurrentAlat] = useState<{ nama_alat: string; unit: number }>({ nama_alat: '', unit: 0 })
  const [filteredAlat, setFilteredAlat] = useState<{ id_alat: string; nama_alat: string }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchWilayahKerja = async () => {
      if (!wilayahKerja.trim()) return
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(wilayahKerja)}&format=json&limit=1`
        )
        const data = await res.json()
        if (data.length > 0) {
          const { lat, lon } = data[0]
          const latNum = parseFloat(lat)
          const lonNum = parseFloat(lon)
          setLokasi({ lat: latNum, lng: lonNum })
          setFormData(prev => ({ ...prev, latitude: latNum, longitude: lonNum }))
        }
      } catch (err) {
        console.error('Gagal fetch wilayah kerja:', err)
      }
    }

    fetchWilayahKerja()
  }, [wilayahKerja])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleAddAlat = () => {
    if (currentAlat.nama_alat.trim() && currentAlat.unit > 0) {
      const sudahAda = formData.alat.some(
        (a) => (a.nama_alat ?? '').toLowerCase() === (currentAlat.nama_alat ?? '').toLowerCase()
      )
      if (sudahAda) {
        alert('Alat ini sudah ada di daftar!')
        return
      }
      const newAlat: Alat = { ...currentAlat }
      setFormData(prev => ({ ...prev, alat: [...prev.alat, newAlat] }))
      setCurrentAlat({ nama_alat: '', unit: 0 })
      setShowDropdown(false)
    }
  }

  const handleRemoveAlat = (index: number) => {
    setFormData(prev => ({ ...prev, alat: prev.alat.filter((_, i) => i !== index) }))
  }

  const handleMapSelect = (lat: number, lng: number) => {
    setLokasi({ lat, lng })
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
  }

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) {
        const { lat, lon } = data[0]
        handleMapSelect(parseFloat(lat), parseFloat(lon))
        setSearchQuery('')
      } else {
        alert('Lokasi tidak ditemukan')
      }
    } catch (err) {
      console.error(err)
      alert('Gagal mencari lokasi')
    } finally {
      setSearching(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nama.trim()) newErrors.nama = 'Nama fasilitas wajib diisi'
    if (!formData.alamat.trim()) newErrors.alamat = 'Alamat wajib diisi'
    if (!formData.telp.trim()) newErrors.telp = 'Nomor telepon wajib diisi'
    if (!formData.jamBuka.trim()) newErrors.jamBuka = 'Jam operasional wajib diisi'
    if (!lokasi) newErrors.lokasi = 'Lokasi harus dipilih di peta'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (submitting) return;
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const tipeToKodeSK: Record<string, string> = {
        puskesmas: "TSK-005",
        "rs-pemerintah": "TSK-004",
        "rs-swasta": "TSK-006",
        "rs-tentara": "TSK-002",
        klinik: "TSK-003",
      }
      const kodeSK = tipeToKodeSK[tipe] || "TSK-001"
       const payload = {
      ...formData,
      kodeSK,
      wilayahKerja: wilayahKerja
    }

    const res = await fetch('/api/satuan-kerja/wilayah-kerja/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const result = await res.json()
      alert('✅ Data fasilitas berhasil disimpan!')
      onSave(result)
    } else {
      const err = await res.json()
      alert(`❌ Gagal menyimpan data: ${err.message || 'Terjadi kesalahan'}`)
    }
  } catch (err) {
    console.error('❌ Error submit:', err)
    alert('Terjadi kesalahan saat mengirim data.')
  } finally {
    setSubmitting(false)
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
    <form onSubmit={handleSubmit} className="from-gray-900 via-gray-950 to-black text-gray-50 space-y-6 p-6 rounded-xl custom-scrollbar shadow-lg">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-50">Tambah Data {getTipeLabel()}</h2>
        <p className="text-sm text-gray-100 mt-1">Isi semua informasi fasilitas kesehatan dengan lengkap</p>
      </div>

      {/* Nama */}
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
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.nama ? 'border-red-500' : 'border-gray-300'}`}
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
          placeholder="Contoh: Jl. Banda Sakti No. 123"
          rows={3}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none ${errors.alamat ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
      </div>

      {/* Map */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-50 items-center gap-2">
          <MapPin className="w-4 h-4" /> Pilih Lokasi Fasilitas <span className="text-red-500">*</span>
        </label>

        {/* Input + Button tetap */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi alamat/kota..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
          <button
            type="button"
            onClick={handleSearchLocation}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            disabled={!searchQuery.trim() || searching}
          >
            Cari
          </button>
        </div>

        <div className="h-72 rounded-lg overflow-hidden border-2 border-gray-300 mt-2">
          <MapContainer
            center={lokasi ? [lokasi.lat, lokasi.lng] : [-6.2, 106.8]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPicker onSelect={handleMapSelect} lokasi={lokasi} />
            {lokasi && <Marker position={[lokasi.lat, lokasi.lng]} icon={markerIcon} />}
          </MapContainer>
        </div>

        {lokasi && (
          <p className="text-xs text-gray-400 mt-1">
            Koordinat: <span className="text-indigo-400">{lokasi.lat.toFixed(6)}, {lokasi.lng.toFixed(6)}</span>
          </p>
        )}
        {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
      </div>

      {/* Telepon & Jam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-50">Nomor Telepon <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="telp"
            value={formData.telp}
            onChange={handleInputChange}
            placeholder="Contoh: 0645-41234"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.telp ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.telp && <p className="text-sm text-red-500">{errors.telp}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-50">Jam Operasional <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="jamBuka"
            value={formData.jamBuka}
            onChange={handleInputChange}
            placeholder="Contoh: 08:00 - 20:00 atau 24 Jam"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.jamBuka ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.jamBuka && <p className="text-sm text-red-500">{errors.jamBuka}</p>}
        </div>
      </div>

      {/* Jenis Pelayanan */}
      {showJenisPelayanan && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-50">Jenis Pelayanan</label>
          <input
            type="text"
            name="jenisPelayanan"
            value={formData.jenisPelayanan}
            onChange={handleInputChange}
            placeholder="Contoh: IGD, Rawat Inap, ICU, Rawat Jalan"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500">Pisahkan dengan koma untuk beberapa jenis pelayanan</p>
        </div>
      )}

      {/* Data Alat */}
      <div className="space-y-4 pt-4 border-t-2 border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-50 flex items-center gap-2">Data Alat Kesehatan</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Opsional</span>
        </div>

        {/* Input Alat */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 space-y-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Tambah Alat Baru:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 text-black space-y-1 relative">
            <label className="block text-xs font-medium text-gray-600">Nama Alat</label>
            <div className="relative">
              <input
                type="text"
                value={currentAlat.nama_alat}
                onChange={async (e) => {
                  const val = e.target.value
                  setCurrentAlat(prev => ({ ...prev, nama_alat: val }))

                  if (val.trim().length > 0) {
                    try {
                      const res = await fetch(`/api/satuan-kerja/wilayah-kerja/data/alat?q=${encodeURIComponent(val)}`)
                      if (res.ok) {
                        const data = await res.json()
                        const allAlat: { id_alat: string; nama_alat: string }[] = data.alat || []
                        const existingNames = new Set(
                          formData.alat.map((a) => a.nama_alat.toLowerCase())
                        )
                        const filtered = allAlat.filter(
                          (a) => !existingNames.has(a.nama_alat.toLowerCase())
                        )

                        setFilteredAlat(filtered)
                        setShowDropdown(filtered.length > 0)
                      }
                    } catch (err) {
                      console.error('❌ Error search alat:', err)
                    }
                  } else {
                    setShowDropdown(false)
                  }
                }}
                placeholder="Cari nama alat kalibrasi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              />

              {showDropdown && filteredAlat.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm">
                  {filteredAlat.map((a) => (
                    <li
                      key={a.id_alat}
                      onClick={() => {
                        setCurrentAlat(prev => ({ ...prev, nama_alat: a.nama_alat }))
                        setShowDropdown(false)
                      }}
                      className="px-3 py-2 hover:bg-indigo-100 cursor-pointer text-gray-700"
                    >
                      {a.nama_alat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

            <div className="space-y-1 text-black">
              <label className="block text-xs font-medium text-gray-600">Jumlah Unit</label>
              <input
                type="number"
                min="1"
                value={currentAlat.unit || ''}
                onChange={(e) => setCurrentAlat(prev => ({ ...prev, unit: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddAlat}
            disabled={!currentAlat.nama_alat.trim() || currentAlat.unit <= 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Alat ke Daftar
          </button>
        </div>

        {/* List Alat */}
        {formData.alat.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Daftar Alat yang Ditambahkan:
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {formData.alat.map((alat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all group">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{alat.nama_alat}</p>
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded">{alat.unit} unit</span>
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
