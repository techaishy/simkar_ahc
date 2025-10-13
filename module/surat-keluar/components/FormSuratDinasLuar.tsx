'use client'

import React,  { useState, useEffect }  from 'react'
import { Download, User, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { FormSuratKeluar } from '@/lib/types/suratkeluar'
import type { Employee } from '@/lib/types/suratkeluar'
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/ui/alert"

export default function SuratTugasForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormSuratKeluar>({
    nomorSurat: '',
    nama: '',
    jabatan: '',
    alamat: '',
    wilayah: '',
    tanggalBerangkat: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    jamBerangkat: '',
    kendaraan: '',
    akomodasi: '',
    keterangan: '',
    anggota: [],
    statusOwner: '',
    statusAdm: '',
    createdAt: '',
  })

  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeOptions, setEmployeeOptions] = useState<Employee[]>([])
  const [emplocationOptions, setlocationOptions] = useState<[]>([])
  const router = useRouter();

  const [alertData, setAlertData] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch('/api/surat-keluar/data')
          const data = await res.json()
          setEmployeeOptions(data.employees)
          setlocationOptions(data.location)
        } catch (err) {
          console.error('Gagal ambil data:', err)
        }
      }
      fetchData()
    }, [])

    const handleCloseAlert = () => {
      setAlertData({ type: null, message: "" })
    }

    const handleEmployeeChange = (index:  number, field: keyof Employee, value: string) => {
    setEmployees(prev => {
      const newEmployees = [...prev]
      newEmployees[index] = { ...newEmployees[index], [field]: value }
      return newEmployees
    })
  }

    const addEmployee = () => {
      setEmployees(prev => [
        ...prev,
        { id_karyawan: '', nama: '', jabatan: '', alamat: '' } 
      ])
    }
    
    const removeEmployee = (index: number) => {
      setEmployees((prev) => prev.filter((_, i) => i !== index));
    };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
      const { name, value } = e.target;

      if (name === "tanggalBerangkat") {
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 3); 

        setFormData((prev) => ({
          ...prev,
          tanggalBerangkat: value,
          tanggalMulai: value,
          tanggalSelesai: endDate.toISOString().split("T")[0], 
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

  const generateNomorSurat = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
  
    const storageKey = `lastNomorSurat_${month}_${year}`
  
    let lastNumber = parseInt(localStorage.getItem(storageKey) || '0', 10)
    lastNumber += 1
  
    localStorage.setItem(storageKey, lastNumber.toString())
  
    const nomorSurat = `${String(lastNumber).padStart(3, '0')}/STPD-AHC/${month}/${year}`
    
    setFormData(prev => ({
      ...prev,
      nomorSurat
    }))
  }

const handleSubmit = async () => {
  const newSurat = {
    ...formData,
    employees,
    pembuatSuratId: user?.customId,
    statusOwner: "Pending",
    statusAdm: "Pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch("/api/surat-keluar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSurat),
    });
    const result = await res.json()

    if (!res.ok) {
              setAlertData({
          type: "error",
          message: result.error || "Gagal membuat surat. Coba lagi nanti.",
        })
        setTimeout(handleCloseAlert, 4000)
        return
      }

      setAlertData({
        type: "success",
        message: `Surat ${formData.nomorSurat || "(tanpa nomor)"} berhasil dibuat!`,
      });

      setTimeout(() => {
        handleCloseAlert()
        router.push("/surat_keluar/approval_surat");
      }, 2000);

  } catch (err) {
    console.error("🔥 Error kirim surat:", err);
    setAlertData({
      type: "error",
      message: "Terjadi kesalahan server. Silakan coba lagi.",
    });

    setTimeout(() => setAlertData({ type: null, message: "" }), 4000);
  }
};
  

  const getCurrentDate = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
    return today.toLocaleDateString('id-ID', options)
  }

  const [showSuggestions, setShowSuggestions] = useState<boolean[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Form Surat Tugas Perjalanan Dinas
          </h1>
          <p className="text-gray-600">PT. Aishy Health Calibration</p>
        </div>
       {alertData.type && (
          <div className="mb-6">
            <AlertMessage
              type={alertData.type}
              message={alertData.message}
              show={true}
              onClose={handleCloseAlert}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Input Data</h2>
            </div>

            <form className="space-y-6">
              {/* Nomor Surat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Surat
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="nomorSurat"
                    value={formData.nomorSurat}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nomor surat atau generate otomatis"
                  />
                  <button
                    type="button"
                    onClick={generateNomorSurat}
                    className="px-4 py-3 bg-gradient-to-br from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] transition-all duration-300 border-purple-200 rounded-sm hover:text-black text-white"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Data Pegawai */}
              {employees.map((emp, index) => (
                <div key={index} className="mb-4 border-b pb-4 relative">
                  {/* Tombol Hapus Pegawai */}
                  <button
                    type="button"
                    onClick={() => removeEmployee(index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700 transition"
                    title="Hapus pegawai ini"
                  >
                    −
                  </button>

                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    {/* Nama Pegawai */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Pegawai
                      </label>
                      <input
                        type="text"
                        value={emp.nama}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleEmployeeChange(index, "nama", val);
                          setShowSuggestions((prev) => {
                            const copy = [...prev];
                            copy[index] = !!val.trim();
                            return copy;
                          });

                          if (!val.trim()) {
                            handleEmployeeChange(index, "jabatan", "");
                            handleEmployeeChange(index, "alamat", "");
                          } else {
                            const match = employeeOptions.find(
                              (opt) => opt.nama.toLowerCase() === val.toLowerCase()
                            );
                            if (!match) {
                              handleEmployeeChange(index, "jabatan", "");
                              handleEmployeeChange(index, "alamat", "");
                            }
                          }
                        }}
                        className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg"
                        placeholder="Ketik nama pegawai..."
                      />

                      {/* Dropdown suggestion */}
                      {showSuggestions[index] && emp.nama && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                          {employeeOptions
                             .filter((opt) => 
                                opt.nama.toLowerCase().includes(emp.nama.toLowerCase()) &&
                                !employees.some((e, idx) => e.nama === opt.nama && idx !== index) 
                              )
                            .map((opt, i) => (
                              <li
                                key={i}
                                onClick={() => {
                                  handleEmployeeChange(index, "id_karyawan", opt.id_karyawan);
                                  handleEmployeeChange(index, "nama", opt.nama);
                                  handleEmployeeChange(index, "jabatan", opt.jabatan);
                                  handleEmployeeChange(index, "alamat", opt.alamat);
                                  setShowSuggestions((prev) => {
                                    const copy = [...prev];
                                    copy[index] = false;
                                    return copy;
                                  });
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                              >
                                {opt.nama}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        name="jabatan"
                        value={
                          emp.jabatan
                            ? emp.jabatan.charAt(0).toUpperCase() +
                              emp.jabatan.slice(1).toLowerCase()
                            : ""
                        }
                        readOnly
                        className="w-full px-4 py-3 border text-gray-900 border-gray-200 bg-gray-100 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      name="alamat"
                      value={emp.alamat || '-'}
                      readOnly
                      rows={3}
                      className="w-full px-4 py-3 border text-gray-900 border-gray-200 bg-gray-100 rounded-lg resize-none focus:outline-none"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addEmployee}
                className="px-3 py-2 bg-gradient-to-br hover:text-black from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] transition-all duration-300 border-purple-200 rounded-sm text-white"
              >
                +
              </button>

              {/* Detail Perjalanan */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Detail Perjalanan</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wilayah Kerja/Tujuan
                    </label>
                    <input
                      type="text"
                      name="wilayah"
                      value={formData.wilayah}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Masukkan tujuan perjalanan dinas"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Berangkat
                      </label>
                      <input
                        type="date"
                        name="tanggalBerangkat"
                        value={formData.tanggalBerangkat}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Berangkat
                      </label>
                      <input
                        type="time"
                        name="jamBerangkat"
                        value={formData.jamBerangkat}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kendaraan
                    </label>
                    <select
                      name="kendaraan"
                      value={formData.kendaraan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Pilih jenis kendaraan</option>
                      <option value="Mobil Dinas">Mobil Dinas</option>
                      <option value="Mobil Pribadi">Mobil Pribadi</option>
                      <option value="Motor Dinas">Motor Dinas</option>
                      <option value="Motor Pribadi">Motor Pribadi</option>
                      <option value="Transportasi Umum">Transportasi Umum</option>
                      <option value="Pesawat">Pesawat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Akomodasi
                    </label>
                    <input
                      type="text"
                      name="akomodasi"
                      value={formData.akomodasi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Hotel, penginapan, atau lainnya"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agenda/Keperluan
                    </label>
                    <textarea
                      name="keterangan"
                      value={formData.keterangan}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Jelaskan agenda atau keperluan perjalanan dinas"
                    />
                  </div>
                </div>
              </div>
            </form>
          </Card>

          {/* Preview Section */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Preview Surat</h2>
              </div>
            </div>

            <div 
              id="letterPreview" 
              className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200 min-h-[600px] text-sm"
              style={{ fontFamily: 'Times New Roman, serif' }}
            >

            <div className="flex items-center mb-4 pb-4 border-b-4 border-black">
                <div className="w-20 h-20 flex-shrink-0">
                  <img src="/asset/logoahc.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold">PT. AISHY HEALTH CALIBRATION</div>
                  <div>Dusun Lamprada No.1.A, Lr. Lamkuta Desa Kajhu, Kec. Baitussalam, Kab. Aceh Besar, Prov. Aceh</div>
                  <div>Telp: 08116834151 - 082267016423 | Email: calibrationaishy@gmai.com</div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="font-bold text-base text-gray-900 underline mb-4">
                  SURAT TUGAS PERJALANAN DINAS
                </div>
                <div className="font-bold text-gray-900 mb-4">
                  Nomor : {formData.nomorSurat || '.../STPD-AHC/.../2025'}
                </div>
              </div>

              {/* Content */}
              <div className="text-justify text-gray-900 leading-relaxed">
                <p className="mb-6">Dengan ini memberikan tugas kepada:</p>
                {employees.map((emp, index) => (
                  <div key={index} className="mb-6">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className=" p-2 w-8">{index + 1}.</td>
                          <td className="p-2 w-24 font-medium">Nama</td>
                          <td className="p-2 w-4">:</td>
                          <td className="p-2">{emp.nama || '...............................'}</td>
                        </tr>
                        <tr>
                          <td className=" p-2"></td>
                          <td className="p-2 font-medium">Jabatan</td>
                          <td className="p-2">:</td>
                          <td className="p-2">{emp.jabatan.charAt(0).toUpperCase() + emp.jabatan.slice(1).toLowerCase() || '...............................'}</td>
                        </tr>
                        <tr>
                          <td className="p-2"></td>
                          <td className="p-2 font-medium">Alamat</td>
                          <td className="p-2">:</td>
                          <td className="p-2">{emp.alamat || '...............................'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}

                <p className="mb-6">
                  Untuk dapat melaksanakan tugas perjalanan dinas ke wilayah kerja{' '}
                  <span className="font-bold">
                    {formData.wilayah || '..........'}
                  </span>{' '}
                  adapun untuk pelaksanaan tugas tersebut sesuai dengan ketentuan sebagai berikut:
                </p>

                <div className="space-y-0.5 mb-4 leading-tight">
                  <p>Berangkat : {formData.tanggalBerangkat ? new Date(formData.tanggalBerangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '...............................'}</p>
                  <p>Jam Berangkat : {formData.jamBerangkat || '...............................'}</p>
                  <p>Kendaraan : {formData.kendaraan || '...............................'}</p>
                  <p>Akomodasi : {formData.akomodasi || '...............................'}</p>
                  <p>Agenda : {formData.keterangan || '...............................'}</p>
                </div>

                <p className="mb-8">
                  Demikian Surat Perintah Tugas ini dibuat dan dapat melaksanakannya dengan baik. 
                  Atas kerjasamanya saya ucapkan terima kasih.
                </p>

                {/* Signature */}
                <div className="border-2 border-black">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="border-r border-black p-4 w-1/2 text-center">
                          <div className="mb-2">
                            Lhokseumawe, {getCurrentDate()}
                          </div>
                          <div className="font-bold mb-16">
                            PT. Aishy Health Calibration
                          </div>
                          <div>
                            <div className="font-bold underline mb-2">Muhammad Iqbal</div>
                            <div>ADMIN KEUANGAN</div>
                          </div>
                        </td>
                        <td className="p-4 w-1/2 text-center">
                          <div className="mb-20 pt-10"></div>
                          <div>
                            <div className="font-bold underline mb-2">Bpk. Zulfikar S.Kep. M.Kes</div>
                            <div>OWNER</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                type="button"
                onClick={handleSubmit}
                className="mt-4 w-full px-4 py-3 bg-gradient-to-br from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] transition-all duration-300 text-white rounded-sm hover:text-black font-semibold"
              >
                Submit
              </button> 
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


