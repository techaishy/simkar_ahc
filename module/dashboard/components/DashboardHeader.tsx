// "use client";

import { Menu, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  router.replace("/"); 
};

  return (
    <header className="w-full px-6 py-3 bg-white border-b border-gray-300 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded hover:bg-gray-200 transition cursor-pointer"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
        
      </div>

       <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 cursor-pointer transition"
        >
          <User size={20} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
             <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
              <User className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
              <HelpCircle className="w-4 h-4" /> Help
            </button>
            <div className="border-t my-1" />
             <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

