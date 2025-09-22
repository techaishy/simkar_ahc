"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/module/dashboard/components/AppSidebar";
import { DashboardHeader } from "@/module/dashboard/components/DashboardHeader";
import { UserRole } from "@/lib/types/user";
import { useAuth } from "@/context/authContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth(); 
  const role: UserRole = (user?.role as UserRole) || "ADMIN"; 
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Kalau belum login, redirect ke login
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

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
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
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
