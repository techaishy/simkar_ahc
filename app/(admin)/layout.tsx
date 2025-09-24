'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AppSidebar from '@/module/dashboard/components/AppSidebar';
import { DashboardHeader } from '@/module/dashboard/components/DashboardHeader';
import { useAuth } from '@/context/authContext';
import { UserRole } from '@/lib/types/user';
import { menuItems, MenuItem } from '@/lib/menu-items';

interface AdminLayoutProps {
  children: React.ReactNode;
}

function findMenuItem(path: string, items: MenuItem[]): MenuItem | undefined {
  for (const item of items) {
    if (item.href === path) return item;
    if (item.items) {
      const found = findMenuItem(path, item.items);
      if (found) return found;
    }
  }
  return undefined;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checkedAccess, setCheckedAccess] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!isLoading && user) {
      const menuItem = findMenuItem(pathname, menuItems);
      if (menuItem && !menuItem.allowedRoles.includes(user.role as UserRole)) {
        router.replace('/');
      }
      setCheckedAccess(true); 
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user || !checkedAccess) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50 text-gray-700">
        Loading...
      </div>
    );
  }

  const role: UserRole = (user.role as UserRole) ;

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-gray-700 via-gray-900 to-black z-40 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 lg:relative lg:transition-none lg:translate-x-0`}
      >
        <AppSidebar role={role} />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* Main content */}
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
