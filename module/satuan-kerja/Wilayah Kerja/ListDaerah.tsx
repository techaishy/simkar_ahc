  import { MapPin, Building2, ArrowRight, Users } from 'lucide-react';
  import { useRouter } from 'next/navigation';
  import { KotaWilayah } from '@/lib/types/satuankerja';
  import TambahWilayahForm from './FormWilayahKerja'
  import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
  import { useState, useEffect } from 'react';
  import SearchBar from '@/components/ui/searchbar';
  import PaginationControl from '@/components/ui/PaginationControl';
  
export default function ListDaerah() {
  const router = useRouter();
  const [openTambah, setOpenTambah] = useState(false);
  const [KotaWilayah, setKotaWilayah] = useState<KotaWilayah[]>([]);
  const [filteredKota, setFilteredKota] = useState<KotaWilayah[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  function generateIdFromName(name: string) {
    return name.toLowerCase().trim().replace(/\s+/g, "-");
  }

   useEffect(() => {
    const fetchKota = async () => {
      try {
        const res = await fetch("/api/satuan-kerja/wilayah-kerja/data");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();

        const kotaList: KotaWilayah[] = json.lokasi.map((item: any) => ({
          id: item.id.toString(),
          nama: item.name,
          deskripsi: item.deskripsi || "",     
          jumlahPuskesmas: item.jumlahPuskesmas || 0,
          jumlahKL: item.jumlahKL || 0,
          jumlahRS: item.jumlahRS || 0,
          populasi: item.populasi || "0",
        }));

        setKotaWilayah(kotaList);
        setFilteredKota(kotaList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKota();
  }, []);

    const handleSave = (kotaBaru: KotaWilayah) => {
      setKotaWilayah((prev) => [...prev, kotaBaru]);
      setFilteredKota((prev) => [...prev, kotaBaru]);
      setOpenTambah(false);
    } ;
    
    const allKota = KotaWilayah;

    useEffect(() => {
      setFilteredKota(allKota);
    }, [KotaWilayah]);

    const handleSearch = (query: string) => {
      if (!query) {
        setFilteredKota(allKota);
        return;
      }
      const lower = query.toLowerCase();
      setFilteredKota(
        KotaWilayah.filter((a) => a.nama.toLowerCase().includes(lower))
      );
      setCurrentPage(1); 
    };

  const handleNavigate = (namaKota: string) => {
    const slug = generateIdFromName(namaKota);
    router.push(`/satuan_kerja/${slug}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKota.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKota.length / itemsPerPage);

 return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 pt-4">
    <div className="max-w-7xl mx-auto space-y-6 relative">
      {/* Header + Statistik */}
      <div className="bg-white rounded-2xl shadow-xl p-6 relative">
        {/* Tombol Tambah di kanan atas */}
        <div className="absolute top-4 right-4">
          <Dialog open={openTambah} onOpenChange={setOpenTambah}>
            <DialogTrigger asChild>
              {!openTambah && (
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Tambah Data Wilayah
                </button>
              )}
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Tambah Data Wilayah Kerja
                </DialogTitle>
              </DialogHeader>
              <TambahWilayahForm
                onSave={(kotaBaru) => {
                  setKotaWilayah((prev) => [...prev, kotaBaru]);
                  setFilteredKota((prev) => [...prev, kotaBaru]);
                  setOpenTambah(false);
                }}
                onClose={() => setOpenTambah(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] rounded-xl">
            <MapPin className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Wilayah Kerja Kesehatan Aceh
            </h1>
            <p className="text-gray-600 mt-1">
              Pilih kota/kabupaten untuk melihat detail fasilitas kesehatan
            </p>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <p className="text-sm text-blue-700 font-medium">Total Wilayah</p>
            <p className="text-2xl font-bold text-blue-900">{KotaWilayah.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <p className="text-sm text-green-700 font-medium">Total Puskesmas</p>
            <p className="text-2xl font-bold text-green-900">
              {KotaWilayah.reduce((sum, kota) => sum + (kota.jumlahPuskesmas || 0), 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <p className="text-sm text-purple-700 font-medium">Total Rumah Sakit</p>
            <p className="text-2xl font-bold text-purple-900">
              {KotaWilayah.reduce((sum, kota) => sum + (kota.jumlahRS || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar di bawah header/statistik */}
      <div className="flex justify-end mt-4 mb-6">
        <div className="w-full sm:w-64">
          <SearchBar placeholder="Cari Kota..." onSearch={handleSearch} />
        </div>
      </div>

      {/* Grid Cards */}
      {filteredKota.length === 0 ? (
        <p className="text-center text-gray-500">Data tidak ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((kota) => (
            <div
              key={kota.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              <div className="h-26 bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-black drop-shadow-lg">{kota.nama}</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">Puskesmas</span>
                    </div>
                    <span className="font-semibold text-gray-800">{kota.jumlahPuskesmas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Rumah Sakit</span>
                    </div>
                    <span className="font-semibold text-gray-800">{kota.jumlahRS}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Klinik</span>
                    </div>
                    <span className="font-semibold text-gray-800">{kota.jumlahKL }</span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate(generateIdFromName(kota.nama))}
                  className="w-full bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] hover:from-black hover:to-gray-800 text-black hover:text-gray-200 font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                >
                  Lihat Detail{" "}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center w-full">
          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 bg-white/80 backdrop-blur rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600">
          Data fasilitas kesehatan dikelola oleh Dinas Kesehatan Provinsi Aceh
        </p>
      </div>
    </div>
  </div>
);

}