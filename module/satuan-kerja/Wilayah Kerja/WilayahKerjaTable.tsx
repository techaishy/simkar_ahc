'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Hospital, Shield, MapPin, Phone, Clock, ArrowLeft, Package, ChevronDown, ChevronUp } from 'lucide-react'
import type { Puskesmas, RumahSakit, Klinik, KotaWilayah, KategoriWilayah } from '@/lib/types/satuankerja'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PaginationControl from '@/components/ui/PaginationControl'
import FormTambahFasilitas from './FormFK'
import SearchBar from '@/components/ui/searchbar'

export default function WilayahKerjaTable({ kotaId }: { kotaId: string }) {
  const [activeTab, setActiveTab] = useState<KategoriWilayah>('puskesmas')
  const router = useRouter()
  const [openTambah, setOpenTambah] = useState(false)
  const [kotaWilayah, setKotaWilayah] = useState<KotaWilayah | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const itemsPerPage = 6
  const [expandedAlat, setExpandedAlat] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/satuan-kerja/wilayah-kerja/detail/${kotaId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Gagal mengambil data")
        setKotaWilayah(data)
      } catch (err) {
        console.error(err)
        setKotaWilayah(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [kotaId])

  const handleBack = () => router.push("/satuan_kerja")
  const toggleAlatDropdown = (id: string) => setExpandedAlat(prev => (prev === id ? null : id))

  if (loading) return <p className="text-center mt-10 text-gray-500">Memuat data...</p>
  if (!kotaWilayah)
    return (
      <div className="p-8 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-2">Data tidak ditemukan</h1>
        <p>Wilayah dengan ID “{kotaId}” belum memiliki data.</p>
        <button
          onClick={handleBack}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>
    )

  const tabs = [
    { id: 'puskesmas', label: 'Puskesmas', icon: Building2, count: kotaWilayah.puskesmas.length },
    { id: 'rs-pemerintah', label: 'RS Pemerintah', icon: Hospital, count: kotaWilayah.rsPemerintah.length },
    { id: 'rs-swasta', label: 'RS Swasta', icon: Hospital, count: kotaWilayah.rsSwasta.length },
    { id: 'rs-tentara', label: 'RS Tentara', icon: Shield, count: kotaWilayah.rsTentara.length },
    { id: 'klinik', label: 'Klinik', icon: Building2, count: kotaWilayah.klinik.length }
  ]

  // Ambil data per tab
  const getCurrentItems = () => {
    if (!kotaWilayah) return []

    const mapping: Record<KategoriWilayah, readonly (Puskesmas | RumahSakit | Klinik)[]> = {
      'puskesmas': kotaWilayah.puskesmas,
      'rs-pemerintah': kotaWilayah.rsPemerintah,
      'rs-swasta': kotaWilayah.rsSwasta,
      'rs-tentara': kotaWilayah.rsTentara,
      'klinik': kotaWilayah.klinik
    }

    const data = mapping[activeTab] || []

    // Filter berdasarkan search
    const filtered = data.filter(item =>
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.alamat.toLowerCase().includes(search.toLowerCase())
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filtered.slice(indexOfFirstItem, indexOfLastItem)
  }

  const totalPages = Math.ceil(
    (({
      'puskesmas': kotaWilayah.puskesmas.length,
      'rs-pemerintah': kotaWilayah.rsPemerintah.length,
      'rs-swasta': kotaWilayah.rsSwasta.length,
      'rs-tentara': kotaWilayah.rsTentara.length,
      'klinik': kotaWilayah.klinik.length
    }[activeTab] || 0) / itemsPerPage)
  )

  const renderData = () => {
    const data = getCurrentItems()

    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">Tidak ada data tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.nama}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                    <span>{item.alamat}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>{item.telp}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>{item.jamBuka}</span>
                  </div>

                  {'jenisPelayanan' in item && item.jenisPelayanan && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pelayanan:</p>
                      <p className="text-sm text-gray-700">{item.jenisPelayanan}</p>
                    </div>
                  )}

                  {/* Dropdown Alat */}
                  {'alat' in item && item.alat && item.alat.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200 relative">
                      <button
                        onClick={() => toggleAlatDropdown(item.id)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span className="font-medium text-sm">Data Alat ({item.alat.length})</span>
                        </div>
                        {expandedAlat === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {expandedAlat === item.id && (
                        <div className="absolute left-0 w-full mt-1 bg-gray-50 rounded-lg p-3 space-y-2 shadow-lg z-10 animate-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                          {item.alat.map((alat, index) => (
                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                              <span className="text-sm text-gray-700 font-medium flex-1 truncate" title={alat.nama_alat}>
                                {alat.nama_alat}
                              </span>
                              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                {alat.unit} unit
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            perPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-6 pt-1 pb-1">
      <div className="flex flex-wrap justify-between items-center gap-3 my-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </button>

        <Dialog open={openTambah} onOpenChange={setOpenTambah}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Tambah Data Wilayah
            </button>
          </DialogTrigger>

          <DialogContent
            className="bg-transparent border-none shadow-none p-0 sm:max-w-3xl max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            {/* Form tampil sebagai isi utama */}
            <div className="bg-gradient-to-br from-black via-gray-950 to-gray-800 rounded-xl px-6 py-6 w-full">
              <FormTambahFasilitas
                tipe={activeTab}
                wilayahKerja={kotaWilayah.nama_wilayah} 
                onSave={(faskesBaru) => {
                  setKotaWilayah(prev => {
                    if (!prev) return prev
                    const mapping: Record<KategoriWilayah, any[]> = {
                      'puskesmas': prev.puskesmas,
                      'rs-pemerintah': prev.rsPemerintah,
                      'rs-swasta': prev.rsSwasta,
                      'rs-tentara': prev.rsTentara,
                      'klinik': prev.klinik
                    }
                    return {
                      ...prev,
                      [activeTab]: [...mapping[activeTab], faskesBaru]
                    }
                  })
                  setOpenTambah(false)
                }}
                onCancel={() => setOpenTambah(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{kotaWilayah.nama_wilayah}</h1>
          <p className="text-gray-600 text-sm sm:text-base">Daftar fasilitas kesehatan di wilayah ini</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6 border-b border-gray-200 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as KategoriWilayah); setCurrentPage(1); setSearch('') }}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-medium text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'text-white bg-black shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${activeTab === tab.id ? 'bg-gray-50 text-black' : 'bg-gray-300'}`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

         <div className="flex justify-end mb-6 w-full pl-4 sm:pl-6 lg:pl-8">
          <div className="w-full sm:w-1/2 lg:w-1/3">
            <SearchBar
              placeholder="Cari nama atau alamat fasilitas..."
              onSearch={(q) => { setSearch(q); setCurrentPage(1) }}
            />
          </div>
        </div>
          {renderData()}
        </div>
      </div>
    </div>
  )
}
