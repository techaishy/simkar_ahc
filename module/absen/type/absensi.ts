// 
export type Absensi = {
  id: string;
  nama: string;
  jabatan: string;
  tanggal: string; 
  waktuMasuk?: string; 
  statusMasuk?: "Tepat Waktu" | "Terlambat" | "Tidak Hadir";
  waktuPulang?: string; 
  statusPulang?: "Tepat Waktu" | "Lembur" | "-";
  durasiKerja?: string; 
  metode?: "Selfie" | "Barcode" | "Manual" | string;
  keterangan?: string; 
  lokasi?: string; 
};