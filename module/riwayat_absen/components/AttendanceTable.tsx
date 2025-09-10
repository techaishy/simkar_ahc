import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AttendanceRecord } from "@/lib/types/attendance";

type Props = {
  data: AttendanceRecord[];
};
export default function AttendanceTable({ data }: Props) {
  console.log("isi data",data)
  return (
      <table className="w-full text-sm text-left min-w-[900px] ">
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
            <tr key={absen.id_at} className="border-t hover:bg-gray-50 transition">
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
              <td className="px-4 py-3 text-gray-700">{absen.clockIn ?? "-"}</td>
              <td className="px-4 py-3">
                <Badge variant={getBadgeVariant(absen.statusMasuk)}>
                  {absen.statusMasuk ?? "-"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.clockOut ?? "-"}</td>
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
          ))}
        </tbody>
      </table>
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
