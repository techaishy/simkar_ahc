// Interface untuk form data
export interface FormData {
    namaKaryawan: string;
    namaAlat: string;
    kodeAlat: string;
    tanggalKalibrasi: string;
    expiredKalibrasi: string;
    satuanKerja: string;
  }

  // Interface untuk data yang akan dienkripsi
export interface BarcodeData {
    nama: string;
    namaAlat: string;
    kodeAlat: string;
    tglKalibrasi: string;
    tglExpired: string;
    satker: string;
    timestamp: number;
  }