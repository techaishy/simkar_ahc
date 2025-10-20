"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/module/dashboard/components/StatCard";
import { ChartDisplay } from "@/module/dashboard/components/ChartDisplay";
import { EmployeeAttendanceTable } from "@/module/dashboard/components/EmployeeAttedanceTable";
import { Users, Check, Clock, X } from "lucide-react";
import type { Karyawan } from "@/lib/types/karyawan";
import type { AttendanceRecord } from "@/lib/types/attendance";

export default function DashboardClient() {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch("/api/attendance")
      .then((res) => res.json())
      .then((data) => {
        const filteredKaryawan = data.karyawan.filter(
          (k: any) => k.role !== "OWNER"
        );
        setKaryawan(filteredKaryawan);
        setAttendance(data.attendance);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 w-full overflow-hidden">
        <StatCard
          label="Karyawan"
          value={karyawan.length}
          icon={<Users />}
          bgColor="bg-blue-500"
        />

        <StatCard
          label="Tepat Waktu"
          value={attendance.filter((a) => a.statusMasuk === "TEPAT_WAKTU").length}
          icon={<Check />}
          bgColor="bg-green-600"
        />

        <StatCard
          label="Terlambat"
          value={attendance.filter((a) => a.statusMasuk === "TERLAMBAT").length}
          icon={<Clock />}
          bgColor="bg-yellow-500"
        />

        <StatCard
          label="Tidak Hadir"
          value={attendance.filter((a) => a.statusMasuk === "TIDAK_HADIR").length}
          icon={<X />}
          bgColor="bg-red-600"
        />
      </div>

      <div className="pt-5">
        <ChartDisplay />
      </div>

      <EmployeeAttendanceTable />
    </>
  );
}
