"use client";

import { useState, useEffect } from "react";
import AttendanceFilter from "./components/AttendanceFilter";
import AttendanceTable from "./components/AttendanceTable";
import PaginationControl from "@/components/ui/PaginationControl";
import { Absensi } from "../absen/type/absensi";
import { FilterValues } from "./components/AttendanceFilter";

// type PaginationControlProps = {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// };

// Dummy data sementara
const dummyData: Absensi[] = [
  {
    id: "1",
    nama: "Alam Alfarizi",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-01",
    waktuMasuk: "08:05:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "2",
    nama: "Rizky Saputra",
    jabatan: "Backend Developer",
    tanggal: "2025-08-01",
    waktuMasuk: "08:30:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "3",
    nama: "Siti Aminah",
    jabatan: "HRD",
    tanggal: "2025-08-01",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "4",
    nama: "Budi Santoso",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-02",
    waktuMasuk: "08:15:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "5",
    nama: "Cici Rahmawati",
    jabatan: "QA Engineer",
    tanggal: "2025-08-02",
    waktuMasuk: "08:45:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "6",
    nama: "Dedi Pratama",
    jabatan: "DevOps Engineer",
    tanggal: "2025-08-02",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "7",
    nama: "Eka Saputra",
    jabatan: "Mobile Developer",
    tanggal: "2025-08-03",
    waktuMasuk: "08:20:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "8",
    nama: "Farhan Nugraha",
    jabatan: "Backend Developer",
    tanggal: "2025-08-03",
    waktuMasuk: "08:35:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "9",
    nama: "Gina Lestari",
    jabatan: "HRD",
    tanggal: "2025-08-03",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "10",
    nama: "Hendra Wijaya",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-04",
    waktuMasuk: "08:10:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "11",
    nama: "Indah Permata",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-04",
    waktuMasuk: "08:40:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "12",
    nama: "Joko Susanto",
    jabatan: "QA Engineer",
    tanggal: "2025-08-04",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "13",
    nama: "Kurniawan Putra",
    jabatan: "Backend Developer",
    tanggal: "2025-08-05",
    waktuMasuk: "08:25:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "14",
    nama: "Lina Marlina",
    jabatan: "HRD",
    tanggal: "2025-08-05",
    waktuMasuk: "08:50:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "15",
    nama: "Maman Firmansyah",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-05",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "16",
    nama: "Nina Kartika",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-06",
    waktuMasuk: "08:12:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "17",
    nama: "Oki Pranata",
    jabatan: "QA Engineer",
    tanggal: "2025-08-06",
    waktuMasuk: "08:37:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "18",
    nama: "Putri Andini",
    jabatan: "HRD",
    tanggal: "2025-08-06",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "19",
    nama: "Qori Ananda",
    jabatan: "DevOps Engineer",
    tanggal: "2025-08-07",
    waktuMasuk: "08:18:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "20",
    nama: "Rian Prakoso",
    jabatan: "Mobile Developer",
    tanggal: "2025-08-07",
    waktuMasuk: "08:43:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "21",
    nama: "Sari Dewi",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-07",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "22",
    nama: "Taufik Hidayat",
    jabatan: "Backend Developer",
    tanggal: "2025-08-08",
    waktuMasuk: "08:08:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "23",
    nama: "Umi Fatimah",
    jabatan: "HRD",
    tanggal: "2025-08-08",
    waktuMasuk: "08:32:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "24",
    nama: "Vina Oktaviani",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-08",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "25",
    nama: "Wahyu Kurniawan",
    jabatan: "QA Engineer",
    tanggal: "2025-08-09",
    waktuMasuk: "08:22:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "26",
    nama: "Xena Maharani",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-09",
    waktuMasuk: "08:47:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "27",
    nama: "Yusuf Hamzah",
    jabatan: "Backend Developer",
    tanggal: "2025-08-09",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "28",
    nama: "Zahra Salma",
    jabatan: "HRD",
    tanggal: "2025-08-10",
    waktuMasuk: "08:14:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "29",
    nama: "Adi Nugroho",
    jabatan: "DevOps Engineer",
    tanggal: "2025-08-10",
    waktuMasuk: "08:38:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "30",
    nama: "Bella Anggraini",
    jabatan: "Mobile Developer",
    tanggal: "2025-08-10",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "31",
    nama: "Chandra Putra",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-11",
    waktuMasuk: "08:07:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "32",
    nama: "Dian Puspita",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-11",
    waktuMasuk: "08:42:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "33",
    nama: "Erwin Saputra",
    jabatan: "QA Engineer",
    tanggal: "2025-08-11",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "34",
    nama: "Fajar Nugraha",
    jabatan: "Backend Developer",
    tanggal: "2025-08-12",
    waktuMasuk: "08:19:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "35",
    nama: "Galih Permadi",
    jabatan: "HRD",
    tanggal: "2025-08-12",
    waktuMasuk: "08:44:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "36",
    nama: "Hana Safitri",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-12",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "37",
    nama: "Iqbal Ramadhan",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-13",
    waktuMasuk: "08:16:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "38",
    nama: "Jihan Anisa",
    jabatan: "QA Engineer",
    tanggal: "2025-08-13",
    waktuMasuk: "08:36:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "39",
    nama: "Kevin Gunawan",
    jabatan: "Backend Developer",
    tanggal: "2025-08-13",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "40",
    nama: "Lutfi Firmansyah",
    jabatan: "HRD",
    tanggal: "2025-08-14",
    waktuMasuk: "08:11:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "41",
    nama: "Mira Andayani",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-14",
    waktuMasuk: "08:39:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "42",
    nama: "Naufal Hakim",
    jabatan: "DevOps Engineer",
    tanggal: "2025-08-14",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "43",
    nama: "Olivia Salsabila",
    jabatan: "Mobile Developer",
    tanggal: "2025-08-15",
    waktuMasuk: "08:09:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "44",
    nama: "Prasetyo Adi",
    jabatan: "Backend Developer",
    tanggal: "2025-08-15",
    waktuMasuk: "08:41:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "45",
    nama: "Qiana Rahmi",
    jabatan: "UI/UX Designer",
    tanggal: "2025-08-15",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "46",
    nama: "Rafli Syahputra",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-16",
    waktuMasuk: "08:13:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "47",
    nama: "Salsa Nuraini",
    jabatan: "QA Engineer",
    tanggal: "2025-08-16",
    waktuMasuk: "08:48:00",
    statusMasuk: "Terlambat",
  },
  {
    id: "48",
    nama: "Tio Bagus",
    jabatan: "HRD",
    tanggal: "2025-08-16",
    waktuMasuk: "00:00:00",
    statusMasuk: "Tidak Hadir",
  },
  {
    id: "49",
    nama: "Usman Fadhil",
    jabatan: "Backend Developer",
    tanggal: "2025-08-17",
    waktuMasuk: "08:23:00",
    statusMasuk: "Tepat Waktu",
  },
  {
    id: "50",
    nama: "Vera Anggun",
    jabatan: "Frontend Developer",
    tanggal: "2025-08-17",
    waktuMasuk: "08:46:00",
    statusMasuk: "Terlambat",
  },
];
export default function RiwayatAbsensiPage() {
  const [filteredData, setFilteredData] = useState<Absensi[]>(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handler saat klik "Terapkan"
  const handleFilter = (filters: FilterValues) => {
    let result = dummyData;

    if (filters.tanggalAwal && filters.tanggalAkhir) {
      result = result.filter((item) => {
        const tanggal = new Date(item.tanggal);
        return (
          tanggal >= new Date(filters.tanggalAwal) &&
          tanggal <= new Date(filters.tanggalAkhir)
        );
      });
    }

    if (filters.metode) {
      result = result.filter((item) => item.metode === filters.metode);
    }

    if (filters.pegawai) {
      result = result.filter((item) =>
        item.nama.toLowerCase().includes(filters.pegawai.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter(
        (item) =>
          item.statusMasuk &&
          item.statusMasuk.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    setFilteredData(result);
    setCurrentPage(1); 
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
    
      <AttendanceFilter onFilter={handleFilter} />

  
      <AttendanceTable data={paginatedData} />

      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

