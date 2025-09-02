"use client";

import { useState } from "react";
import BarcodeCard from "./BarcodeCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang" | null;
  onSubmit: (fotoOrData?: any) => Promise<void>;
};

export default function AbsensiBarcode({ onClose, tipe, onSubmit }: Props) {
  const [hasil, setHasil] = useState<string | null>(null);

  if (!tipe) return null;

  return (
    <div className="p-4 space-y-4">
      <BarcodeCard
        onClose={onClose}
        tipe={tipe}
        onSubmit={async (data) => {
          setHasil(data?.code || null);
          await onSubmit(data);
          onClose();
        }}
      />
    </div>
  );
}
