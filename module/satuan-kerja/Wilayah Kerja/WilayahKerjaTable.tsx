// 'use client'

// import { useState } from 'react';
// import { Building2, Hospital, Shield, MapPin, Phone, Clock } from 'lucide-react';
// import type { Puskesmas, RumahSakit } from '@/lib/types/satuankerja';

// export default function WilayahKerja() {
//   const [activeTab, setActiveTab] = useState('puskesmas');

//   const dataPuskesmas: Puskesmas[] = [
//     { id: 1, nama: "Puskesmas Banda Sakti", alamat: "Jl. Banda Sakti, Lhokseumawe", telp: "0645-41234", jamBuka: "08:00 - 20:00" },
//     { id: 2, nama: "Puskesmas Muara Dua", alamat: "Jl. Muara Dua, Lhokseumawe", telp: "0645-41235", jamBuka: "08:00 - 20:00" },
//     { id: 3, nama: "Puskesmas Blang Mangat", alamat: "Jl. Blang Mangat, Lhokseumawe", telp: "0645-41236", jamBuka: "08:00 - 20:00" },
//     { id: 4, nama: "Puskesmas Muara Satu", alamat: "Jl. Muara Satu, Lhokseumawe", telp: "0645-41237", jamBuka: "08:00 - 20:00" },
//     { id: 5, nama: "Puskesmas Cunda", alamat: "Jl. Cunda, Lhokseumawe", telp: "0645-41238", jamBuka: "08:00 - 20:00" },
//     { id: 6, nama: "Puskesmas Pusong", alamat: "Jl. Pusong, Lhokseumawe", telp: "0645-41239", jamBuka: "08:00 - 20:00" },
//     { id: 7, nama: "Puskesmas Dewantara", alamat: "Jl. Dewantara, Lhokseumawe", telp: "0645-41240", jamBuka: "08:00 - 20:00" },
//     { id: 8, nama: "Puskesmas Syamtalira Bayu", alamat: "Jl. Syamtalira Bayu, Lhokseumawe", telp: "0645-41241", jamBuka: "08:00 - 20:00" },
//     { id: 9, nama: "Puskesmas Tanah Luas", alamat: "Jl. Tanah Luas, Lhokseumawe", telp: "0645-41242", jamBuka: "08:00 - 20:00" },
//     { id: 10, nama: "Puskesmas Tanah Pasir", alamat: "Jl. Tanah Pasir, Lhokseumawe", telp: "0645-41243", jamBuka: "08:00 - 20:00" }
//   ];

//   const dataRSPemerintah: RumahSakit[] = [
//     { id: 1, nama: "RSUD Kota Lhokseumawe", alamat: "Jl. Banda Aceh-Medan, Lhokseumawe", telp: "0645-46334", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan, ICU" },
//     { id: 2, nama: "RSUD Cut Meutia", alamat: "Jl. Cut Meutia, Lhokseumawe", telp: "0645-46335", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan, ICU" }
//   ];

//   const dataRSSwasta: RumahSakit[] = [
//     { id: 1, nama: "RS Sentra Medika", alamat: "Jl. Merdeka, Lhokseumawe", telp: "0645-41500", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan" },
//     { id: 2, nama: "RS Muhammadiyah", alamat: "Jl. Muhammadiyah, Lhokseumawe", telp: "0645-41600", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan" },
//     { id: 3, nama: "RS Medika Lhokseumawe", alamat: "Jl. Medan-Banda Aceh, Lhokseumawe", telp: "0645-41700", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan, ICU" }
//   ];

//   const dataRSTentara: RumahSakit[] = [
//     { id: 1, nama: "Rumah Sakit TK. III Lhokseumawe", alamat: "Jl. Pertahanan, Lhokseumawe", telp: "0645-41800", jamBuka: "24 Jam", jenisPelayanan: "IGD, Rawat Inap, Rawat Jalan, Umum & TNI" }
//   ];

//   const tabs = [
//     { id: 'puskesmas', label: 'Puskesmas', icon: Building2, count: dataPuskesmas.length },
//     { id: 'rs-pemerintah', label: 'RS Pemerintah', icon: Hospital, count: dataRSPemerintah.length },
//     { id: 'rs-swasta', label: 'RS Swasta', icon: Hospital, count: dataRSSwasta.length },
//     { id: 'rs-tentara', label: 'RS Tentara', icon: Shield, count: dataRSTentara.length }
//   ];

//   const renderData = () => {
//     let data: (Puskesmas | RumahSakit)[] = [];
    
//     switch(activeTab) {  
//       case 'puskesmas':
//         data = dataPuskesmas;
//         break;
//       case 'rs-pemerintah':
//         data = dataRSPemerintah;
//         break;
//       case 'rs-swasta':
//         data = dataRSSwasta;
//         break;
//       case 'rs-tentara':
//         data = dataRSTentara;
//         break;
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {data.map((item) => (
//           <div key={item.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.nama}</h3>
//             <div className="space-y-2">
//               <div className="flex items-start gap-2 text-gray-600">
//                 <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
//                 <span className="text-sm">{item.alamat}</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Phone className="w-4 h-4 flex-shrink-0 text-green-600" />
//                 <span className="text-sm">{item.telp}</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Clock className="w-4 h-4 flex-shrink-0 text-orange-600" />
//                 <span className="text-sm">{item.jamBuka}</span>
//               </div>
//               {/* ✅ PERBAIKAN: Type guard untuk jenisPelayanan */}
//               {'jenisPelayanan' in item && item.jenisPelayanan && (
//                 <div className="mt-3 pt-3 border-t border-gray-200">
//                   <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pelayanan:</p>
//                   <p className="text-sm text-gray-700">{item.jenisPelayanan}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Wilayah Kerja Kesehatan</h1>
//           <p className="text-gray-600">Dinas Kesehatan Kota Lhokseumawe</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl p-6">
//           <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-200 pb-4">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
//                     activeTab === tab.id
//                       ? 'bg-blue-600 text-white shadow-md'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{tab.label}</span>
//                   <span className={`text-xs px-2 py-1 rounded-full ${
//                     activeTab === tab.id ? 'bg-blue-700' : 'bg-gray-300'
//                   }`}>
//                     {tab.count}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {tabs.find(t => t.id === activeTab)?.label}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Total: {tabs.find(t => t.id === activeTab)?.count} fasilitas kesehatan
//             </p>
//           </div>

//           {renderData()}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Building2, Hospital, Shield, MapPin, Phone, Clock } from 'lucide-react'
import type { Puskesmas, RumahSakit } from '@/lib/types/satuankerja'

interface WilayahKerjaProps {
    kotaId: string;
  }

export default function WilayahKerja() {
  const { kotaId } = useParams() as { kotaId: string }
  const [activeTab, setActiveTab] = useState('puskesmas')

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
      rsTentara: []
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
      rsTentara: []
    },
  }as const), []) 

  
  type KotaKey = keyof typeof dataWilayah 

  
  const kotaData = dataWilayah[kotaId as KotaKey] 

  if (!kotaData) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h1 className="text-2xl font-semibold mb-2">Data tidak ditemukan</h1>
        <p>Wilayah dengan ID “{kotaId}” belum memiliki data.</p>
      </div>
    )
  }


  const tabs = [
    { id: 'puskesmas', label: 'Puskesmas', icon: Building2, count: kotaData.puskesmas.length },
    { id: 'rs-pemerintah', label: 'RS Pemerintah', icon: Hospital, count: kotaData.rsPemerintah.length },
    { id: 'rs-swasta', label: 'RS Swasta', icon: Hospital, count: kotaData.rsSwasta.length },
    { id: 'rs-tentara', label: 'RS Tentara', icon: Shield, count: kotaData.rsTentara.length }
  ]

  const renderData = () => {
    let data: readonly (Puskesmas | RumahSakit)[] = []
    switch (activeTab) {
      case 'puskesmas': data = kotaData.puskesmas; break
      case 'rs-pemerintah': data = kotaData.rsPemerintah; break
      case 'rs-swasta': data = kotaData.rsSwasta; break
      case 'rs-tentara': data = kotaData.rsTentara; break
    }

    if (!data.length) return <p className="text-gray-500 text-sm">Tidak ada data tersedia.</p>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.nama}</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-1 text-blue-600" />
                <span className="text-sm">{item.alamat}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-sm">{item.telp}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm">{item.jamBuka}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{kotaData.nama}</h1>
          <p className="text-gray-600">Daftar fasilitas kesehatan di wilayah ini</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-200 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.id ? 'bg-blue-700' : 'bg-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {renderData()}
        </div>
      </div>
    </div>
  )
}
