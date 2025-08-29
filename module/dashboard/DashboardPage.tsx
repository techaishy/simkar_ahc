"use client";

import { StatCard } from "@/module/dashboard/components/StatCard";
import { ChartDisplay } from "@/module/dashboard/components/ChartDisplay";
import { Users, Check, Clock, X } from "lucide-react";
import { EmployeeAttendanceTable } from "@/module/dashboard/components/EmployeeAttedanceTable";
import Breadcrumbs from "@/components/ui/breadcrumb";

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden px-2 pb-6">
      <div className="max-w-screen-2xl mx-auto">
      <div className="p-4 font-semibold">
      <Breadcrumbs />
    </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 w-full overflow-hidden">
          <StatCard
            label="Karyawan"
            value="20"
            icon={<Users />}
            bgColor="bg-blue-500"
          />

          <StatCard
            label="Tepat Waktu"
            value="10"
            icon={<Check />}
            bgColor="bg-green-600"
          />

          <StatCard
            label="Terlambat"
            value="10"
            icon={<Clock />}
            bgColor="bg-yellow-500"
          />

          <StatCard
            label="Tidak Hadir"
            value="10"
            icon={<X />}
            bgColor="bg-red-600"
          />
        </div>

        <div className="pt-5">
          <ChartDisplay />
        </div>

        <EmployeeAttendanceTable></EmployeeAttendanceTable>
      </div>
    </div>
  );
}
