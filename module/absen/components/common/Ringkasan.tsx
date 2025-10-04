import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export function RingkasanHariIni() {
  return (
    <Card className=" p-6 shadow-md">
     <div className=" flex-col md:flex-row bg-black text-white p-6 rounded-xl shadow-lg hover:bg-gray-900  gap-6 flex-1 min-h-[120px]">
      <h2 className="text-base font-semibold mb-4">Status Hari Ini</h2>

      <div className="space-y-3 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <span>Absen Masuk: 08:00 WIB</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500 w-5 h-5" />
          <span>Absen Pulang: Belum Absen</span>
        </div>
      </div>
      </div>
    </Card>
  );
}
