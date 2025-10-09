'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/module/dashboard/components/AppSidebar';
import { DashboardHeader } from '@/module/dashboard/components/DashboardHeader';
import { useAuth } from '@/context/authContext';
import { UserRole } from '@/lib/types/user';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50 text-gray-700">
        Loading...
      </div>
    );
  }

  const role: UserRole = (user.role as UserRole) || 'KARYAWAN';

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-gray-700 via-gray-900 to-black z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:relative lg:transition-none lg:translate-x-0`}
      >
        <AppSidebar role={role} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}

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
