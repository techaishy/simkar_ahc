import React, { useState, useEffect } from "react";
import { Eye, Printer, Trash2, Search, Filter, FileText } from "lucide-react";
import { FormSuratKeluar } from "@/lib/types/suratkeluar";
import PaginationControl from "@/components/ui/PaginationControl";

const RiwayatSurat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [suratData, setSuratData] = useState<FormSuratKeluar[]>([]);
  const [selectedSurat, setSelectedSurat] = useState<FormSuratKeluar | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const role = userData?.role;

  // Load data dari localStorage saat komponen mount
  useEffect(() => {
    loadData();
  }, []);

  const filteredData = suratData.filter((item) => {
    const firstEmployee = item.employees[0]?.nama || "";
    const matchSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firstEmployee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filterStatus === "semua" ||
      item.statusOwner === filterStatus ||
      item.statusAdm === filterStatus;

    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const loadData = () => {
    const data = localStorage.getItem("riwayat_surat");
    if (data) {
      setSuratData(JSON.parse(data));
    }
  };

  // Fungsi untuk mendapatkan style badge status
  const getStatusBadge = (status: string) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "Disetujui":
        return `${baseClass} bg-green-100 text-green-700`;
      case "Ditolak":
        return `${baseClass} bg-red-100 text-red-700`;
      case "Pending":
      case "Menunggu":
        return `${baseClass} bg-yellow-100 text-yellow-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  };

  const handleApproval = (
    surat: FormSuratKeluar,
    status: "approve" | "reject"
  ) => {
    const updatedData = suratData.map((item) =>
      item.nomorSurat === surat.nomorSurat
        ? {
            ...item,
            statusOwner:
              role === "OWNER"
                ? status === "approve"
                  ? "Disetujui"
                  : "Ditolak"
                : item.statusOwner,
            statusAdm:
              role === "KEUANGAN"
                ? status === "approve"
                  ? "Disetujui"
                  : "Ditolak"
                : item.statusAdm,
          }
        : item
    );

    setSuratData(updatedData);
    localStorage.setItem("riwayat_surat", JSON.stringify(updatedData));
  };

  // Fungsi hapus surat
  const handleHapus = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
      const newData = suratData.filter((_, i) => i !== index);
      setSuratData(newData);
      localStorage.setItem("riwayat_surat", JSON.stringify(newData));
    }
  };

  // Fungsi lihat detail
  const handleLihatDetail = (surat: FormSuratKeluar) => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  // Fungsi print
  const handlePrint = (surat: FormSuratKeluar) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      //fungsi untuk tanda tangan
      const ownerTTD =
        surat.statusOwner === "Disetujui"
          ? `<img src="/TTD/owner.jpg" style="width: 300px; height: 100px; margin-bottom: 0px;" />`
          : `<div style="height: 0px;"></div>`;

      const admTTD =
        surat.statusAdm === "Disetujui"
          ? `<img src="/TTD/adm.jpg" style="width: 200px; height: 100px; margin-bottom: 0px;" />`
          : `<div style="height: 0px;"></div>`;

      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      const getCurrentDate = () => {
        const today = new Date();
        return today.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      printWindow.document.write(`
        <html>
          <head>
            <title>Surat Tugas Perjalanan Dinas - ${surat.nomorSurat}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                margin: 20px;
                font-size: 12pt;
                line-height: 1.5;
              }
              .letter-content { 
                max-width: 800px; 
                margin: 0 auto; 
              }
              .header-table {
                width: 100%;
                margin-bottom: 20px;
                border-bottom: 4px solid black;
                padding-bottom: 10px;
              }
              .logo-cell {
                width: 100px;
                text-align: center;
              }
              .logo {
                width: 80px;
                height: auto;
              }
              .company-info {
                text-align: center;
                vertical-align: middle;
              }
              .company-name {
                font-size: 18pt;
                font-weight: bold;
              }
              table { 
                width: 100%;
              }
              .detail-table td {
                padding: 4px 8px;
                vertical-align: top;
              }
              .signature-table {
                width: 100%;
                border: 2px solid black;
                margin-top: 20px;
              }
              .signature-table td {
                border: 1px solid black;
                padding: 20px;
                text-align: center;
                width: 50%;
              }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .underline { text-decoration: underline; }
              .mb-4 { margin-bottom: 16px; }
              .signature-space { margin-bottom: 80px; }
              @media print { 
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="letter-content">
              <!-- Header -->
              <table class="header-table">
                <tr>
                  <td class="logo-cell">
                    <img src="/asset/logoahc.png" alt="Logo AHC" class="logo" />
                  </td>
                  <td class="company-info">
                    <div class="company-name">PT. AISHY HEALTH CALIBRATION</div>
                    <div>Dusun Lamprada No.1.A, Lr. Lamkuta Desa Kajhu, Kec. Baitussalam, Kab. Aceh Besar, Prov. Aceh</div>
                    <div>Telp: 08116834151 - 082267016423 | Email: calibrationaishy@gmail.com</div>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <div class="text-center mb-4">
                <div class="font-bold underline" style="font-size: 14pt;">
                  SURAT TUGAS PERJALANAN DINAS
                </div>
                <div class="font-bold" style="margin-top: 16px;">
                  Nomor : ${surat.nomorSurat}
                </div>
              </div>

              <!-- Content -->
              <div style="text-align: justify; margin-top: 24px;">
                <p style="margin-bottom: 16px;">Dengan ini memberikan tugas kepada:</p>

                ${surat.employees
                  .map(
                    (emp, index) => `
                  <table class="detail-table" style="margin-bottom: 16px;">
                    <tr>
                      <td style="width: 30px;">${index + 1}.</td>
                      <td style="width: 100px;"><strong>Nama</strong></td>
                      <td style="width: 10px;">:</td>
                      <td>${emp.nama}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><strong>Jabatan</strong></td>
                      <td>:</td>
                      <td>${
                        emp.jabatan.charAt(0).toUpperCase() +
                        emp.jabatan.slice(1).toLowerCase()
                      }</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><strong>Alamat</strong></td>
                      <td>:</td>
                      <td>${emp.alamat}</td>
                    </tr>
                  </table>
                `
                  )
                  .join("")}

                <p style="margin: 16px 0;">
                  Untuk dapat melaksanakan tugas perjalanan dinas ke wilayah kerja 
                  <strong>${surat.wilayahKerja}</strong> 
                  adapun untuk pelaksanaan tugas tersebut sesuai dengan ketentuan sebagai berikut:
                </p>

                <div style="margin: 16px 0;">
                  <p>Berangkat : ${formatDate(surat.tanggalBerangkat)}</p>
                  <p>Jam Berangkat : ${surat.jamBerangkat}</p>
                  <p>Kendaraan : ${surat.kendaraan}</p>
                  <p>Akomodasi : ${surat.akomodasi}</p>
                  <p>Agenda : ${surat.agenda}</p>
                </div>

                <p style="margin: 24px 0;">
                  Demikian Surat Perintah Tugas ini dibuat dan dapat melaksanakannya dengan baik. 
                  Atas kerjasamanya saya ucapkan terima kasih.
                </p>

                <!-- Signature -->
          
                <table style="width: 100%; margin-top: 20px;">
  <tr>
    <td style="text-align: center; vertical-align: top; width: 50%;">
    <div>Lhokseumawe, ${getCurrentDate()}</div>
    <div class="font-bold" style="margin-top: 8px;">PT. Aishy Health Calibration</div>
    <div class="signature-space">${admTTD}
    <div>
        <strong>Keuangan</strong><br />
        <div style="margin-top: 2px;">Muhammad Iqbal</div></div></div>
    </td>

    <td style="text-align: center; vertical-align: top; width: 50%;">
    <div class="signature-space" style="margin-top: 45px;">${ownerTTD}
      <div>
        <strong>Owner</strong><br />
        <div style="margin-top: 2px;">Bpk. Zulfikar S.Kep, M.Kes</div></div>
      </div>
    </td>
   
  </tr>
</table>

              </div>
            </div>
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
                  };
                  img.onerror = () => {
                    loaded++;
                    if (loaded === images.length) {
                      setTimeout(() => { window.print(); window.close(); }, 200);
                    }
                  };
                });
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Approval Surat</h1>
          </div>
          <p className="text-gray-600">
            Kelola dan pantau semua surat perjalanan dinas
          </p>
        </div>

        {/* Filter dan Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nomor surat atau nama pegawai..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="semua">Semua Status</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nomor Surat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Pegawai
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status Adm. Keuangan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Tidak ada data ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nomorSurat}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.employees[0]?.nama || "-"}
                        {item.employees.length > 1 && (
                          <span className="ml-2 text-xs text-gray-500">
                            (+{item.employees.length - 1} lainnya)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(item.statusOwner)}>
                          {item.statusOwner}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(item.statusAdm)}>
                          {item.statusAdm}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLihatDetail(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handlePrint(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Print"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleHapus(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        <div className="mt-4 flex justify-end">
          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={handlePageChange}
          />
        </div>


       

      {/* Modal Detail */}
      {showModal && selectedSurat && (
        <div className="fixed inset-0 flex bg-black/50 items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Detail Surat
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* Nomor Surat */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600">
                  Nomor Surat
                </h3>
                <p className="text-gray-800">{selectedSurat.nomorSurat}</p>
              </div>

              {/* Pegawai */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Pegawai
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSurat.employees.map((emp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-gray-100 border shadow-sm"
                    >
                      <p className="font-medium text-gray-900">{emp.nama}</p>
                      <p className="text-sm text-gray-600">
                        Jabatan: {emp.jabatan}
                      </p>
                      <p className="text-sm text-gray-600">
                        Alamat: {emp.alamat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informasi Umum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Tujuan
                  </h3>
                  <p className="text-gray-800">{selectedSurat.wilayahKerja}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Tanggal Berangkat
                  </h3>
                  <p className="text-gray-800">
                    {new Date(
                      selectedSurat.tanggalBerangkat
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Jam Berangkat
                  </h3>
                  <p className="text-gray-800">{selectedSurat.jamBerangkat}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Kendaraan
                  </h3>
                  <p className="text-gray-800">{selectedSurat.kendaraan}</p>
                </div>
              </div>

              {/* Akomodasi */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Akomodasi
                </h3>
                <p className="text-gray-800">{selectedSurat.akomodasi}</p>
              </div>

              {/* Agenda */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Agenda
                </h3>
                <p className="text-gray-800">{selectedSurat.agenda}</p>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Status Owner
                  </h3>
                  <span className={getStatusBadge(selectedSurat.statusOwner)}>
                    {selectedSurat.statusOwner}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    Status Adm. Keuangan
                  </h3>
                  <span className={getStatusBadge(selectedSurat.statusAdm)}>
                    {selectedSurat.statusAdm}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              {role === "OWNER" || role === "KEUANGAN" ? (
                <>
                  <button
                    onClick={() => handleApproval(selectedSurat, "approve")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleApproval(selectedSurat, "reject")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tolak
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handlePrint(selectedSurat)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Surat
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatSurat;
