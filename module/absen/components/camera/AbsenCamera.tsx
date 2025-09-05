"use client";

import CameraCard from "./CameraCard";
import { useAuth } from "@/context/authContext";

type Props = {
  onClose: () => void;
  tipe: "masuk" | "pulang" | null;
  onSubmit: (fotoOrData?: any) => Promise<void>;
};

export default function AbsensiCamera({ onClose, tipe, onSubmit }: Props) {
  if (!tipe) return null;
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  return (
    <div className="p-4 space-y-4">
      {user?.customId && (
        <CameraCard userId={user?.customId} onClose={onClose} tipe={tipe} onSubmit={onSubmit} />
        )}
    </div>
  );
}
