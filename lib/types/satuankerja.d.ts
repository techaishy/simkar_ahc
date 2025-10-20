export interface Puskesmas {
  id: string;
  nama: string;
  alamat: string;
  telp?: string;
  jamBuka?: string;
  latitude: number;
  longitude: number;
  radius: number;
  alat?: Alat[];
}

export interface RumahSakit {
  id: string;
  nama: string;
  alamat: string;
  telp?: string;
  jamBuka?: string;
  jenisPelayanan?: string;
  latitude: number;
  longitude: number;
  radius: number;
  alat?: Alat[];
}

export interface Klinik {
  id: string;
  nama: string;
  alamat: string;
  telp?: string;
  jamBuka?: string;
  jenisPelayanan?: string;
  latitude: number;
  longitude: number;
  radius: number;
  alat?: Alat[];
}

// Kategori SK
export type KategoriWilayah = 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'puskesmas' | 'klinik';

export interface KotaWilayah {
  id: string;
  nama_wilayah: string;
  deskripsi?: string;
  populasi?: string;
  image?: string;
  jumlahPuskesmas: number;
  jumlahRS: number;
  jumlahKL :number; 	

  puskesmas: Puskesmas[];
  rsPemerintah: RumahSakit[];
  rsSwasta: RumahSakit[];
  rsTentara: RumahSakit[];
  klinik: Klinik[];
}
  export interface WilayahKerjaProps {
    kotaId: string;
  }

  export interface Alat {
    nama_alat: string
    unit: number
  }
  
   export interface FormData {
    nama: string
    alamat: string
    telp: string
    jamBuka: string
    jenisPelayanan?: string
    tipe?: KategoriWilayah
    alat: Alat[]
  }
