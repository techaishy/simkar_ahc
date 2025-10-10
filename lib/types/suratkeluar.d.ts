export interface FormSuratKeluar {
    nomorSurat: string
    nama: string
    jabatan: string
    alamat: string
    wilayah: string
    tanggalBerangkat: string
    tanggalMulai: string,
    tanggalSelesai: string,
    jamBerangkat: string
    kendaraan: string
    akomodasi: string
    keterangan: string
     anggota: Employee[]
    statusOwner: string
    statusAdm: string
    createdAt: string
  }

 export interface Employee {
    id_karyawan: string
    nama: string
    jabatan: string
    alamat: string
 }

 export interface KondisiKalibrator {
   accessories: string
   kabel: string
   tombol: string
   fungsi: string
   fisik: string
 }
 
 export interface BarangItem {
  nomorSurat: string
   nama: string
   merk: string
   type: string
   noSeri: string
   kondisi: KondisiKalibrator
 }

 export interface SuratKeluarAlat {
    nomorSurat: string
    tanggalSurat: string
    keperluan: string
    statusManager: string
    createdAt: string
    pembuatId: string
    unitItems: BarangItem[]
}
