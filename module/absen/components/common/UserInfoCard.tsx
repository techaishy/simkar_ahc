"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface UserData {
  nama: string;
  jabatan: string;
  idKaryawan: string;
  email: string;
  departemen: string;
  status: string;
}

export function UserInfoCard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [tanggal, setTanggal] = useState("");
  const [waktu, setWaktu] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user"); 
        if (!res.ok) throw new Error("Gagal mengambil data user");
        const data = await res.json();
        console.log(data);
        setUser({
          nama: data.karyawan.name ?? "-",       
          jabatan: data.karyawan.position ?? "-",
          idKaryawan: data.id ?? "-", 
          email: data.email ?? "-",
          departemen: data.karyawan.department ?? "-",
          status: data.karyawan.status ?? "-",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTanggal(
        now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
      setWaktu(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <Card className="w-full max-w-4xl mx-auto p-6 md:p-8">Loading user...</Card>;
  }

  return (
    <Card className="w-full max-w-7.2xl p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm md:text-base text-black">
        {[
          ["Nama", user.nama],
          ["Email", user.email],
          ["Jabatan", user.jabatan],
          ["Departemen", user.departemen],
          ["ID Karyawan", user.idKaryawan],
          ["Status", user.status],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[100px_10px_1fr] gap-2 items-center">
            <span className="font-semibold">{label}</span>
            <span>:</span>
            <span className="truncate">{value}</span>
          </div>
        ))}
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
