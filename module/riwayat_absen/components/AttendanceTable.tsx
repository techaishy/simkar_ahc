"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AttendanceRecord } from "@/lib/types/attendance";
import PaginationControl from "@/components/ui/PaginationControl";

type Props = {
  data: AttendanceRecord[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
};

export default function AttendanceTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: Props) {
  return (
    <Card className="w-full overflow-auto rounded-2xl p-6 shadow-md border border-transparent space-y-4 mt-2">
      <table className="w-full text-sm text-left min-w-[900px]">
        <thead className="text-xs uppercase bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Jabatan</th>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Waktu Masuk</th>
            <th className="px-4 py-3">Status Masuk</th>
            <th className="px-4 py-3">Waktu Pulang</th>
            <th className="px-4 py-3">Status Pulang</th>
            <th className="px-4 py-3">Metode</th>
            <th className="px-4 py-3">Keterangan</th>
            <th className="px-4 py-3">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((absen) => (
              <tr
                key={absen.id_at}
                className="border-t border-transparent hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {absen.karyawan?.name ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {absen.karyawan?.position ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {absen.date
                    ? format(new Date(absen.date), "dd MMMM yyyy", { locale: id })
                    : "-"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {absen.clockIn ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getBadgeVariant(absen.statusMasuk)}>
                    {absen.statusMasuk ?? "-"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {absen.clockOut ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getBadgeVariant(absen.statusPulang ?? "")}>
                    {absen.statusPulang ?? "-"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{getMetode(absen)}</td>
                <td className="px-4 py-3 text-gray-700">{"-"}</td>
                <td className="px-4 py-3 text-gray-700">
                  {absen.location ?? "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Tampilkan:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm text-gray-800"
            >
              {[7, 10, 20, 25].map((size) => (
                <option key={size} value={size} className="text-sm text-gray-600" >
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-800">data</span>
          </div>

          <PaginationControl
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  );
}

function getBadgeVariant(status?: string) {
  if (!status) return "outline";
  switch (status.toLowerCase()) {
    case "tepat_waktu":
      return "default";
    case "terlambat":
      return "destructive";
    case "lembur":
      return "secondary";
    case "izin":
    case "tidak_hadir":
      return "outline";
    default:
      return "outline";
  }
}

function getMetode(absen: AttendanceRecord) {
  if (absen.photoIn) return "Selfie";
  if (absen.barcodeIn) return "Barcode";
  return "Manual";
}
