import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Alat } from "@/lib/types/alat"

export async function GET() {
  try {
    const alatKalibrators = await prisma.alatKalibrator.findMany({
      select: {
        id: true,
        kode_barcode: true,
        nama_alat: true,
        merk: true,
        type: true,
        jumlah: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" },
    })

    const data: Alat[] = alatKalibrators.map(a => ({
      id: a.id,
      kodeAlat: a.kode_barcode ?? "-",
      kodeUnit: "-", 
      nama: a.nama_alat,
      merek: a.merk ?? "-",
      type: a.type ?? "-",
      jumlah: a.jumlah ?? 0,
      tanggalMasuk: a.created_at.toISOString().split("T")[0],
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching alat kalibrator:", error)
    return NextResponse.json(
      { error: "Failed to fetch alat kalibrator" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_alat, merk, type, jumlah, tanggal_masuk } = body;

    const newAlat = await prisma.alatKalibrator.create({
      data: {
        nama_alat,
        merk,
        type,
        jumlah,
        created_at: new Date(tanggal_masuk), 
      },
    });

    return NextResponse.json(newAlat, { status: 201 });
  } catch (err) {
    console.error("Error creating alat kalibrator:", err);
    return NextResponse.json(
      { error: "Gagal membuat alat kalibrator" },
      { status: 500 }
    );
  }
}
