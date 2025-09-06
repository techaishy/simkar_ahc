import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        user: {
          include: {
            karyawan: true,
          },
        },
        kantor: true,
        lokasiDinas: true,
      },
      orderBy: { date: "desc" },
    });
    const result = attendances.map((a) => ({
      id_at: a.id_at,
      userId: a.userId,
      date: a.date,
      clockIn: a.clockIn,
      clockOut: a.clockOut,
      statusMasuk: a.statusMasuk,
      statusPulang: a.statusPulang,
      photoIn: a.photoIn ?? null,
      photoOut: a.photoOut ?? null,
      barcodeIn:a.barcodeIn ?? null,
      barcodeOut:a.barcodeOut ?? null,
      location: a.kantor?.nama ?? a.lokasiDinas?.name ?? "-",
      karyawan: {
        id: a.user.karyawan?.id ?? "-",
        name: a.user.karyawan?.name ?? "-",
        department: a.user.karyawan?.department ?? "-",
        position: a.user.karyawan?.position ?? "-",
      },
    }));
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
