import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

const slugToName = (slug: string) => {
  return slug
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export async function GET(req: NextRequest, { params }: { params: { kotaId: string } }) {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) return auth as NextResponse;
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const namaWilayah = slugToName(params.kotaId);

    const wilayah = await prisma.wilayah.findFirst({
      where: { nama_wilayah: namaWilayah },
      include: {
        lokasiList: true, 
      },
    });

    if (!wilayah) return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 404 });

    const puskesmas: any[] = [];
    const rsPemerintah: any[] = [];
    const rsSwasta: any[] = [];
    const rsTentara: any[] = [];
    const klinik: any[] = [];

    wilayah.lokasiList.forEach(lokasi => {
      switch (lokasi.SK) {
        case "TSK-005":
          puskesmas.push({
            id: lokasi.id,
            nama: lokasi.name,
            alamat: lokasi.Lokasi,
            telp: "-",
            jamBuka: "-",
          });
          break;
        case "TSK-001":
          break;
        case "TSK-002":
        case "TSK-003":
        case "TSK-004":
        case "TSK-006":
          rsPemerintah.push({
            id: lokasi.id,
            nama: lokasi.name,
            alamat: lokasi.Lokasi,
            telp: "-",
            jamBuka: "-",
            jenisPelayanan: "-",
          });
          break;
        default:
          klinik.push({
            id: lokasi.id,
            nama: lokasi.name,
            alamat: lokasi.Lokasi,
            telp: "-",
            jamBuka: "-",
          });
      }
    });

    return NextResponse.json({
      nama: wilayah.nama_wilayah,
      puskesmas,
      rsPemerintah,
      rsSwasta,
      rsTentara,
      klinik,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
