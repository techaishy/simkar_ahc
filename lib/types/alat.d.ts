// Tipe utama alat kalibrasi
export interface Alat {
    id: string;
    kodeAlat: string;
    kodeUnit: string; 
    nama: string;
    merek?: string;
    nomorSeri: string;
    type: string;
    jumlah: number;
    tanggalMasuk?: string; 
    kondisi?: "BAIK" | "RUSAK";
    status: "TERSEDIA" | "DIGUNAKAN" | "MAINTENANCE";
    deskripsi?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Form input (misalnya tambah alat baru)
  export type AlatForm = Pick<
    Alat,
    "kode" | "nama" | "jumlah" | "status" | "deskripsi"
  >;
  
  // Data untuk tampilan tabel ringkas
  export type AlatView = Pick<
    Alat,
    "id" | "kode" | "nama" | "kategori" | "jumlah" | "lokasi" | "status"
  >;
  
  // Data lengkap (misalnya untuk detail page)
  export interface AlatFull extends Alat {}
  