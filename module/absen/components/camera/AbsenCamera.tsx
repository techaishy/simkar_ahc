"use client";

import CameraCard from "./CameraCard";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang" | null;
};

export default function AbsensiCamera({ onClose,tipe }: Props) {
  return (
    <div className="p-4 space-y-4">
      <CameraCard onClose={onClose} />
    </div>
  );
}
