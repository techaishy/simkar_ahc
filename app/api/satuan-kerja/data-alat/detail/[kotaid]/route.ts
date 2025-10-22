import { NextResponse, NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

interface Params {
  kotaid: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lokasiName = params.kotaid;
  if (!lokasiName) {
    return NextResponse.json(
      { error: "Parameter kotaid wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.alatKalibrasi.findMany({
      select: {
        nama_alat: true,
        wilayahKerja: {
          select: {
            unit: true,
            tanggalKalibrasi: true,
            tanggal_expired: true,
            lokasiDinas: {
              select: { name: true },
            },
          },
        },
      },
    });

  const filtered = data
    .map((alat) => {
      const wk = alat.wilayahKerja.find(
        (wk) => wk.lokasiDinas?.name?.toLowerCase() === lokasiName.toLowerCase()
      );

      if (!wk) return null;

     return {
      nama_alat: alat.nama_alat,
      total_unit: wk.unit || 0,
      lokasi: [lokasiName],
      tanggalKalibrasi: wk.tanggalKalibrasi || "Belum diatur",
      tanggalExpired: wk.tanggal_expired || "Belum diatur",
    };
    })
    .filter(Boolean);

    filtered.sort((a, b) => a!.nama_alat.localeCompare(b!.nama_alat));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("❌ Error fetching alat detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data alat detail" },
      { status: 500 }
    );
  }
}
