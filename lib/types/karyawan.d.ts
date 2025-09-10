import { UserStatus, UserRole } from "@/lib/types/user";

export const statusLabel: Record<UserStatus, string> = {
  AKTIF: "Aktif",
  NONAKTIF: "Nonaktif",
  DITANGGUHKAN: "Ditangguhkan",
};

export const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive"> = {
  AKTIF: "default",
  NONAKTIF: "secondary",
  DITANGGUHKAN: "destructive",
};

export interface Karyawan {
  id: string;
  customId: string;
  name: string;
  nip?: string;
  nik?: string;
  npwp?: string;
  emailPribadi?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  tempatLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  joinDate: string;
  position: string;
  department: string;
  pendidikan?: string;
  golongan?: string;
  image?: string;
  kontakDarurat?: string;
  hubunganDarurat?: string;
  status: UserStatus;
  lastLogin?: Date;
}

export type KaryawanCreate = Karyawan & { role: UserRole };

export const getStatusLabel = (status: Karyawan["status"]) =>
  statusLabel[status];

export const getStatusVariant = (status: Karyawan["status"]) =>
  statusVariant[status];