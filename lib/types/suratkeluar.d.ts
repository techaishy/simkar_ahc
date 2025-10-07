// Types untuk form data
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
    kendaraan:string
  }

 export interface Employee {
    id_karyawan: string
    nama: string
    jabatan: string
    alamat: string
 }

