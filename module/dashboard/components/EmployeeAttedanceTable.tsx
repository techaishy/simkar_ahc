"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Attendance = {
  id: string;
  name: string;
  position: string;
  department: string;
  clockIn: string | null;
  clockOut: string | null;
  AttendanceMasuk: string;
  AttendancePulang: string;
  note?: string | null;
  location?: string | null;
};

function getStatusClass(AttendanceMasuk: string) {
  const baseClass =
    "whitespace-nowrap rounded-sm font-medium px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs";
  switch (AttendanceMasuk) {
    case "TEPAT_WAKTU":
      return `${baseClass} bg-green-600 text-white`;
    case "TERLAMBAT":
      return `${baseClass} bg-yellow-500 text-white`;
    case "TIDAK_HADIR":
      return `${baseClass} bg-red-600 text-white`;
    case "LEMBUR":
      return `${baseClass} bg-blue-600 text-white`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
}

export function EmployeeAttendanceTable() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/attendance/today");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="mt-6 p-4 ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Data Karyawan Masuk Hari Ini
      </h2>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Departemen</th>
                <th className="px-4 py-2">Jabatan</th>
                <th className="px-4 py-2">Waktu Masuk</th>
                <th className="px-4 py-2">Status Masuk</th>
                <th className="px-4 py-2">Waktu Pulang</th>
                <th className="px-4 py-2">Status Pulang</th>
                <th className="px-4 py-2">Keterangan</th>
                <th className="px-4 py-2">Lokasi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                  </td>
                </tr>
              ) : (
                data.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{emp.name}</td>
                    <td className="px-4 py-2">{emp.department}</td>
                    <td className="px-4 py-2">{emp.position}</td>
                    <td className="px-4 py-2">{emp.clockIn ?? "-"}</td>
                    <td className="px-4 py-2">
                      <span className={getStatusClass(emp.AttendanceMasuk )}>
                        {emp.AttendanceMasuk}
                      </span>
                    </td>
                    <td className="px-4 py-2">{emp.clockOut ?? "-"}</td>
                    <td className="px-4 py-2">
                      <span className={getStatusClass(emp.AttendancePulang)}>
                        {emp.AttendancePulang}
                      </span>
                    </td>
                    <td className="px-4 py-2">{emp.note ?? "-"}</td>
                    <td className="px-4 py-2">{emp.location ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
