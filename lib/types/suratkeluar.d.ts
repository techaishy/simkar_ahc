// Types untuk form data
export interface FormSuratKeluar {
    nomorSurat: string
    nama: string
    jabatan: string
    alamat: string
    wilayahKerja: string
    tanggalBerangkat: string
    tanggalMulai: string,
    tanggalSelesai: string,
    jamBerangkat: string
    kendaraan: string
    akomodasi: string
    agenda: string
    employees: Employee[]
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

