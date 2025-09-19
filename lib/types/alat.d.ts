// Tipe utama alat kalibrasi
export interface Alat {
    id: string;
    kode: string;
    nama: string;
    kategori: string;
    merek?: string;
    nomorSeri?: string;
    jumlah: number;
    tersedia: string;
    tanggalMasuk: string; 
    status: "Tersedia" | "Dipakai" | "Rusak";
    deskripsi?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Form input (misalnya tambah alat baru)
  export type AlatForm = Pick<
    Alat,
    "kode" | "nama" | "kategori" | "jumlah" | "lokasi" | "status" | "deskripsi"
  >;
  
  // Data untuk tampilan tabel ringkas
  export type AlatView = Pick<
    Alat,
    "id" | "kode" | "nama" | "kategori" | "jumlah" | "lokasi" | "status"
  >;
  
  // Data lengkap (misalnya untuk detail page)
  export interface AlatFull extends Alat {}
  