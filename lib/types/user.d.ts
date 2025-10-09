export type UserRole = 'ADMIN' | 'OWNER' | 'DIREKTUR' | 'MANAJER' | 'KARYAWAN' | 'TEKNISI' | 'KEUANGAN' | 'KEPALA_GUDANG';
export type UserStatus = 'AKTIF' | 'NONAKTIF' | 'DITANGGUHKAN';
export type AttendanceMasuk = 'TEPAT_WAKTU' | 'TERLAMBAT' | 'TIDAK_HADIR';
export type AttendancePulang = 'TEPAT_WAKTU' | 'PULANG_CEPAT' | 'TIDAK_HADIR';
export type ApprovalStatus = 'PENDING' | 'DISETUJUI' | 'DITOLAK';
import { Karyawan } from "./karyawan";

export interface UserAccount {
  id: string;
  customId: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus; 
  kantorId?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  karyawan?: Karyawan; 
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}


export interface MenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  items?: SubMenuItem[];
  allowedRoles: UserRole[];
}

export interface SubMenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  allowedRoles?: UserRole[];
}
