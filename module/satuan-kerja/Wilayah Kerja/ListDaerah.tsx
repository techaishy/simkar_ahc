import { MapPin, Building2, ArrowRight, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface KotaWilayah {
  id: string;
  nama: string;
  deskripsi: string;
  jumlahPuskesmas: number;
  jumlahRS: number;
  populasi: string;
  image?: string;
}

export default function ListDaerah() {
  const router = useRouter();

  const dataKota: KotaWilayah[] = [
    {
      id: 'lhokseumawe',
      nama: 'Kota Lhokseumawe',
      deskripsi: 'Kota industri dan pelabuhan strategis di pesisir timur Aceh',
      jumlahPuskesmas: 10,
      jumlahRS: 6,
      populasi: '188.713'
    },
    {
      id: 'banda-aceh',
      nama: 'Kota Banda Aceh',
      deskripsi: 'Ibu kota Provinsi Aceh dengan fasilitas kesehatan lengkap',
      jumlahPuskesmas: 12,
      jumlahRS: 8,
      populasi: '265.111'
    },
    {
      id: 'langsa',
      nama: 'Kota Langsa',
      deskripsi: 'Kota perdagangan dengan akses kesehatan yang memadai',
      jumlahPuskesmas: 8,
      jumlahRS: 4,
      populasi: '185.971'
    },
    {
      id: 'sabang',
      nama: 'Kota Sabang',
      deskripsi: 'Kota pulau dengan layanan kesehatan kepulauan',
      jumlahPuskesmas: 4,
      jumlahRS: 2,
      populasi: '43.337'
    },
    {
      id: 'subulussalam',
      nama: 'Kota Subulussalam',
      deskripsi: 'Kota dengan pelayanan kesehatan berbasis komunitas',
      jumlahPuskesmas: 6,
      jumlahRS: 3,
      populasi: '91.488'
    },
    {
      id: 'aceh-besar',
      nama: 'Kabupaten Aceh Besar',
      deskripsi: 'Kabupaten dengan jaringan puskesmas yang luas',
      jumlahPuskesmas: 25,
      jumlahRS: 5,
      populasi: '420.000'
    }
  ];

  const handleNavigate = (kotaId: string) => {
    router.push(`/satuan_kerja/wilayah_kerja/${kotaId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <MapPin className="w-8 h-8 text-white" />
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
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <p className="text-sm text-blue-700 font-medium">Total Wilayah</p>
              <p className="text-2xl font-bold text-blue-900">{dataKota.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-sm text-green-700 font-medium">Total Puskesmas</p>
              <p className="text-2xl font-bold text-green-900">
                {dataKota.reduce((sum, kota) => sum + kota.jumlahPuskesmas, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-sm text-purple-700 font-medium">Total Rumah Sakit</p>
              <p className="text-2xl font-bold text-purple-900">
                {dataKota.reduce((sum, kota) => sum + kota.jumlahRS, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataKota.map((kota) => (
            <div
              key={kota.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
            >
              {/* Card Header with Gradient */}
              <div className="h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {kota.nama}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {kota.deskripsi}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-gray-600">Puskesmas</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {kota.jumlahPuskesmas}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Rumah Sakit</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {kota.jumlahRS}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-600">Populasi</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {kota.populasi}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleNavigate(kota.id)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white/80 backdrop-blur rounded-xl p-6 text-center">
          <p className="text-sm text-gray-600">
            Data fasilitas kesehatan dikelola oleh Dinas Kesehatan Provinsi Aceh
          </p>
        </div>
      </div>
    </div>
  );
}