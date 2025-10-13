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

  export interface Klinik {
    id: number;
    nama: string;
    alamat: string;
    telp: string;
    jamBuka: string;
    jenisPelayanan: string;
  }
  

  export interface WilayahKerjaProps {
    kotaId: string;
  }
  
  // Type untuk semua jenis data wilayah kerja
  export type WilayahKerjaData = Puskesmas | RumahSakit | Klinik;
  
  // Type untuk kategori/tab
  export type KategoriWilayah = 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'puskesmas' | 'klinik';

 export interface KotaWilayah {
    id: string;
    nama: string;
    deskripsi: string;
    jumlahPuskesmas: number;
    jumlahRS: number;
    populasi?: string;
    image?: string;
  }