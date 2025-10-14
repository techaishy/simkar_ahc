"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Hospital,
  Shield,
  MapPin,
  Phone,
  Clock,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import FormTambahFasilitas from "./FormFK";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { WilayahKerjaProps, KotaWilayah, Alat, FormData } from "@/lib/types/satuankerja";

export default function WilayahKerja({ kotaId }: { kotaId: string },{}: WilayahKerjaProps) {
  // const { kotaId } = useParams() as { kotaId: string };
  const [activeTab, setActiveTab] = useState<'puskesmas' | 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'klinik'>("puskesmas");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [openTambah, setOpenTambah] = useState(false);
  const [KotaWilayah, setKotaWilayah] = useState<FormData | null>(null);
  const [expandedAlat, setExpandedAlat] = useState<{ [key: string]: boolean }>({});

  const handleSave = (FasilitasBaru: FormData) => {
    setKotaWilayah(FasilitasBaru);
    setOpenTambah(false);
  };

  const handleBack = () => router.push("/satuan_kerja");

  const toggleAlatDropdown = (itemId: string) => {
    const key = `${activeTab}-${itemId}`;
    setExpandedAlat((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dataWilayah: Record<string, KotaWilayah> = useMemo(() => ({
    lhokseumawe: {
      id: "lhokseumawe",
      nama: "Kota Lhokseumawe",
      jumlahPuskesmas: 2,
      jumlahRS: 1,
      jumlahKL: 0,
      puskesmas: [
        {
          id: "1",
          nama: "Puskesmas Banda Sakti",
          alamat: "Jl. Banda Sakti, Lhokseumawe",
          latitude: 5.188,
          longitude: 97.135,
          radius: 100,
        },
        {
          id: "2",
          nama: "Puskesmas Muara Dua",
          alamat: "Jl. Muara Dua, Lhokseumawe",
          latitude: 5.191,
          longitude: 97.136,
          radius: 100,
        },
      ],
      rsPemerintah: [
        {
          id: "1",
          nama: "RSUD Kota Lhokseumawe",
          alamat: "Jl. Banda Aceh-Medan, Lhokseumawe",
          jenisPelayanan: "IGD, Rawat Inap",
          latitude: 5.190,
          longitude: 97.134,
          radius: 150,
        },
      ],
      rsSwasta: [],
      rsTentara: [],
      klinik: [],
    },
    "banda-aceh": {
      id: "banda-aceh",
      nama: "Kota Banda Aceh",
      jumlahPuskesmas: 2,
      jumlahRS: 2,
      jumlahKL: 1,
      puskesmas: [
        {
          id: "1",
          nama: "Puskesmas Kuta Alam",
          alamat: "Jl. Kuta Alam, Banda Aceh",
          latitude: 5.556,
          longitude: 95.324,
          radius: 100,
        },
        {
          id: "2",
          nama: "Puskesmas Meuraxa",
          alamat: "Jl. Meuraxa, Banda Aceh",
          latitude: 5.559,
          longitude: 95.325,
          radius: 100,
        },
      ],
      rsPemerintah: [
        {
          id: "1",
          nama: "RSUD Zainoel Abidin",
          alamat: "Jl. Tgk Daud Beureueh, Banda Aceh",
          jenisPelayanan: "IGD, ICU, Rawat Inap",
          latitude: 5.560,
          longitude: 95.326,
          radius: 200,
        },
      ],
      rsSwasta: [
        {
          id: "1",
          nama: "RSU Harapan Bunda",
          alamat: "Jl. Mr. Mohd Hasan, Banda Aceh",
          jenisPelayanan: "Rawat Inap, Rawat Jalan",
          latitude: 5.561,
          longitude: 95.327,
          radius: 150,
        },
      ],
      rsTentara: [],
      klinik: [],
    },
  }), []);

  const kotaData = dataWilayah[kotaId];
  if (!kotaData) {
    return (
      <div className="p-8 text-center text-gray-600">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </button>
        <h1 className="text-2xl font-semibold mb-2">Data tidak ditemukan</h1>
        <p>Wilayah dengan ID "{kotaId}" belum memiliki data.</p>
      </div>
    );
  }

  const tabs = [
    { id: "puskesmas", label: "Puskesmas", icon: Building2, count: kotaData.puskesmas.length },
    { id: "rs-pemerintah", label: "RS Pemerintah", icon: Hospital, count: kotaData.rsPemerintah.length },
    { id: "rs-swasta", label: "RS Swasta", icon: Hospital, count: kotaData.rsSwasta.length },
    { id: "rs-tentara", label: "RS Tentara", icon: Shield, count: kotaData.rsTentara.length },
    { id: "klinik", label: "Klinik", icon: Building2, count: kotaData.klinik.length },
  ];

  const getDataByTab = () => {
    switch (activeTab) {
      case "puskesmas": return kotaData.puskesmas;
      case "rs-pemerintah": return kotaData.rsPemerintah;
      case "rs-swasta": return kotaData.rsSwasta;
      case "rs-tentara": return kotaData.rsTentara;
      case "klinik": return kotaData.klinik;
      default: return [];
    }
  };

  const filteredData = useMemo(() => {
    const currentData = getDataByTab();
    if (!search.trim()) return currentData;
    const q = search.toLowerCase();
    return currentData.filter(item => item.nama.toLowerCase().includes(q) || item.alamat.toLowerCase().includes(q));
  }, [activeTab, search, kotaData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-3 sm:px-6 pt-0 pb-5">
      {/* Tombol kembali dan tambah data */}
      <div className="flex flex-wrap gap-2 justify-between mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu
        </button>

        <Dialog open={openTambah} onOpenChange={setOpenTambah}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium rounded-lg shadow-md">
              Tambah Data FasKes
            </button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-white">Tambah Data Fasilitas Kesehatan</DialogTitle>
            </DialogHeader>
            <FormTambahFasilitas tipe={activeTab} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{kotaData.nama}</h1>
          <p className="text-gray-600 text-sm sm:text-base">Daftar fasilitas kesehatan di wilayah ini</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6 border-b border-gray-200 pb-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setSearch(""); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                    activeTab === tab.id ? "text-white bg-gradient-to-br from-black to-gray-800 shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${activeTab === tab.id ? "bg-gray-50 text-black" : "bg-gray-300"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="text-black relative mb-6">
            <Search className="absolute left-3 top-2.5 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau alamat fasilitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm pl-10 pr-3 py-2 border border-gray-800 placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Data List */}
          {filteredData.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map(item => {
                // const itemKey = `${activeTab}-${item.id}`;
                // const isExpanded = expandedAlat[itemKey];

                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.nama}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                        <span>{item.alamat}</span>
                      </div>
                      {item.telp && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span>{item.telp}</span>
                        </div>
                      )}
                      {item.jamBuka && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span>{item.jamBuka}</span>
                        </div>
                      )}
                      {/* {"jenisPelayanan" in item && item.jenisPelayanan && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pelayanan:</p>
                          <p className="text-sm text-gray-700">{item.jenisPelayanan ?? ""}</p>
                        </div>
                      )} */}

                      {/* Dropdown Alat - dikomentari */}
                      {/*
                      "alat" in item && item.alat && item.alat.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => toggleAlatDropdown(item.id)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              <span className="font-medium text-sm">Data Alat ({item.alat.length})</span>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                              {item.alat.map((alat, index) => (
                                <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                                  <span className="text-sm text-gray-700 font-medium flex-1">{alat.nama}</span>
                                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{alat.unit} unit</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                      */}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center">Tidak ada data sesuai pencarian.</p>
          )}
        </div>
      </div>
    </div>
  );
}
