export interface Alat {
  id: string;
  kodeAlat: string;
  kodeUnit: string; 
  nama: string;
  merek?: string;
  type: string;
  jumlah: number;
  tanggalMasuk?: string; 
  createdAt?: string;
  updatedAt?: string;
  deskripsi?: string;
  units?: AlatUnit[]; 
}

export interface AlatUnit {
  id: string;
  kodeAlat: string;
  kodeUnit: string; 
  nomorSeri?: string; 
  kondisi: string;
  status: "TERSEDIA" | "DIGUNAKAN" | "MAINTENANCE";
  createdAt?: string;
  updatedAt?: string;
}
