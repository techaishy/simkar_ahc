import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AttendanceRecord } from "@/lib/types/attendance";

type Props = {
  data: AttendanceRecord[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function AttendanceTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <Card className="w-full overflow-auto rounded-2xl p-6 shadow-md border border-transparent space-y-4">
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
          {data.map((absen) => (
            <tr key={absen.id_at} className="border-t border-transparent hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{absen.karyawan?.name ?? "-"}</td>
              <td className="px-4 py-3 text-gray-700">{absen.karyawan?.position ?? "-"}</td>
              <td className="px-4 py-3 text-gray-700">
                {absen.date
                  ? format(new Date(absen.date), "dd MMMM yyyy", { locale: id })
                  : "-"}
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.clockIn ?? "-"}</td>
              <td className="px-4 py-3">
                <Badge variant={getBadgeVariant(absen.statusMasuk)}>{absen.statusMasuk ?? "-"}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.clockOut ?? "-"}</td>
              <td className="px-4 py-3">
                <Badge variant={getBadgeVariant(absen.statusPulang ?? "")}>{absen.statusPulang ?? "-"}</Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{getMetode(absen)}</td>
              <td className="px-4 py-3 text-gray-700">{"-"}</td>
              <td className="px-4 py-3 text-gray-700">{absen.location ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination di dalam card */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          <span className="font-medium text-gray-700">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
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
