import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

const slugToName = (slug: string) =>
  slug
    .split("-")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

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
        lokasiList: {
          include: {
            wilayahKerja: {
              include: { alatKalibrasi: true }, 
            },
          },
        },
      },
    });

    if (!wilayah) {
      return NextResponse.json({ error: "Wilayah tidak ditemukan" }, { status: 404 });
    }

    const puskesmas: any[] = [];
    const rsPemerintah: any[] = [];
    const rsSwasta: any[] = [];
    const rsTentara: any[] = [];
    const klinik: any[] = [];

    wilayah.lokasiList.forEach(lokasi => {
      const alatMap: Record<string, number> = {};

      lokasi.wilayahKerja.forEach(wk => {
        const alat = wk.alatKalibrasi;
        if (!alat) return;
        const unit = typeof wk.unit === "number" ? wk.unit : 0;
        alatMap[alat.nama_alat] = (alatMap[alat.nama_alat] || 0) + unit;
      });

      const alat = Object.entries(alatMap).map(([nama_alat, unit]) => ({
        nama_alat, 
        unit,      
      }));

      const baseData = {
        id: lokasi.id,
        nama: lokasi.name,
        alamat: lokasi.Lokasi,
        telp: "-",
        jamBuka: "-",
        alat,
      };

      switch (lokasi.SK) {
        case "TSK-005": 
          puskesmas.push(baseData);
          break;

        case "TSK-004":
          rsPemerintah.push({ ...baseData, jenisPelayanan: "-" });
          break;

        case "TSK-006": 
          rsSwasta.push({ ...baseData, jenisPelayanan: "-" });
          break;

        case "TSK-002": 
          rsTentara.push({ ...baseData, jenisPelayanan: "-" });
          break;

        case "TSK-003": 
          klinik.push(baseData);
          break;

        case "TSK-001": 
        default:
                break;
      }
    });

    return NextResponse.json({
      nama_wilayah: wilayah.nama_wilayah,
      puskesmas,
      rsPemerintah,
      rsSwasta,
      rsTentara,
      klinik,
    });
  } catch (error) {
    console.error("Error GET wilayah detail:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
