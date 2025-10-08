"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/module/dashboard/components/AppSidebar";
import { DashboardHeader } from "@/module/dashboard/components/DashboardHeader";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/types/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const role: Role = (session?.user?.role as Role) || "admin";
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Sembunyikan sidebar jika lebar layar < 1024px (mobile/tablet)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-br from-gray-700 via-gray-900 to-black z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
          lg:relative lg:transition-none lg:translate-x-0 lg:${
            sidebarOpen ? "" : "hidden"
          }
        `}
      >
        <AppSidebar role={role} />
      </div>

      {/* OVERLAY HITAM UNTUK MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        <DashboardHeader onToggleSidebar={handleToggleSidebar} />
        <div className="w-full h-px bg-black pb-0"></div>

        <main className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="max-w-full min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
