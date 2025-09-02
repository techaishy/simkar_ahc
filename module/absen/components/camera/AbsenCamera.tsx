"use client";

import CameraCard from "./CameraCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang" | null;
  onSubmit: (fotoOrData?: any) => Promise<void>;
};

export default function AbsensiCamera({ onClose, tipe, onSubmit }: Props) {
  if (!tipe) return null;

  return (
    <div className="p-4 space-y-4">
      <CameraCard  onClose={onClose} tipe={tipe} onSubmit={onSubmit} />
    </div>
  );
}
