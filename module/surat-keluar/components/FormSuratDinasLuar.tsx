'use client'

import React, { useState } from 'react'
import { Printer, Download, User, MapPin, Calendar, Clock, Car } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { FormSuratKeluar } from '@/lib/types/suratkeluar'
import type { Employee } from '@/lib/types/suratkeluar'


export default function SuratTugasForm() {
  const [formData, setFormData] = useState<FormSuratKeluar>({
    nomorSurat: '',
    nama: '',
    jabatan: '',
    alamat: '',
    wilayahKerja: '',
    tanggalBerangkat: '',
    jamBerangkat: '',
    kendaraan: '',
    akomodasi: '',
    agenda: ''
  })

  const [employees, setEmployees] = useState([{ nama: '', jabatan: '', alamat: '' }])

    const handleEmployeeChange = (index: number, field: keyof Employee, value: string) => {
    setEmployees(prev => {
      const newEmployees = [...prev]
      newEmployees[index] = { ...newEmployees[index], [field]: value }
      return newEmployees
    })
  }

  const addEmployee = () => {
    setEmployees(prev => [...prev, { nama: '', jabatan: '', alamat: '' }])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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

  const handleSubmit = () => {
    const newSurat = {
      ...formData,
      employees,
      statusOwner: "Pending",
      statusManager: "Pending",
      createdAt: new Date().toISOString(),
    };
  
    const existing = JSON.parse(localStorage.getItem("riwayat_surat") || "[]");
    existing.push(newSurat);
    localStorage.setItem("riwayat_surat", JSON.stringify(existing));
  
    console.log("Submit payload:", newSurat);
    alert("Berhasil submit & disimpan ke Riwayat!");
  };
  

  const handlePrint = () => {
    const printContent = document.getElementById('letterPreview')
    if (printContent) {
      const printWindow = window.open('', '', 'width=800,height=600')
      if (printWindow) {
        let htmlContent = printContent.innerHTML

        htmlContent = htmlContent.replace(
          /<img[^>]*>/g,
          `<img 
             src="/asset/logoahc.png"
             style="width:80px; height:auto;"
          />`
        )
        printWindow.document.write(`
          <html>
            <head>
              <title>Surat Tugas Perjalanan Dinas</title>
              <style>
                body { 
                  font-family: 'Times New Roman', serif; 
                  margin: 20px;
                  font-size: 12pt;
                  line-height: 1;
                }

                .img { max-width: 100px; height: auto; }

                .letter-content { 
                  max-width: 800px; 
                  margin: 0 auto; 
                }
                table { 
                  border-collapse: collapse; 
                  width: 100%; 
                }
                td { 
                  border: 1px solid black;
                  padding: 8px; 
                }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .underline { text-decoration: underline; }
                .mb-4 { margin-bottom: 16px; }
                .mb-6 { margin-bottom: 24px; }
                .mb-8 { margin-bottom: 32px; }
                .mb-16 { margin-bottom: 64px; }
                .mb-20 { margin-bottom: 80px; }
                @media print { 
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="letter-content">${printContent.innerHTML}</div>
                    <script>
              
              const images = Array.from(document.images);
              let loaded = 0;
              if (images.length === 0) {
                window.print();
                window.close();
              } else {
                images.forEach(img => {
                  img.onload = () => {
                    loaded++;
                    if (loaded === images.length) {
                      setTimeout(() => { window.print(); window.close(); }, 200);
                    }
                  }
                });
              }
            </script>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const getCurrentDate = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
    return today.toLocaleDateString('id-ID', options)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Form Surat Tugas Perjalanan Dinas
          </h1>
          <p className="text-gray-600">PT. Aishy Health Calibration</p>
        </div>

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
                <div key={index} className="mb-4 border-b pb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={emp.nama}
                    onChange={(e) => handleEmployeeChange(index, 'nama', e.target.value)}
                    className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    name="jabatan"
                    value={emp.jabatan}
                    onChange={(e) => handleEmployeeChange(index, 'jabatan', e.target.value)}
                    className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan jabatan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={emp.alamat}
                  onChange={(e) => handleEmployeeChange(index, 'alamat', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Masukkan alamat lengkap"
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
                      name="wilayahKerja"
                      value={formData.wilayahKerja}
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
                      name="agenda"
                      value={formData.agenda}
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
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-black to-gray-900 hover:from-[#d2e67a] hover:to-[#f9fc4f] transition-all duration-300 border-purple-200 rounded-sm text-white hover:text-black"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
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
                <td className="p-2">{emp.jabatan || '...............................'}</td>
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
                    {formData.wilayahKerja || '..........'}
                  </span>{' '}
                  adapun untuk pelaksanaan tugas tersebut sesuai dengan ketentuan sebagai berikut:
                </p>

                <div className="space-y-0.5 mb-4 leading-tight">
                  <p>Berangkat : {formData.tanggalBerangkat ? new Date(formData.tanggalBerangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '...............................'}</p>
                  <p>Jam Berangkat : {formData.jamBerangkat || '...............................'}</p>
                  <p>Kendaraan : {formData.kendaraan || '...............................'}</p>
                  <p>Akomodasi : {formData.akomodasi || '...............................'}</p>
                  <p>Agenda : {formData.agenda || '...............................'}</p>
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
                            <div className="font-bold underline mb-2">Khairul Fahmi</div>
                            <div>MANAGER TEKNIK</div>
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


