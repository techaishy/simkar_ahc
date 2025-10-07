"use client";

import React, { useState, useEffect } from "react";
import { Eye, Printer, Search, Filter, FileText, Trash2 } from "lucide-react";
import PaginationControl from "@/components/ui/PaginationControl";

interface KondisiKalibrator {
  accesoris: string;
  kabel: string;
  tombol: string;
  fungsi: string;
  fisik: string;
}

interface BarangItem {
  nama: string;
  merk: string;
  type: string;
  noSeri: string;
  kondisi: KondisiKalibrator;
}

interface SuratAlat {
  tanggal: string;
  keperluan: string;
  barangList: BarangItem[];
  statusManajer: string;
  statusAdmin: string;
  createdAt: string;
}

export default function ApprovalSuratAlat() {
  const [data, setData] = useState<SuratAlat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [selectedSurat, setSelectedSurat] = useState<SuratAlat | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const role = userData?.role;

  // Load data dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("surat_alat");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error("Gagal parse surat_alat:", err);
      }
    }
  }, []);

  // Filter & search
  const filteredData = data.filter((item) => {
    const matchSearch = item.keperluan
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFilter =
      filterStatus === "semua" ||
      item.statusManajer === filterStatus ||
      item.statusAdmin === filterStatus;
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
      case "Disetujui":
        return `${base} bg-green-100 text-green-700`;
      case "Ditolak":
        return `${base} bg-red-100 text-red-700`;
      case "Pending":
      case "Menunggu":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const handleHapus = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      localStorage.setItem("riwayat_surat", JSON.stringify(newData));
    }
  };

  const handleApproval = (surat: SuratAlat, status: "approve" | "reject") => {
    const updated = data.map((item) =>
      item.createdAt === surat.createdAt
        ? {
            ...item,
            statusManajer:
              role === "MANAJER"
                ? status === "approve"
                  ? "Disetujui"
                  : "Ditolak"
                : item.statusManajer,
            statusAdmin:
              role === "ADMIN"
                ? status === "approve"
                  ? "Disetujui"
                  : "Ditolak"
                : item.statusAdmin,
          }
        : item
    );
    setData(updated);
    localStorage.setItem("surat_alat", JSON.stringify(updated));
  };

  const handleLihatDetail = (surat: SuratAlat) => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  const handlePrint = (surat: SuratAlat) => {
    const printWindow = window.open("", "_blank", "width=1000,height=700");
    if (!printWindow) return;

    const manajerTTD =
      surat.statusManajer === "Disetujui"
        ? `<img src="/TTD/manajer.jpg" style="width:200px;height:80px;" />`
        : ``;
    const adminTTD =
      surat.statusAdmin === "Disetujui"
        ? `<img src="/TTD/adm.jpg" style="width:200px;height:80px;" />`
        : ``;

    printWindow.document.write(`
      <html>
      <head>
        <title>Berita Acara Pemakaian Alat Kalibrator</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; margin: 40px; }
          table { border-collapse: collapse; width: 100%; font-size: 11pt; }
          td, th { border: 1px solid black; padding: 4px; text-align: center; }
          .no-border td { border: none; }
          .title { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 10px; }
          .signature { text-align: center; vertical-align: top; width: 33%; }
        </style>
      </head>
      <body>
        <div class="title">BERITA ACARA PEMAKAIAN ALAT KALIBRATOR DI LUAR LABORATORIUM</div>
        <table style="border:none; margin-bottom:10px;">
          <tr class="no-border"><td style="text-align:left;">1. TANGGAL</td><td style="border:none;">: ${surat.tanggal}</td></tr>
          <tr class="no-border"><td style="text-align:left;">2. KEPERLUAN</td><td style="border:none;">: ${surat.keperluan}</td></tr>
        </table>
        <table>
          <tr>
            <th rowspan="2">NO</th>
            <th colspan="4">SPESIFIKASI ALAT KALIBRATOR</th>
            <th colspan="5">KONDISI ALAT KALIBRATOR</th>
          </tr>
          <tr>
            <th>NAMA</th><th>MERK</th><th>TYPE</th><th>NO. SERI</th>
            <th>ASESORIS</th><th>KABEL</th><th>TOMBOL</th><th>FUNGSI</th><th>FISIK</th>
          </tr>
          ${surat.barangList
            .map(
              (b, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${b.nama}</td>
                <td>${b.merk}</td>
                <td>${b.type}</td>
                <td>${b.noSeri}</td>
                <td>${b.kondisi.accesoris}</td>
                <td>${b.kondisi.kabel}</td>
                <td>${b.kondisi.tombol}</td>
                <td>${b.kondisi.fungsi}</td>
                <td>${b.kondisi.fisik}</td>
              </tr>`
            )
            .join("")}
        </table>
        <br/><br/>
        <table class="no-border" style="margin-top:30px; text-align:center; width:100%;">
          <tr>
            <td class="signature">PETUGAS<br/><br/><br/>__________<br/>TEKNISI</td>
            <td class="signature">PEMERIKSA<br/>${adminTTD}<br/>__________<br/>ADMIN</td>
            <td class="signature">MENGETAHUI<br/>${manajerTTD}<br/>__________<br/>MANAGER TEKNIK</td>
          </tr>
        </table>
        <script>window.print(); window.close();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Approval Surat Alat
            </h1>
          </div>
          <p className="text-gray-600">Berita acara pemakaian alat kalibrator</p>
        </div>

        {/* Filter dan Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari keperluan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden text-black">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Keperluan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Status Admin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Status Manajer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.tanggal}</td>
                      <td className="px-4 py-2">{item.keperluan}</td>
                      <td className="px-4 py-2">
                        <span className={getStatusBadge(item.statusAdmin)}>
                          {item.statusAdmin}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={getStatusBadge(item.statusManajer)}>
                          {item.statusManajer}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleLihatDetail(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                     
                        <button
                          onClick={() => handlePrint(item)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Surat Alat
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>Tanggal:</strong> {selectedSurat.tanggal}</p>
              <p><strong>Keperluan:</strong> {selectedSurat.keperluan}</p>

              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Merk</th>
                    <th>Type</th>
                    <th>No Seri</th>
                    <th>Asesoris</th>
                    <th>Kabel</th>
                    <th>Tombol</th>
                    <th>Fungsi</th>
                    <th>Fisik</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSurat.barangList.map((b, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{b.nama}</td>
                      <td>{b.merk}</td>
                      <td>{b.type}</td>
                      <td>{b.noSeri}</td>
                      <td>{b.kondisi.accesoris}</td>
                      <td>{b.kondisi.kabel}</td>
                      <td>{b.kondisi.tombol}</td>
                      <td>{b.kondisi.fungsi}</td>
                      <td>{b.kondisi.fisik}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              {role === "MANAGER" ? (
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
}

