import { Karyawan } from "../../../../lib/types/karyawan";
import { UserStatus, UserRole } from "@/lib/types/user";

export type KaryawanForm = Pick<
  Karyawan,
  "name" | "nip" | "nik" | "emailPribadi" | "phone" |
  "position" | "department" | "jenisKelamin" | "agama" |
  "pendidikan" | "golongan" | "kontakDarurat" |
  "hubunganDarurat" | "status"
>;

export type KaryawanView = Pick<
  Karyawan,
  "id" | "customId" | "name" | "nip" | "position" |
  "department" | "phone" | "status"
>;

export interface KaryawanFull extends Karyawan {
  user?: {
    id: string;
    username: string;
    email: string;
     role: UserRole;
    status: UserStatus;
  };
}
