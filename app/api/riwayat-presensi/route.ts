import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const tanggalAwal = searchParams.get("tanggalAwal");
    const tanggalAkhir = searchParams.get("tanggalAkhir");
    const metode = searchParams.get("metode");
    const pegawai = searchParams.get("pegawai");
    const status = searchParams.get("status");

    const where: any = {};

    // Filter tanggal
    if (tanggalAwal && tanggalAkhir) {
      where.date = {
        gte: new Date(tanggalAwal),
        lte: new Date(tanggalAkhir),
      };
    } else if (tanggalAwal) {
      where.date = { gte: new Date(tanggalAwal) };
    } else if (tanggalAkhir) {
      where.date = { lte: new Date(tanggalAkhir) };
    }

    if (metode === "barcode") {
      where.OR = [{ barcodeIn: { not: null } }, { barcodeOut: { not: null } }];
    } else if (metode === "lokasi") {
      where.AND = [{ latitude: { not: null } }, { longitude: { not: null } }];
    } else if (metode === "manual") {
      where.barcodeIn = null;
      where.latitude = null;
    }

    if (status) {
      const upperStatus = status.toUpperCase();
      if (upperStatus === "TIDAK_HADIR") {
        where.AND = [
          { statusMasuk: null },
          { statusPulang: null },
          { keterangan: { in: ["IZIN", "SAKIT", "ALPHA"] } },
        ];
      } else {
        where.OR = [
          { statusMasuk: upperStatus },
          { statusPulang: upperStatus },
        ];
      }
    }

    if (pegawai) {
      where.user = {
        karyawan: {
          name: { contains: pegawai, mode: "insensitive" },
        },
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
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
      barcodeIn: a.barcodeIn ?? null,
      barcodeOut: a.barcodeOut ?? null,
      location: a.kantor?.nama ?? a.lokasiDinas?.name ?? "-",
      karyawan: {
        id: a.user.karyawan?.id ?? "-",
        name: a.user.karyawan?.name ?? "-",
        department: a.user.karyawan?.department ?? "-",
        position: a.user.karyawan?.position ?? "-",
      },
      keterangan: a.keterangan ?? null, // optional: biar frontend bisa tampil keterangan
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
