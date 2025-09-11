import { UserStatus } from "@/lib/types/user";
import { Karyawan } from "@/lib/types/karyawan";

export const statusLabel: Record<UserStatus, string> = {
  AKTIF: "Aktif",
  NONAKTIF: "Nonaktif",
  DITANGGUHKAN: "Ditangguhkan",
};

export const statusVariant: Record<
  UserStatus,
  "default" | "secondary" | "destructive"
> = {
  AKTIF: "default",
  NONAKTIF: "secondary",
  DITANGGUHKAN: "destructive",
};

export const getStatusLabel = (status: Karyawan["status"]) =>
  statusLabel[status];

export const getStatusVariant = (status: Karyawan["status"]) =>
  statusVariant[status];
