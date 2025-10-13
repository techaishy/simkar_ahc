"use client";

import React, { useState, useEffect } from "react";
import { Eye, Printer, Search, Filter, FileText, Trash2 } from "lucide-react";
import PaginationControl from "@/components/ui/PaginationControl";
import { SuratKeluarAlat, alatItem } from "@/lib/types/suratkeluar";
import { formatDateWIB } from "@/lib/timezone";

export default function ApprovalSuratAlat() {
  const [data, setData] = useState<SuratKeluarAlat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [selectedSurat, setSelectedSurat] = useState<SuratKeluarAlat | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setRole(userData?.role || null);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/surat-alat/riwayat");
        if (!res.ok) throw new Error("Gagal memuat data surat alat");
        const result = await res.json();
        setData(result.data || []);
      } catch (err) {
        console.error("Fetch surat alat gagal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter & search
  const filteredData = data.filter((item) => {
    const matchSearch = item.keperluan
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter =
      filterStatus === "semua" || item.statusManajer === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "DISETUJUI":
      case "Disetujui":
        return `${base} bg-green-100 text-green-700`;
      case "DITOLAK":
      case "Ditolak":
        return `${base} bg-red-100 text-red-700`;
      case "PENDING":
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

const handleHapus = async (nomorSurat: string) => {
  if (!confirm("Apakah Anda yakin ingin menghapus surat ini?")) return;

  try {
     const res = await fetch(`/api/surat-alat/delete/${encodeURIComponent(nomorSurat)}`,  {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Gagal menghapus surat");
    setData((prev) => prev.filter((item) => item.nomorSurat !== nomorSurat));

    alert("Surat berhasil dihapus!");
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan saat menghapus surat!");
  }
};

const handleApproval = async (
  surat: SuratKeluarAlat,
  status: "approve" | "reject"
) => {
  const message =
    status === "approve"
      ? "Apakah Anda yakin ingin menyetujui surat alat ini?"
      : "Apakah Anda yakin ingin menolak surat alat ini?";

  if (!confirm(message)) return;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const newStatus = status === "approve" ? "DISETUJUI" : "DITOLAK";

    const res = await fetch(`/api/surat-alat/approved`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomorSurat: surat.nomorSurat,
        status: newStatus,
        approvedBy: user.customId,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert("Gagal update surat: " + (data.message || "Terjadi kesalahan"));
      return;
    }

    setData((prev) =>
      prev.map((item) =>
        item.nomorSurat === surat.nomorSurat
          ? { ...item, statusManajer: newStatus }
          : item
      )
    );

    setSelectedSurat((prev) =>
      prev ? { ...prev, statusManajer: newStatus } : null
    );

    setShowModal(false);
    alert(`Surat berhasil ${newStatus}`);
  } catch (err) {
    console.error("Error saat update surat alat:", err);
    alert("Terjadi kesalahan saat update surat alat");
  }
};



  const handleLihatDetail = (surat: SuratKeluarAlat) => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  const handlePrint = (surat: SuratKeluarAlat) => {
    const printWindow = window.open("", "_blank", "width=1000,height=700");
    if (!printWindow) return;

    const manajerTTD =
      surat.statusManajer === "Disetujui"
        ? `<img src="/TTD/manajerteknik.jpg" style="width:200px;height:80px;" />`
        : ``;
    

        const headerHTML = `
        <thead>
          <tr>
            <td colspan="2">
              <div style="text-align:center; font-weight:bold; font-size:13pt; margin-bottom:8px;">
                BERITA ACARA PEMAKAIAN ALAT KALIBRATOR DI LUAR LABORATORIUM
              </div>
              <div style="text-align:center; font-weight:bold; font-size:11pt; margin-bottom:16px;">
                Nomor : ${surat.nomorSurat}
              </div>
            </td>
          </tr>
        </thead>
      `;
    
      const bodyContentHTML = `
        <tbody>
          <tr>
            <td colspan="2">
              <div style="font-size:11pt; font-family:'Times New Roman', serif; line-height:1.5; margin:0 0.5cm;">
    
                <!-- BAGIAN 1: INFO TANGGAL & KEPERLUAN -->
                <div style="page-break-inside: avoid; break-inside: avoid;">
                  <table style="width:100%; border:none; margin-bottom:12px; font-size:10pt;">
                    <tr>
                      <td style="width:120px; border:none; text-align:left; padding:4px 0;">1. TANGGAL</td>
                      <td style="border:none; text-align:left; padding:4px 0;">: ${formatDateWIB(new Date(surat.tanggal))}</td>
                    </tr>
                    <tr>
                      <td style="border:none; text-align:left; padding:4px 0;">2. KEPERLUAN</td>
                      <td style="border:none; text-align:left; padding:4px 0;">: ${surat.keperluan}</td>
                    </tr>
                  </table>
                </div>
    
                <!-- BAGIAN 2: TABEL BARANG -->
                <div style="page-break-inside: avoid; break-inside: avoid;">
                  <table style="width:100%; border-collapse:collapse; font-size:10pt; margin-bottom:16px;">
                    <tr>
                      <th rowspan="2" style="border:1px solid black; padding:4px; width:30px;">NO</th>
                      <th colspan="5" style="border:1px solid black; padding:4px;">SPESIFIKASI ALAT KALIBRATOR</th>
                      <th colspan="5" style="border:1px solid black; padding:4px;">KONDISI ALAT KALIBRATOR</th>
                    </tr>
                    <tr>
                      <th style="border:1px solid black; padding:4px; width:150px;">NAMA</th>
                      <th style="border:1px solid black; padding:4px; width:100px;">MERK</th>
                      <th style="border:1px solid black; padding:4px; width:100px;">TYPE</th>
                      <th style="border:1px solid black; padding:4px; width:100px;">KODE UNIT</th>
                      <th style="border:1px solid black; padding:4px; width:100px;">NO. SERI</th>
                      <th style="border:1px solid black; padding:4px; width:80px;">ASESORIS</th>
                      <th style="border:1px solid black; padding:4px; width:80px;">KABEL</th>
                      <th style="border:1px solid black; padding:4px; width:80px;">TOMBOL</th>
                      <th style="border:1px solid black; padding:4px; width:80px;">FUNGSI</th>
                      <th style="border:1px solid black; padding:4px; width:80px;">FISIK</th>
                    </tr>
                    ${Array.isArray(surat.daftarAlat)
                      ? surat.daftarAlat
                          .map(
                            (b, i) => `
                            <tr>
                              <td style="border:1px solid black; text-align:center;">${i + 1}</td>
                              <td style="border:1px solid black; text-align:center;">${b.nama ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.merk ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.type ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kodeUnit ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.noSeri ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kondisi?.accessories ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kondisi?.kabel ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kondisi?.tombol ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kondisi?.fungsi ?? "-"}</td>
                              <td style="border:1px solid black; text-align:center;">${b.kondisi?.fisik ?? "-"}</td>
                            </tr>`
                          )
                          .join("")
                      : ""}
                  </table>
                </div>
    
                <!-- BAGIAN 3: TANDA TANGAN -->
                <div style="page-break-inside: avoid; break-inside: avoid; margin-top:24px;">
                  <table style="width:100%; border:none; text-align:center; font-size:10pt;">
                    <tr>
                      <td style="width:33.33%; border:none; vertical-align:top; padding:5px;">
                        <div style="font-weight:normal; margin-bottom:3px;">PETUGAS</div>
                        <div style="height:65px;"></div>
                        <div style="text-decoration:underline;">________________</div>
                        <div style="font-weight:bold; margin-top:2px;">TEKNISI</div>
                      </td>
                      <td style="width:33.33%; border:none; vertical-align:top; padding:5px;">
                        <div style="font-weight:normal; margin-bottom:3px;">PEMERIKSA</div>
                        <div style="height:65px;"></div>
                        <div style="text-decoration:underline; margin:3px 0;">Muhammad Hanif</div>
                        <div style="font-weight:bold; margin-top:2px;">ADMIN</div>
                      </td>
                      <td style="width:33.33%; border:none; vertical-align:top; padding:5px;">
                        <div style="font-weight:normal; margin-bottom:3px;">MENGETAHUI</div>
                        ${manajerTTD}
                        <div style="text-decoration:underline; margin:3px 0;">Khairul Fahmi</div>
                        <div style="font-weight:bold; margin-top:2px;">MANAGER TEKNIK</div>
                      </td>
                    </tr>
                  </table>
                </div>
    
              </div>
            </td>
          </tr>
        </tbody>
      `;
    
      printWindow.document.write(`
        <html>
          <head>
            <title>Berita Acara Pemakaian Alat Kalibrator</title>
            <style>
              @page {
                size: A4 landscape;
                margin: 1.5cm 1cm 1.5cm 1cm;
              }
    
              body { 
                margin: 0; 
                padding: 0; 
                font-family: 'Times New Roman', serif;
              }
    
              table { 
                page-break-inside: auto; 
                border-collapse: collapse; 
                width: 100%;
              }
    
              tr { 
                page-break-inside: avoid; 
              }
    
              thead { 
                display: table-header-group; 
              }
    
              .signature-image {
                width: 160px;
                height: 60px;
                display: block;
                margin: 3px auto;
                object-fit: contain;
              }
    
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
    
                .signature-image {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <table style="width:100%; border-collapse:collapse;">
              ${headerHTML}
              ${bodyContentHTML}
            </table>
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
                    if (loaded === images.length) setTimeout(() => { window.print(); window.close(); }, 200); 
                  };
                  img.onerror = () => { 
                    loaded++; 
                    if (loaded === images.length) setTimeout(() => { window.print(); window.close(); }, 200); 
                  };
                });
              }
            </script>
          </body>
        </html>
      `);
    
      printWindow.document.close();
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Approval Surat Alat
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Berita acara pemakaian alat kalibrator
          </p>
        </div>
  
        {/* Filter dan Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari keperluan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="semua">Semua Status</option>
              <option value="DISETUJUI">Disetujui</option>
              <option value="DITOLAK">Ditolak</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
  
        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Keperluan
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Nomor Surat
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Status Manajer
                  </th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2"> {formatDateWIB(new Date(item.tanggal))}</td>
                      <td className="px-4 py-2">{item.keperluan}</td>
                      <td className="px-4 py-2">{item.nomorSurat}</td>
                      <td className="px-4 py-2">
                        <span className={getStatusBadge(item.statusManajer)}>
                          {item.statusManajer}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleLihatDetail(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(item)}
                          className="p-2 text-green-600 hover:bg-gray-50 rounded-lg"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleHapus(item.nomorSurat)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Pagination */}
        <div className="mt-4 flex justify-center sm:justify-end">
          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            perPage={perPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
  
      {/* Modal Detail */}
      {showModal && selectedSurat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 sm:px-8 py-4 border-b bg-gray-50 rounded-t-xl">
              <h2 className="text-xl sm:text-2xl font-semibold">Detail Surat Alat</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-10 py-4 sm:py-6 space-y-6 text-sm sm:text-base">

              {/* Info Surat */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Nomor Surat</h3>
                <p className="text-gray-800 break-words">{selectedSurat.nomorSurat}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-semibold text-gray-700">Tanggal:</span>
                  <p className="text-gray-600 mt-1">{formatDateWIB(new Date(selectedSurat.tanggal))}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Keperluan:</span>
                  <p className="text-gray-600 mt-1">{selectedSurat.keperluan}</p>
                </div>
              </div>

              {/* Tabel Alat */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full text-xs sm:text-sm text-center border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border p-2 sm:p-3">No</th>
                      <th className="border p-2 sm:p-3">Nama</th>
                      <th className="border p-2 sm:p-3">Merk</th>
                      <th className="border p-2 sm:p-3">Type</th>
                      <th className="border p-2 sm:p-3">Kode Unit</th>
                      <th className="border p-2 sm:p-3">No Seri</th>
                      <th className="border p-2 sm:p-3">Asesoris</th>
                      <th className="border p-2 sm:p-3">Kabel</th>
                      <th className="border p-2 sm:p-3">Tombol</th>
                      <th className="border p-2 sm:p-3">Fungsi</th>
                      <th className="border p-2 sm:p-3">Fisik</th>
                    </tr>
                  </thead>
                 <tbody>
                  {Array.isArray(selectedSurat.daftarAlat) && selectedSurat.daftarAlat.length > 0 ? (
                    selectedSurat.daftarAlat.map((b: alatItem, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border p-2 sm:p-3">{i + 1}</td>
                        <td className="border p-2 sm:p-3">{b.nama}</td>
                        <td className="border p-2 sm:p-3">{b.merk}</td>
                        <td className="border p-2 sm:p-3">{b.type}</td>
                        <td className="border p-2 sm:p-3">{b.kodeUnit}</td>
                        <td className="border p-2 sm:p-3">{b.noSeri}</td>
                        <td className="border p-2 sm:p-3">{b.kondisi.accessories}</td>
                        <td className="border p-2 sm:p-3">{b.kondisi.kabel}</td>
                        <td className="border p-2 sm:p-3">{b.kondisi.tombol}</td>
                        <td className="border p-2 sm:p-3">{b.kondisi.fungsi}</td>
                        <td className="border p-2 sm:p-3">{b.kondisi.fisik}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center p-4 text-gray-500">
                        Tidak ada unit alat
                      </td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-10 py-4 sm:py-5 border-t bg-gray-50 flex flex-wrap gap-3 justify-end rounded-b-xl">
              {role === "MANAJER" ? (
                <>
                  <button
                    onClick={() => handleApproval(selectedSurat, "approve")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleApproval(selectedSurat, "reject")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
                  >
                    Tolak
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handlePrint(selectedSurat)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base"
                >
                  <Printer className="w-4 h-4" />
                  Print Surat
                </button>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}  