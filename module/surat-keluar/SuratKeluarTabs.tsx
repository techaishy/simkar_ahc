"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Package, ArrowLeft } from "lucide-react";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function MenuSuratKeluar() {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: "surat-dinas",
      title: "Surat Dinas Keluar",
      description: "Surat resmi untuk keperluan dinas dan administrasi",
      icon: FileText,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      id: "surat-keluar-alat",
      title: "Surat Keluar Alat", 
      description: "Surat untuk pengeluaran alat dan peralatan kantor",
      icon: Package,
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    }
  ];

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenu(menuId);
    console.log(`Menu dipilih: ${menuId}`);
    // TODO: Navigate to selected form or handle menu selection
  };

  const handleBackToMenu = () => {
    setSelectedMenu(null);
  };

  // Jika sudah pilih menu, tampilkan detail
  if (selectedMenu) {
    const selectedItem = menuItems.find(item => item.id === selectedMenu);
    
    if (!selectedItem) return null;
    
    const IconComponent = selectedItem.icon;
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBackToMenu}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <IconComponent className="w-5 h-5" />
              {selectedItem.title}
            </h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-gray-600">{selectedItem.description}</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Form akan segera tersedia</h4>
              <p className="text-sm text-yellow-700">
                Komponen form untuk {selectedItem.title.toLowerCase()} sedang dalam pengembangan.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Buat {selectedItem.title}
              </button>
              <button className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                Lihat Riwayat
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Tampilan menu utama
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-200 text-center">
        <h1 className="text-xl font-bold mb-2">Menu Surat Keluar</h1>
        <p className="text-gray-600">
          Pilih jenis surat keluar yang ingin Anda buat
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <div 
                key={item.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md`}
                onClick={() => handleMenuSelect(item.id)}
              >
                <Card className={`${item.color} border`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-white shadow-sm">
                        <IconComponent className="w-6 h-6 text-gray-700" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Butuh bantuan? <a href="#" className="text-blue-600 hover:underline">Hubungi Administrator</a>
          </p>
        </div>
      </div>
    </Card>
  );
}