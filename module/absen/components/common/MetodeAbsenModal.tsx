import { Camera, ScanLine, Pencil } from "lucide-react";

type Props = {
  tipeAbsen: "masuk" | "pulang" | null;
  onSelect: (metode: "selfie" | "barcode" | "manual") => void;
  onClose: () => void;
};

export default function MetodeAbsensiModal({ tipeAbsen, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 h-screen">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center text-black">
          Pilih Metode Absen {tipeAbsen === "masuk" ? "Masuk" : "Pulang"}
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => onSelect("selfie")}
            className="w-full flex items-center gap-2 bg-black text-white p-2 rounded-md hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
          >
            <Camera size={18} /> Absen via Selfie
          </button>
          <button
            onClick={() => onSelect("barcode")}
            className="w-full flex items-center gap-2 bg-black text-white p-2 rounded-md hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
          >
            <ScanLine size={18} /> Scan Barcode
          </button>
          <button
            onClick={() => onSelect("manual")}
            className="w-full flex items-center gap-2 bg-black text-white p-2 rounded-md hover:text-black hover:bg-gradient-to-r hover:from-[#d2e67a] hover:to-[#f9fc4f]"
          >
            <Pencil size={18} /> Input Manual + Lokasi
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-md mx-auto flex items-center justify-center text-gray-500 hover:text-white hover:bg-red-700 hover:underline w-fit text-base"
          >
          Batal
          </button>
        </div>
      </div>
    </div>
  );
}

