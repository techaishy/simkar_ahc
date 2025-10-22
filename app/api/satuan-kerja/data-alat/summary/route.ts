import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const data = await prisma.alatKalibrasi.findMany({
      select: {
        nama_alat: true,
        wilayahKerja: {
          select: {
            unit: true,
            lokasiDinas: {
              select: { name: true },
            },
          },
        },
      },
    });

    const grouped = data.reduce((acc: any[], alat) => {
      const totalUnit = alat.wilayahKerja.reduce(
        (sum, wk) => sum + (wk.unit || 0),
        0
      );

      if (totalUnit === 0) return acc;

      const lokasiList = [
        ...new Set(
          alat.wilayahKerja
            .map((wk) => wk.lokasiDinas?.name)
            .filter(Boolean)
        ),
      ];

      const existing = acc.find((a) => a.nama_alat === alat.nama_alat);
      if (existing) {
        existing.total_unit += totalUnit;
        existing.lokasi = [
          ...new Set([...existing.lokasi, ...lokasiList]),
        ];
      } else {
        acc.push({
          nama_alat: alat.nama_alat,
          total_unit: totalUnit,
          lokasi: lokasiList,
          tanggalKalibrasi: "Pilih satuan kerja",
          tanggalExpired: "Pilih satuan kerja",
        });
      }

      return acc;
    }, []);

    grouped.sort((a, b) => a.nama_alat.localeCompare(b.nama_alat));

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("❌ Error fetching alat summary:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data alat" },
      { status: 500 }
    );
  }
}
