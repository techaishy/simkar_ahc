import { MapPin, Building2, ArrowRight, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { KotaWilayah as KotaWilayahType } from '@/lib/types/satuankerja';
import TambahWilayahForm from './FormWilayahKerja';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import SearchBar from '@/components/ui/searchbar';
import PaginationControl from '@/components/ui/PaginationControl';

export default function ListDaerah() {
  const router = useRouter();
  const [openTambah, setOpenTambah] = useState(false);
  const [kotaWilayahList, setKotaWilayahList] = useState<KotaWilayahType[]>([]);
  const [filteredKota, setFilteredKota] = useState<KotaWilayahType[]>([]);
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

        const kotaList: KotaWilayahType[] = json.lokasi.map((item: any) => ({
          id: item.id.toString(),
          nama_wilayah: item.name,
          deskripsi: item.deskripsi || "",     
          jumlahPuskesmas: item.jumlahPuskesmas || 0,
          jumlahKL: item.jumlahKL || 0,
          jumlahRS: item.jumlahRS || 0,
          populasi: item.populasi || "0",
        }));

        setKotaWilayahList(kotaList);
        setFilteredKota(kotaList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKota();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredKota(kotaWilayahList);
      return;
    }
    const lower = query.toLowerCase();
    setFilteredKota(
      kotaWilayahList.filter((a) => a.nama_wilayah.toLowerCase().includes(lower))
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

  const handleSave = (kotaBaru: KotaWilayahType) => {
    setKotaWilayahList((prev) => [...prev, kotaBaru]);
    setFilteredKota((prev) => [...prev, kotaBaru]);
    setOpenTambah(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 pt-4">
      <div className="max-w-7xl mx-auto space-y-6 relative">
        <div className="bg-white rounded-2xl shadow-xl p-6 relative">
          <div className="hidden sm:block absolute top-4 right-4">
            <Dialog open={openTambah} onOpenChange={setOpenTambah}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black text-white font-medium text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Tambah Data Wilayah
                </button>
              </DialogTrigger>
              <DialogContent
                aria-describedby="tambahWilayahDesc"
                className="bg-gradient-to-br from-black via-gray-950 to-gray-800 sm:max-w-3xl max-h-[80vh] overflow-auto"
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Tambah Data Wilayah Kerja
                  </DialogTitle>
                  <p id="tambahWilayahDesc" className="sr-only">
                    Form untuk menambahkan data wilayah kerja.
                  </p>
                </DialogHeader>
                <TambahWilayahForm
                  onSave={handleSave}
                  onClose={() => setOpenTambah(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] rounded-xl self-center sm:self-auto">
              <MapPin className="w-8 h-8 text-black" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Wilayah Kerja Kesehatan Aceh
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Pilih kota/kabupaten untuk melihat detail fasilitas kesehatan
              </p>
            </div>
          </div>

          {/* Statistik */}
          <div className="mt-6 flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl flex justify-between sm:block">
              <p className="text-sm text-blue-700 font-medium">Total Wilayah</p>
              <p className="text-2xl font-bold text-blue-900">{kotaWilayahList.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl flex justify-between sm:block">
              <p className="text-sm text-green-700 font-medium">Total Puskesmas</p>
              <p className="text-2xl font-bold text-green-900">
                {kotaWilayahList.reduce((sum, kota) => sum + (kota.jumlahPuskesmas || 0), 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl flex justify-between sm:block">
              <p className="text-sm text-purple-700 font-medium">Total Rumah Sakit</p>
              <p className="text-2xl font-bold text-purple-900">
                {kotaWilayahList.reduce((sum, kota) => sum + (kota.jumlahRS || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Search + List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex justify-end w-full">
            <div className="w-full sm:w-1/2 lg:w-1/3 pl-1 sm:pl-3 lg:pl-4">
              <SearchBar placeholder="Cari Kota..." onSearch={handleSearch} />
            </div>
          </div>

          {filteredKota.length === 0 ? (
            <p className="text-center text-gray-500">Data tidak ditemukan</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((kota) => (
                <div
                  key={kota.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  <div className="h-26 bg-gradient-to-r from-[#d2e67a] to-[#f9fc4f] relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                    <div className="relative text-center">
                      {(() => {
                        const words = kota.nama_wilayah.split(" ");
                        if (words.length === 1) {
                          return <h3 className="text-xl font-bold text-black drop-shadow-lg">{words[0]}</h3>;
                        } else {
                          const firstWord = words[0];
                          const rest = words.slice(1).join(" ");
                          return (
                            <>
                              <p className="text-sm font-medium text-gray-200 drop-shadow-lg">{firstWord}</p>
                              <h3 className="text-xl font-bold text-black drop-shadow-lg">{rest}</h3>
                            </>
                          );
                        }
                      })()}
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
                        <span className="font-semibold text-gray-800">{kota.jumlahKL}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigate(kota.nama_wilayah)}
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
            <div className="flex justify-center w-full">
               <PaginationControl
                  totalPages={totalPages}
                  currentPage={currentPage}
                  perPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
            </div>
          )}
        </div>

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
