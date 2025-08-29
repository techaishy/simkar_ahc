"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export function UserInfoCard() {
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");

  const data = {
    nama: "Alam Alfarizi",
    jabatan: "Admin",
    idKaryawan: "01052025",
    email: "alam@example.com",
    departemen: "IT Support",
    status: "Kontrak",
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const tanggalFormatted = now.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const waktuFormatted = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTanggal(tanggalFormatted);
      setWaktu(waktuFormatted);
    };

    updateDateTime(); 
    const interval = setInterval(updateDateTime, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <Card className="w-full max-w-7.2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 text-sm md:text-base text-black">
        <div className="flex gap-2">
          <span className="font-semibold w-28">Nama</span>
          <span>: {data.nama}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-28">Email</span>
          <span>: {data.email}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-28">Jabatan</span>
          <span>: {data.jabatan}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-28">Departemen</span>
          <span>: {data.departemen}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-28">ID Karyawan</span>
          <span>: {data.idKaryawan}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold w-28">Status</span>
          <span>: {data.status}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{tanggal}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{waktu}</span>
        </div>
      </div>
    </Card>
  );
}

