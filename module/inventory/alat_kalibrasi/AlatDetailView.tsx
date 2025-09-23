"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Info,
  Settings,
  AlertCircle,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlatDetailViewProps {
  alatId: string; 
}

export default function AlatDetailView({ alatId }: AlatDetailViewProps) {
  const router = useRouter();

  const [alatInfo, setAlatInfo] = useState<any>(null);
  const [alatDetails, setAlatDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alatId) {
      setError("alatId kosong!");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/inventory/alat-kalibrator/${alatId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Gagal mengambil data detail");

        setAlatInfo(data);
        setAlatDetails(data.units || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [alatId]);

  const totalJumlah = alatDetails.length;

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi?.toLowerCase()) {
      case "baik":
        return "bg-green-100 text-green-800 border-green-200";
      case "rusak":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600 text-lg">Memuat data alat...</span>
      </div>
    );
  }

  if (error || !alatInfo) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Data Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">{error || "Alat tidak ditemukan."}</p>
          <Button onClick={() => router.back()} className="flex items-center">
            <ArrowLeft className="mr-2" size={16} /> Kembali
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center text-gray-800 border-gray-300 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2" size={16} />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Alat Kalibrasi</h1>
            <p className="text-gray-600">Kode: {alatInfo.kode_barcode}</p>
          </div>
        </div>
        <Button className="flex items-center text-white bg-blue-600 hover:bg-blue-700">
          <Pencil className="mr-2" size={16} /> Edit Data
        </Button>
      </div>

     {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
          <Info className="mr-2" size={20} /> Informasi Umum
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Kode Alat</label>
            <p className="bg-gray-50 p-3 rounded border font-mono text-gray-800">{alatInfo.kode_barcode}</p>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Nama Alat</label>
            <p className="bg-gray-50 p-3 rounded border text-gray-800">{alatInfo.nama_alat}</p>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Total Jumlah</label>
            <p className="bg-gray-50 p-3 rounded border font-semibold text-gray-800">{totalJumlah} Unit</p>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Merk</label>
            <p className="bg-gray-50 p-3 rounded border text-gray-800">{alatInfo.merk}</p>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Type</label>
            <p className="bg-gray-50 p-3 rounded border text-gray-800">{alatInfo.type}</p>
          </div>
        </div>
      </Card>

    <Card className="p-6">
      {(() => {
        let colorClass = "text-blue-600"; 
        if (alatDetails.every(u => u.kondisi?.toLowerCase() === "baik")) colorClass = "text-green-600";
        else if (alatDetails.every(u => u.kondisi?.toLowerCase() === "rusak")) colorClass = "text-red-600";
        return (
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${colorClass}`}>
            <Settings className={`mr-2 ${colorClass}`} size={20} />
            Detail per Unit ({alatDetails.length} Unit)
          </h3>
        );
      })()}

  <div className="space-y-4">
    {alatDetails.map((unit, index) => (
      <Card
        key={unit.id}
        className={`p-4 border-l-4 shadow-sm ${
          unit.kondisi?.toLowerCase() === "baik"
            ? "border-l-green-500"
            : unit.kondisi?.toLowerCase() === "rusak"
            ? "border-l-red-500"
            : "border-l-gray-300"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">Unit {index + 1}</h4>
          <Badge
            className={`${
              unit.kondisi?.toLowerCase() === "baik"
                ? "bg-green-100 text-green-800 border-green-200"
                : unit.kondisi?.toLowerCase() === "rusak"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            }`}
          >
            {unit.kondisi ?? "Baik"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded border">
            <span className="font-medium text-gray-700 block mb-1">Kode Unit</span>
            <p className="font-mono text-gray-800">{unit.kode_unit}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <span className="font-medium text-gray-700 block mb-1">Nomor Seri</span>
            <p className="font-mono text-gray-800">{unit.nomor_seri}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <span className="font-medium text-gray-700 block mb-1">Tanggal Masuk</span>
            <p className="text-gray-800">
              {new Date(unit.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </Card>
    ))}
  </div>
</Card>

    </div>
  );
}
