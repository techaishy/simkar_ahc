import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.alatKalibrator.findMany({
      orderBy: { created_at: "desc" },
    });

    const formattedData = data.map((a) => ({
      id: a.id,
      kode_barcode: a.kode_barcode || "-",
      nama_alat: a.nama_alat || "-",
      merk: a.merk || "-",
      type: a.type || "-",
      jumlah: a.jumlah ?? 0,
      created_at: a.created_at,
      updated_at: a.updated_at,
    }));

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error("Gagal fetch alat kalibrator:", err);
    return NextResponse.json({ error: "Gagal mengambil data alat kalibrator" }, { status: 500 });
  }
}

// POST create alat baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_alat, merk, type, tanggal_masuk } = body;

    const createdAt = tanggal_masuk ? new Date(tanggal_masuk) : new Date();

    const newAlat = await prisma.alatKalibrator.create({
      data: {
        nama_alat: nama_alat || "-",
        merk: merk || "-",
        type: type || "-",
        jumlah: 0,
        created_at: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(newAlat, { status: 201 });
  } catch (err) {
    console.error("Error creating alat kalibrator:", err);
    return NextResponse.json({ error: "Gagal membuat alat kalibrator" }, { status: 500 });
  }
}