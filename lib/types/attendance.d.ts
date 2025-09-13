import type { AttendancePulang, AttendanceMasuk, } from './user';
import { Karyawan } from './karyawan';

export interface AttendanceRecord {
  id_at: string;
  userId: string;
  date: string;
  clockIn?: string | null;
  clockOut?: string | null;
  statusMasuk:AttendanceMasuk;
  statusPulang?:AttendancePulang | null;
  kantorId?: string | null; 
  lokasiId?: string | null;

  photoIn?: string | null;
  photoOut?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: string | null;
  barcodeIn?: string | null;
  barcodeOut?: string | null;
  barcodeInAt?: string | null;
  barcodeOutAt?: string | null;
  createdAt?: string | null;

 karyawan?: Karyawan | null;
}
