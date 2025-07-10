"use client";

import { Menu, User } from "lucide-react";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="w-full px-6 py-3 bg-white border-b border-gray-300 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded hover:bg-gray-200 transition"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
        
      </div>

      {/* Kanan: profil */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 cursor-pointer transition">
        <User size={20} />
      </div>
    </header>
  );
}

