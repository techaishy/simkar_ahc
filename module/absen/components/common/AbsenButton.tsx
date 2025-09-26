import { Card } from "@/components/ui/card";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  onAbsenClick: (tipe: "masuk" | "pulang") => void;
  enableClockIn?: boolean;
  enableClockOut?: boolean;
};

export const AbsensiButtons = ({
  onAbsenClick,
  enableClockIn = true,
  enableClockOut = true,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (tipe: "masuk" | "pulang") => {
    if (isSubmitting) return; 
    setIsSubmitting(true);
    try {
      await onAbsenClick(tipe);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-7">
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={() => handleClick("masuk")}
          disabled={!enableClockIn || isSubmitting}
          className={`${
            enableClockIn && !isSubmitting ? "bg-black hover:bg-gray-900" : "bg-gray-400 cursor-not-allowed"
          } text-white p-6 rounded-xl shadow-lg flex items-center gap-6 flex-1 min-h-[120px]`}
        >
          <IconLogin size={40} />
          <div className="text-left">
            <strong className="block text-lg">ABSEN MASUK</strong>
            <span className="text-sm text-gray-300">07:00 WIB s/d 09:30</span>
          </div>
        </button>

        <button
          onClick={() => handleClick("pulang")}
          disabled={!enableClockOut || isSubmitting}
          className={`${
            enableClockOut && !isSubmitting ? "bg-black hover:bg-gray-900" : "bg-gray-400 cursor-not-allowed"
          } text-white p-6 rounded-xl shadow-lg flex items-center gap-6 flex-1 min-h-[120px]`}
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
