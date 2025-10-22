"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/breadcrumb";

type Absensi = {
  id: string;
  tanggal: string;
  waktu: string;
  tipe: "masuk" | "pulang";
  metode: "selfie" | "barcode" | "manual";
  lokasi: string;
  status: string;
  location: string;
  imageUrl?: string | null;
};

export default function HistoryAbsensi() {
  const [history, setHistory] = useState<Absensi[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const perPage = 6;

  const fetchHistory = async (pageNum = 1) => {
    try {
      const res = await fetch(`/api/presensi/history?page=${pageNum}`);
      const data = await res.json();
      setHistory(data.data);
      setTotal(data.total);
      setPage(data.page);
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Tepat Waktu":
        return "text-green-600 font-semibold";
      case "Terlambat":
        return "text-yellow-600 font-semibold";
        case "Pulang Cepat":
        return "text-yellow-600 font-semibold";
      case "Tidak Hadir":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-4 space-y-4">
      <div className="p-6 font-semibold">
        <Breadcrumbs />
      </div>

      <div className="space-y-3">
        {history.map((absen) => (
          <Card key={absen.id} className="p-4 shadow-md space-y-1">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-black">
                  {absen.tipe === "masuk" ? "Absen Masuk" : "Absen Pulang"}
                </p>
                <p className="text-sm text-gray-600">{absen.tanggal}</p>
                <p className="text-sm text-gray-500">Lokasi: {absen.lokasi}</p>
                <p className="text-sm text-gray-500">Detail lokasi: {absen.location}</p>
                <p className={`text-sm ${getStatusClass(absen.status)}`}>
                  Status: {absen.status}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium text-black text-lg">{absen.waktu}</p>
                {absen.metode === "selfie" && absen.imageUrl ? (
                  <button
                    onClick={() => setSelectedImage(absen.imageUrl!)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Lihat Selfie
                  </button>
                ) : absen.metode === "manual" ? (
                  <p className="text-sm text-gray-500">Manual</p>
                ) : (
                  <p className="text-sm text-gray-500">Barcode</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-gray-200" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Preview Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-md p-4">
            <Image
              src={selectedImage}
              alt="Selfie Absensi"
              width={360}
              height={480}
              className="rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
