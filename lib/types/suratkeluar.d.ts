// Types untuk form data
export interface FormSuratKeluar {
    nomorSurat: string
    nama: string
    jabatan: string
    alamat: string
    wilayahKerja: string
    tanggalBerangkat: string
    jamBerangkat: string
    kendaraan: string
    akomodasi: string
    agenda: string
    employees: Employee[]
    statusOwner: string
    statusManager: string
    createdAt: string
  }

 export interface Employee {
      nama: string
      jabatan: string
      alamat: string
    }

