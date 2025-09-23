"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Settings, Info, Hash, Package, FileText, AlertCircle, ArrowLeft, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Alat } from "@/lib/types/alat";

export default function AlatDetailView() {
  const params = useParams();
  const router = useRouter();
  const kodeAlat = params.kode as string;

  const [alatDetails, setAlatDetails] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch detail alat berdasarkan kode (menggunakan dummy data sementara)
  useEffect(() => {
    if (!kodeAlat) return;

    const fetchAlatDetails = async () => {
      setLoading(true);
      setError(null);

      // Simulasi loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Dummy data berdasarkan kode yang dikirim
        const dummyData: Alat[] = [
          {
            id: "1",
            kodeAlat: kodeAlat,
            kodeUnit: '$[kodeAlat]-001',
            nama: 'Timbangan Digital Precision',
            deskripsi: 'Timbangan digital dengan akurasi tinggi untuk keperluan laboratorium kalibrasi. Dilengkapi dengan fitur auto-calibration dan display LCD yang mudah dibaca. Cocok untuk pengukuran presisi hingga 0.001 gram.',
            merek: 'OPPO',
            type: 'Beton',
            jumlah: 1,
            nomorSeri: 'SN-12345678',
            tanggalMasuk: '2001-01-01',
            kondisi: 'BAIK',
            status: 'TERSEDIA'
          },
          {
            id: "2",
            kodeAlat: kodeAlat,
            kodeUnit: '$[kodeAlat]-002',
            nama: 'Timbangan Digital Precision',
            deskripsi: 'Timbangan digital dengan akurasi tinggi untuk keperluan laboratorium kalibrasi. Dilengkapi dengan fitur auto-calibration dan display LCD yang mudah dibaca. Cocok untuk pengukuran presisi hingga 0.001 gram.',
            merek: 'OPPO',
            type: 'Beton',
            jumlah: 1,
            nomorSeri: 'SN-87654321',
            tanggalMasuk: '2001-01-15',
            kondisi: 'RUSAK',
            status: 'MAINTENANCE'
          },
          {
            id: "3",
            kodeAlat: kodeAlat,
            kodeUnit: '$[kodeAlat]-003',
            nama: 'Timbangan Digital Precision',
            deskripsi: 'Timbangan digital dengan akurasi tinggi untuk keperluan laboratorium kalibrasi. Dilengkapi dengan fitur auto-calibration dan display LCD yang mudah dibaca. Cocok untuk pengukuran presisi hingga 0.001 gram.',
            merek: 'OPPO',
            type: 'Beton',
            jumlah: 1,
            nomorSeri: 'SN-99887766',
            tanggalMasuk: '2001-02-01',
            kondisi: 'BAIK',
            status: 'DIGUNAKAN'
          }
        ];

        setAlatDetails(dummyData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchAlatDetails();
  }, [kodeAlat]);

  const alatInfo = alatDetails[0];
  const totalJumlah = alatDetails.reduce((total, alat) => total + alat.jumlah, 0);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'tersedia':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'digunakan':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case 'baik':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rusak':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600 text-lg">Memuat data alat...</span>
        </div>
      </div>
    );
  }

  if (error || !alatInfo) {
    return (
      <div className="p-6">
        <Card className="p-8">
          <div className="flex items-center justify-center text-center">
            <div>
              <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
              <p className="text-gray-600 mb-6">
                {error || `Alat dengan kode "${kodeAlat}" tidak ditemukan.`}
              </p>
              <Button onClick={() => router.back()} className="flex items-center bg-gradient-to-br from-black via-gray-950 to-gray-800">
                <ArrowLeft className="mr-2" size={16} />
                Kembali
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center text-white font-semibold bg-gradient-to-br from-black to-gray-800 hover:from-[#d2e67a] hover:to-[#f9fc4f] hover:text-black transition-all duration-300 shadow-md"
          >
            <ArrowLeft className="mr-2" size={16} />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Alat Kalibrasi</h1>
            <p className="text-gray-600">Kode: {kodeAlat}</p>
          </div>
        </div>
        <Button className="flex items-center">
          <Pencil className="mr-2" size={16} />
          Edit Data
        </Button>
      </div>

      {/* Basic Info Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Info className="mr-2 text-blue-600" size={20} />
          Informasi Umum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 flex items-center mb-1">
              <Hash size={16} className="mr-1" />
              Kode Alat
            </label>
            <p className="text-gray-900 font-mono bg-gray-50 p-3 rounded border">
              {alatInfo.kodeAlat}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 flex items-center mb-1">
              <Package size={16} className="mr-1" />
              Nama Alat
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
              {alatInfo.nama}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Total Jumlah
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded border font-semibold">
              {totalJumlah} Unit
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Merk</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
              {alatInfo.merek}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Type</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
              {alatInfo.type}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Tanggal Masuk</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded border">
              {alatInfo.tanggalMasuk}
            </p>
          </div>
        </div>
      </Card>

      {/* Description */}
      {alatInfo.deskripsi && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FileText className="mr-2 text-blue-600" size={20} />
            Deskripsi
          </h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border">
            {alatInfo.deskripsi}
          </p>
        </Card>
      )}

      {/* Summary Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Aktif', 'Maintenance', 'Rusak'].map(status => {
            const count = alatDetails.filter(alat => alat.status === status).length;
            return (
              <div key={status} className="bg-gray-50 rounded-lg p-4 text-center border">
                <div className={`text-3xl font-bold ${getStatusColor(status).split(' ')[1]} mb-2`}>
                  {count}
                </div>
                <div className="text-sm text-gray-600">{status}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detail per Unit (Nomor Seri) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="mr-2 text-blue-600" size={20} />
          Detail per Unit ({alatDetails.length} Unit)
        </h3>
        <div className="space-y-4">
          {alatDetails.map((alat, index) => (
            <Card key={alat.id} className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Unit {index + 1}</h4>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(alat.status)}>
                    {alat.status}
                  </Badge>
                  <Badge className={getKondisiColor(alat.kondisi ?? "Baik")}>
                    Kondisi: {alat.kondisi}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="font-medium text-gray-600 block mb-1">Nomor Seri:</span>
                  <p className="font-mono text-gray-900">{alat.nomorSeri}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="font-medium text-gray-600 block mb-1">Tanggal Masuk:</span>
                  <p className="text-gray-900">
                    {alat.tanggalMasuk
    ? new Date(alat.tanggalMasuk).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }):"-"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="font-medium text-gray-600 block mb-1">Jumlah:</span>
                  <p className="text-gray-900 font-semibold">{alat.jumlah} Unit</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
