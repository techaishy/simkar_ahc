import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nowWIB, startOfDayWIB, endOfDayWIB, isWeekendWIB } from "@/lib/timezone";
import { AttendanceMasuk } from "@prisma/client";

export async function GET() {
  try {
    const now = nowWIB();
    if (isWeekendWIB(now)) {
      return NextResponse.json({ message: "Hari ini libur (weekend)" });
    }

    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes <= 9 * 60) {
      return NextResponse.json({ message: "Belum waktunya membuat record otomatis" });
    }

    const users = await prisma.user.findMany({
      where: { role: { not: "OWNER" } },
      select: { customId: true, kantorId: true, role: true },
    });

    const createdRecords: any[] = [];

    for (const user of users) {
      const existing = await prisma.attendance.findFirst({
        where: {
          userId: user.customId,
          date: {
            gte: startOfDayWIB(now),
            lte: endOfDayWIB(now),
          },
        },
      });

      if (existing) continue; 

      const created = await prisma.attendance.create({
        data: {
          id_at: crypto.randomUUID(),
          userId: user.customId,
          date: now,
          clockIn: null,
          clockOut: null,
          statusMasuk: AttendanceMasuk.TIDAK_HADIR,
          statusPulang: null,
          photoIn: null,
          photoOut: null,
          latitude: null,
          longitude: null,
          location: null,
          createdAt: now,
          kantorId: user.kantorId,
          lokasiId: null,
        },
      });

      createdRecords.push(created);
    }

    return NextResponse.json({
      message: `Record TIDAK_HADIR dibuat untuk ${createdRecords.length} user`,
      records: createdRecords,
    });
  } catch (error) {
    console.error("❌ Error autoabsent:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
