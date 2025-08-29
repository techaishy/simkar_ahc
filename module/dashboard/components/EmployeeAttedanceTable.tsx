"use client";

import { Card } from "@/components/ui/card";

const employeesToday = [
  { id: 1, name: "Agus Saputra", position: "Staff HR", waktumasuk: "08:01", statusmasuk: "Tepat Waktu", waktupulang: "17.30", statuspulang: "Tepat Waktu", note:"-", location: "Kantor Banda"},
  { id: 2, name: "Budi Santoso", position: "Admin", waktumasuk: "08:50", statusmasuk: "Terlambat", waktupulang: "20.00", statuspulang: "Lembur", note:"-", location: "RS Melati"},
  { id: 3, name: "Cici Rahmawati", position: "Kasir", waktumasuk: "-", statusmasuk: "Tidak Hadir", waktupulang: "-", statuspulang: "Tidak Hadir", note:"Sakit", location: "-" },
];

function getStatusClass(status: string) {
  const baseClass = "whitespace-nowrap rounded-sm font-medium px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs";
  switch (status) {
    case "Tepat Waktu":
      return `${baseClass} bg-green-600 text-white`;
    case "Terlambat":
      return `${baseClass} bg-yellow-500 text-white`;
    case "Tidak Hadir":
      return `${baseClass} bg-red-600 text-white`;
    case "Lembur":
      return `${baseClass} bg-blue-600 text-white`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
}


export function EmployeeAttendanceTable() {
  return (
    <Card className="mt-6 p-4 ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Karyawan Masuk Hari Ini</h2>
      <div className="overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Jabatan</th>
              <th className="px-4 py-2">Waktu Masuk</th>
              <th className="px-4 py-2">Status </th>
              <th className="px-4 py-2">Waktu Pulang</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Lokasi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {employeesToday.map((emp, index) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.position}</td>
                <td className="px-4 py-2">{emp.waktumasuk}</td>
                <td className="px-4 py-2"> <span className={getStatusClass(emp.statusmasuk)}>{emp.statusmasuk}</span></td>
                <td className="px-4 py-2">{emp.waktupulang}</td>
                <td className="px-4 py-2"> <span className={getStatusClass(emp.statuspulang)}>{emp.statuspulang}</span></td>
                <td className="px-4 py-2">{emp.note}</td>
                <td className="px-4 py-2">{emp.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
