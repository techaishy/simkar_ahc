"use client";

import { useState } from "react";
import { StatCard } from "@/module/dashboard/components/StatCard";
import DropdownFilter from "@/module/dashboard/components/DropdownFilter";
import { ChartDisplay } from "@/module/dashboard/components/ChartDisplay";
import { DashboardHeader } from "@/module/dashboard/components/DashboardHeader";
import AppSidebar from "./components/AppSidebar";
import { Users, Check, Clock, X } from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  return (
    <div className="flex min-h-screen overflow-hidden transition-all duration-300 ease-in-out">
       <div className={sidebarOpen ? "w-64 transition-all " : "w-0 transition-all duration-300 overflow-hidden"}>
        <AppSidebar />
      </div>
    
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        ></div>
      )}
      <div className="flex-1 h-screen overflow-auto px-1">
      <DashboardHeader onToggleSidebar={handleToggleSidebar} />
      <div className="w-full h-px  bg-black pb-0"></div>
      <div className="px-1 pt-2 pb-2 text-sm text-gray-600">HOME &gt;&gt; DASHBOARD</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
  <StatCard label="Karyawan" value="20" icon={<Users />} bgColor="bg-green-600" />
  <StatCard label="Tepat Waktu" value="10" icon={<Check />} bgColor="bg-yellow-500" />
  <StatCard label="Terlambat" value="10" icon={<Clock />} bgColor="bg-orange-500" />
  <StatCard label="Tidak Hadir" value="10" icon={<X />} bgColor="bg-red-600" />
</div>

        <DropdownFilter />
        <ChartDisplay />
      </div>
    </div>
  );
}
