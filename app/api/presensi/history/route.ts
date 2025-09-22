import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AttendanceMasuk, AttendancePulang } from "@/lib/types/user";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic"; 

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_super_aman";

export async function GET(req: Request) {
  try {
    const { searchParams } = (req as any).nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 6;

    // Ambil token dari cookie
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;
    const attendances = await prisma.attendance.findMany({
      where: { userId },
      include: {
        lokasiDinas: true,
        kantor: true,
      },
      orderBy: { date: "desc" },
    });

    const history: any[] = [];
    attendances.forEach((att) => {
      if (att.clockIn) {
        history.push({
          id: att.id_at + "_in",
          tanggal: att.date.toISOString().split("T")[0],
          waktu: att.clockIn,
          tipe: "masuk",
          status: convertStatusMasuk(att.statusMasuk),
          metode: att.photoIn ? "selfie" : att.barcodeIn ? "barcode" : "manual",
          lokasi: att.lokasiDinas?.name || att.kantor?.nama || "-",
          location: att.location || "-",
          imageUrl: att.photoIn || null,
        });
      }
      if (att.clockOut) {
        history.push({
          id: att.id_at + "_out",
          tanggal: att.date.toISOString().split("T")[0],
          waktu: att.clockOut,
          tipe: "pulang",
          status: convertStatusPulang(att.statusPulang),
          metode: att.photoOut ? "selfie" : att.barcodeOut ? "barcode" : "manual",
          lokasi: att.lokasiDinas?.name || att.kantor?.nama || "-",
          location: att.location || "-",
          imageUrl: att.photoIn || null,
        });
      }
    });

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paged = history.slice(start, end);

    return NextResponse.json({
      total: history.length,
      page,
      perPage: limit,
      data: paged,
    });
  } catch (err: any) {
    console.error("History API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function convertStatusMasuk(status: AttendanceMasuk) {
  switch (status) {
    case "TEPAT_WAKTU":
      return "Tepat Waktu";
    case "TERLAMBAT":
      return "Terlambat";
    case "TIDAK_HADIR":
      return "Tidak Hadir";
    default:
      return "-";
  }
}

function convertStatusPulang(status?: AttendancePulang | null) {
  switch (status) {
    case "TEPAT_WAKTU":
      return "Tepat Waktu";
    case "PULANG_CEPAT":
      return "Pulang Cepat";
    case "TIDAK_HADIR":
      return "Tidak Hadir";
    default:
      return "-";
  }
}
