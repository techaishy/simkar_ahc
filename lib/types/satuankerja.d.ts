export interface Puskesmas {
  id: string;
  nama: string;
  alamat: string;
  telp?: string;
  jamBuka?: string;
  latitude: number;
  longitude: number;
  radius: number;
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
}

// Kategori SK
export type KategoriWilayah = 'rs-pemerintah' | 'rs-swasta' | 'rs-tentara' | 'puskesmas' | 'klinik';

export interface KotaWilayah {
  id: string;
  nama: string;
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
