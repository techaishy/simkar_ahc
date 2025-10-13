

'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Building2, Hospital, Shield, MapPin, Phone, Clock, ArrowLeft } from 'lucide-react'
import type { Puskesmas, RumahSakit, Klinik } from '@/lib/types/satuankerja'
import { WilayahKerjaProps } from '@/lib/types/satuankerja'
import TambahWilayahForm from './FormWilayahKerja'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import { KotaWilayah } from '@/lib/types/satuankerja'

export default function WilayahKerja({}: WilayahKerjaProps) {
  const { kotaId } = useParams() as { kotaId: string }
  const [activeTab, setActiveTab] = useState('puskesmas')
  const router = useRouter();
  const [openTambah, setOpenTambah] = useState(false);
  const [KotaWilayah, setKotaWilayah] = useState<KotaWilayah | null>(null);

  const handleSave = (kotaBaru: KotaWilayah) => {
    setKotaWilayah(kotaBaru);
    setOpenTambah(false);
  };

  const handleBack = () => {
    router.push("/satuan_kerja"); 
  };

  const dataWilayah = useMemo(() => ({
    'lhokseumawe': {
      nama: 'Kota Lhokseumawe',
      puskesmas: [
        { id: 1, nama: "Puskesmas Banda Sakti", alamat: "Jl. Banda Sakti, Lhokseumawe", telp: "0645-41234", jamBuka: "08:00 - 20:00" },
        { id: 2, nama: "Puskesmas Muara Dua", alamat: "Jl. Muara Dua, Lhokseumawe", telp: "0645-41235", jamBuka: "08:00 - 20:00" },
      ],
      rsPemerintah: [
        { id: 1, nama: "RSUD Kota Lhokseumawe", alamat: "Jl. Banda Aceh-Medan, Lhokseumawe", telp: "0645-46334", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap" },
      ],
      rsSwasta: [],
      rsTentara: [],
      klinik: []
    },
    'banda-aceh': {
      nama: 'Kota Banda Aceh',
      puskesmas: [
        { id: 1, nama: "Puskesmas Kuta Alam", alamat: "Jl. Kuta Alam, Banda Aceh", telp: "0651-41000", jamBuka: "08:00 - 20:00" },
        { id: 2, nama: "Puskesmas Meuraxa", alamat: "Jl. Meuraxa, Banda Aceh", telp: "0651-41001", jamBuka: "08:00 - 20:00" },
      ],
      rsPemerintah: [
        { id: 1, nama: "RSUD Zainoel Abidin", alamat: "Jl. Tgk Daud Beureueh, Banda Aceh", telp: "0651-21000", jamBuka: "24 Jam", jenisPelayanan: "IGD, ICU, Rawat Inap" },
      ],
      rsSwasta: [
        { id: 1, nama: "RSU Harapan Bunda", alamat: "Jl. Mr. Mohd Hasan, Banda Aceh", telp: "0651-22000", jamBuka: "24 Jam", jenisPelayanan: "Rawat Inap, Rawat Jalan" },
      ],
      rsTentara: [],
      klinik: []
    },
  } as const), [])

  type KotaKey = keyof typeof dataWilayah
  const kotaData = dataWilayah[kotaId as KotaKey]

  if (!kotaData) {
  
    return (
      <>
        <div className='p-0 pl-10 pt-4'> <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black  to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Kembali ke Menu</span>
    </button>
    </div>

  
      <div className="p-8 text-center text-gray-600">
        
        <h1 className="text-2xl font-semibold mb-2">Data tidak ditemukan</h1>
        <p>Wilayah dengan ID “{kotaId}” belum memiliki data.</p>
      </div>
      </>
    )
  }


  const tabs = [
    { id: 'puskesmas', label: 'Puskesmas', icon: Building2, count: kotaData.puskesmas.length },
    { id: 'rs-pemerintah', label: 'RS Pemerintah', icon: Hospital, count: kotaData.rsPemerintah.length },
    { id: 'rs-swasta', label: 'RS Swasta', icon: Hospital, count: kotaData.rsSwasta.length },
    { id: 'rs-tentara', label: 'RS Tentara', icon: Shield, count: kotaData.rsTentara.length },
    { id: 'klinik', label: 'Klinik', icon: Building2, count: kotaData.rsTentara.length }
  ]

  const renderData = () => {
    let data: readonly (Puskesmas | RumahSakit | Klinik)[] = []
    switch (activeTab) {
      case 'puskesmas': data = kotaData.puskesmas; break
      case 'rs-pemerintah': data = kotaData.rsPemerintah; break
      case 'rs-swasta': data = kotaData.rsSwasta; break
      case 'rs-tentara': data = kotaData.rsTentara; break
      case 'klinik': data = kotaData.klinik; break
    }

    if (!data.length)
      return <p className="text-gray-500 text-sm text-center">Tidak ada data tersedia.</p>

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-200"
          >
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
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-6 pt-0 pb-5">
        <div className='flex flex-wrap gap-2 justify-end mb-4'>
      <Dialog open={openTambah} onOpenChange={setOpenTambah}>
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black  to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>Tambah Data Wilayah</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Tambah Data Wilayah Kerja</DialogTitle>
          </DialogHeader>
          <TambahWilayahForm onSave={handleSave} />
          </DialogContent>
          </Dialog>

    </div>
       <div className='p-0 pl-5 pt-2'> <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black  to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Kembali ke Menu</span>
    </button>
    </div>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-5 text-center sm:text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{kotaData.nama}</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Daftar fasilitas kesehatan di wilayah ini
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6 border-b border-gray-200 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'text-white t bg-gradient-to-br from-black  to-gray-800 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id ? 'bg-gray-50 text-black' : 'bg-gray-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Data List */}
          {renderData()}
        </div>
      </div>
    </div>
  )
}
