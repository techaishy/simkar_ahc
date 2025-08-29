"use client";

import { useState } from "react";
import BarcodeCard from "./BarcodeCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang" | null;
};

export default function AbsensiBarcode({ onClose, tipe }: Props) {
  const [hasil, setHasil] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4">
      <BarcodeCard
        onClose={onClose}
        onScanSuccess={(code) => {
          setHasil(code);
          alert(`Berhasil scan barcode untuk absen ${tipe}: ${code}`);
          onClose(); 
        }}
      />
    </div>
  );
}
