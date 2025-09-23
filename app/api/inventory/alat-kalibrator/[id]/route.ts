import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const alat = await prisma.alatKalibrator.findUnique({
      where: { id },
      select: {
        id: true,
        kode_barcode: true,
        nama_alat: true,
        merk: true,
        type: true,
        jumlah: true,
        units: {
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            kode_unit: true,
            nomor_seri: true,
            kondisi: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!alat) {
      return NextResponse.json(
        { error: "Alat kalibrator tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(alat);
  } catch (error) {
    console.error("Error fetching detail alat kalibrator:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data detail alat kalibrator" },
      { status: 500 }
    );
  }
}
