// Type untuk Puskesmas
export interface Puskesmas {
    id: number;
    nama: string;
    alamat: string;
    telp: string;
    jamBuka: string;
  }
  
  // Type untuk Rumah Sakit (Pemerintah, Swasta, Tentara)
  export interface RumahSakit {
    id: number;
    nama: string;
    alamat: string;
    telp: string;
    jamBuka: string;
    jenisPelayanan: string;
  }
  
  // Type untuk semua jenis data wilayah kerja
  export type WilayahKerjaData = Puskesmas | RumahSakit;
  
  // Type untuk kategori/tab
  export type KategoriWilayah = 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara';