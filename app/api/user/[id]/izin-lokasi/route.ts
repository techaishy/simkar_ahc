import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nowWIB, startOfDayWIB, endOfDayWIB } from "@/lib/timezone";

  export async function GET(
    req: Request,
    context: { params: { id: string } }  
  ) {
    const { params } = context;           
    try {
      const user = await prisma.user.findUnique({
        where: { customId: params.id },
        include: { kantor: true },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

    const now = nowWIB();
    const startOfDay = startOfDayWIB(now);
    const endOfDay = endOfDayWIB(now);

    const izinLokasi = await prisma.absensiIzinLokasi.findMany({
      where: {
        userId: user.customId,
        tanggalMulai: { lte: now },
        tanggalSelesai: { gte: now },
      },
      include: { lokasi: true, kantor: true },
    });

    const lokasiList: {
      id: string;
      nama: string;
      latitude: number;
      longitude: number;
      radiusMeter: number;
      tipe: "izin_lokasi" | "kantor_tetap";
    }[] = [];

    if (izinLokasi.length > 0) {
      izinLokasi.forEach((izin) => {
        const target = izin.lokasi ?? izin.kantor;
        if (!target) return;

        lokasiList.push({
          id: target.id,
          nama: "nama" in target ? target.nama : target.name,
          latitude: target.latitude,
          longitude: target.longitude,
          radiusMeter: "radiusMeter" in target ? target.radiusMeter : target.radius,
          tipe: izin.lokasi ? "izin_lokasi" : "kantor_tetap",
        });
      });
    } else if (user.kantor) {
      lokasiList.push({
        id: user.kantor.id,
        nama: user.kantor.nama,
        latitude: user.kantor.latitude,
        longitude: user.kantor.longitude,
        radiusMeter: user.kantor.radiusMeter,
        tipe: "kantor_tetap",
      });
    }

    if (lokasiList.length === 0)
      return NextResponse.json({ error: "No active location found" }, { status: 404 });

    const todayAttendance = await prisma.attendance.findMany({
      where: { userId: user.customId, date: { gte: startOfDay, lte: endOfDay } },
    });

    const attendanceByLocation = lokasiList.map((loc) => {
      const att = todayAttendance.find((a) =>
        loc.tipe === "kantor_tetap" ? a.kantorId === loc.id : a.lokasiId === loc.id
      );

      let enableClockIn = !att?.clockIn;
      let enableClockOut = att?.clockIn && !att?.clockOut;

      return {
        ...loc,
        fieldTarget: loc.tipe === "kantor_tetap" ? "kantorId" : "lokasiId",
        clockIn: att?.clockIn ?? null,
        clockOut: att?.clockOut ?? null,
        statusMasuk: att?.statusMasuk ?? null,
        statusPulang: att?.statusPulang ?? null,
        enableClockIn,
        enableClockOut,
      };
    });

    return NextResponse.json({
      lokasi: attendanceByLocation,
      todayAttendance: attendanceByLocation.map((a) => ({
        lokasiId: a.id,
        clockIn: a.clockIn,
        clockOut: a.clockOut,
        statusMasuk: a.statusMasuk,
        statusPulang: a.statusPulang,
      })),
      tipeLokasi:
        lokasiList.every((l) => l.tipe === "kantor_tetap")
          ? "kantor_tetap"
          : lokasiList.every((l) => l.tipe === "izin_lokasi")
          ? "izin_lokasi"
          : "multi_lokasi",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
