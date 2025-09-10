"use client";

import { useEffect, useState } from "react";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceFilter, { FilterValues } from "./components/AttendanceFilter";
import { AttendanceRecord } from "@/lib/types/attendance";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";

export default function RiwayatAbsenPage() {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams(filters as any).toString();
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
    <div className="p-6 space-y-6">
      <div className="font-semibold">
          <Breadcrumbs />
      </div>
      <div className="font-semibold">
        <Card className="w-full overflow-auto rounded-2xl p-6 mb-1">
         <AttendanceFilter onChange={setFilters} />
        </Card>
        <Card className="w-full overflow-auto rounded-2xl p-6">
          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : (
            <>
              <AttendanceTable data={paginatedData} />
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
