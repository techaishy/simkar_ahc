"use client";

import { useEffect, useState } from "react";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceFilter, { FilterValues } from "./components/AttendanceFilter";
import { AttendanceRecord } from "@/lib/types/attendance";
import Breadcrumbs from "@/components/ui/breadcrumb";

export default function RiwayatAbsenPage() {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        ).toString();

        const res = await fetch(`/api/riwayat-presensi?${query}`);
        if (!res.ok) throw new Error("Gagal fetch data");

        const data: AttendanceRecord[] = await res.json();
        setAttendances(data);
      } catch (error) {
        console.error("Error fetch attendances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, [filters]);

  const totalPages = Math.ceil(attendances.length / itemsPerPage);
  const paginatedData = attendances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full min-h-screen overflow-x-hidden px-2 pb-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-4 font-semibold">
          <Breadcrumbs />
        </div>

        <AttendanceFilter onChange={setFilters} />

        {loading ? (
          <p className="text-gray-500 mt-4">Memuat data...</p>
        ) : (
          <AttendanceTable
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}
