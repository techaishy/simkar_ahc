import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
