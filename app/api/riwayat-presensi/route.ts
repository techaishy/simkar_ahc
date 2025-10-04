import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = req.nextUrl;

    const tanggalAwal = searchParams.get("tanggalAwal");
    const tanggalAkhir = searchParams.get("tanggalAkhir");
    const metode = searchParams.get("metode");
    const pegawai = searchParams.get("pegawai");
    const status = searchParams.get("status");
    const where: any = {};

    if (tanggalAwal && tanggalAkhir) {
      where.date = {
        gte: new Date(tanggalAwal),
        lte: new Date(new Date(tanggalAkhir).setHours(23, 59, 59, 999)),
      };
    } else if (tanggalAwal) {
      where.date = { gte: new Date(tanggalAwal) };
    } else if (tanggalAkhir) {
      where.date = { lte: new Date(new Date(tanggalAkhir).setHours(23, 59, 59, 999)) };
    }

    if (metode === "barcode") {
      where.OR = [{ barcodeIn: { not: null } }, { barcodeOut: { not: null } }];
    } else if (metode === "selfie") {
      where.AND = [{ latitude: { not: null } }, { longitude: { not: null } }];
    } else if (metode === "manual") {
      where.barcodeIn = null;
      where.latitude = null;
    }

    if (status) {
      const upperStatus = status.toUpperCase();
      if (["IZIN", "SAKIT", "ALPHA"].includes(upperStatus)) {
        where.keterangan = upperStatus;
      } else if (upperStatus === "HADIR") {
        where.statusMasuk = { in: ["TERLAMBAT", "TEPAT_WAKTU"] };
      } else if (upperStatus === "TERLAMBAT" || upperStatus === "TEPAT_WAKTU") {
        where.statusMasuk = upperStatus;
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
        user: { include: { karyawan: true } },
        kantor: true,
        lokasiDinas: true,
      },
      orderBy: { date: "desc" },
    });

    const result = attendances.map((a) => ({
      id_at: a.id_at,
      userId: a.userId,
      date: a.date,
      clockIn: a.clockIn ?? null,
      clockOut: a.clockOut ?? null,
      statusMasuk: a.statusMasuk ?? null,
      statusPulang: a.statusPulang ?? null,
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
      keterangan: a.keterangan ?? null,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal ambil data", data: [] },
      { status: 500 }
    );
  }
}
