import { Card } from "@/components/ui/card";
import { IconLogin, IconLogout } from "@tabler/icons-react";

type Props = {
  onAbsenClick: (tipe: "masuk" | "pulang") => void;
};

export const AbsensiButtons = ({ onAbsenClick }: Props) => {
  return (
    <Card className="w-full space-y-6 p-7">
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => onAbsenClick("masuk")}
          className="bg-black text-white p-6 rounded-xl shadow-lg hover:bg-gray-900 flex items-center gap-6 flex-1 min-h-[120px]"
        >
          <IconLogin size={40} />
          <div className="text-left">
            <strong className="block text-lg">ABSEN MASUK</strong>
            <span className="text-sm text-gray-300">07:00 WIB s/d 09:30</span>
          </div>
        </button>
        <button
          onClick={() => onAbsenClick("pulang")}
          className="bg-black text-white p-6 rounded-xl shadow-lg hover:bg-gray-900 flex items-center gap-6 flex-1 min-h-[120px]"
        >
          <IconLogout size={40} />
          <div className="text-left">
            <strong className="block text-lg">ABSEN PULANG</strong>
            <span className="text-sm text-gray-300">12:00 WIB s/d 00:00</span>
          </div>
        </button>
      </div>
    </Card>
  );
};

