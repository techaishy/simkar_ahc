import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Absensi } from "@/module/absen/type/absensi";

type Props = {
  data: Absensi[];
};

export default function AttendanceTable({ data }: Props) {
  return (
    <Card className="w-full overflow-auto rounded-2xl p-6 ">
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
            <th className="px-4 py-3">Durasi Kerja</th>
            <th className="px-4 py-3">Metode</th>
            <th className="px-4 py-3">Keterangan</th>
            <th className="px-4 py-3">Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((absen) => (
            <tr key={absen.id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{absen.nama}</td>
              <td className="px-4 py-3 text-gray-700">{absen.jabatan}</td>
              <td className="px-4 py-3 text-gray-700">
                {absen.tanggal
                  ? format(new Date(absen.tanggal), "dd MMMM yyyy", { locale: id })
                  : "-"}
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.waktuMasuk}</td>
              <td className="px-4 py-3">
                <Badge variant={getBadgeVariant(absen.statusMasuk)}>
                  {absen.statusMasuk }
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.waktuPulang}</td>
              <td className="px-4 py-3">
                <Badge variant={getBadgeVariant(absen.statusPulang)}>
                  {absen.statusPulang }
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-700">{absen.durasiKerja}</td>
              <td className="px-4 py-3 text-gray-700">{absen.metode }</td>
              <td className="px-4 py-3 text-gray-700">{absen.keterangan }</td>
              <td className="px-4 py-3 text-gray-700">{absen.lokasi }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function getBadgeVariant(status?: string) {
  if (!status) return "outline";
  switch (status.toLowerCase()) {
    case "tepat waktu":
      return "default"; 
    case "terlambat":
      return "destructive"; 
    case "lembur":
      return "secondary"; 
    case "izin":
    case "tidak hadir":
      return "outline"; 
    default:
      return "outline";
  }
}
