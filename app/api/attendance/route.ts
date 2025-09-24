import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; 
import type { Karyawan } from '@/lib/types/karyawan';
import { AttendanceRecord } from '@/lib/types/attendance';
import { startOfDayWIB, endOfDayWIB } from '@/lib/timezone';
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const start = startOfDayWIB(new Date());
  const end = endOfDayWIB(new Date());

  try {
    const karyawanRaw = await prisma.karyawan.findMany({
      where: { position: { not: "Owner" } },
      select: {
        id: true,
        customId: true,
        name: true,
        department: true,
        position: true,
        joinDate: true,
        status: true,
      },
    });

    const karyawan: Karyawan[] = karyawanRaw.map(k => ({
      id: k.id,
      customId: k.customId,
      name: k.name,
      department: k.department,
      position: k.position,
      joinDate: k.joinDate,
      status: k.status,
    }));

    const attendanceRaw = await prisma.attendance.findMany({
      where: { date: { gte: start, lt: end } },
      include: { user: { include: { karyawan: true } } },
      orderBy: { date: 'desc' },
    });

    const attendance: AttendanceRecord[] = attendanceRaw.map(a => ({
      id_at: a.id_at,
      userId: a.userId,
      date: a.date.toISOString(),
      clockIn: a.clockIn ?? null,
      clockOut: a.clockOut ?? null,
      statusMasuk: a.statusMasuk,
      statusPulang: a.statusPulang,
      karyawan: a.user?.karyawan
        ? {
            id: a.user.customId ?? a.user.id,
            customId: a.user.customId ?? a.user.id,
            name: a.user.karyawan.name,
            department: a.user.karyawan.department,
            position: a.user.karyawan.position,
            joinDate: a.user.karyawan.joinDate,
            status: a.user.karyawan.status,
          }
        : null,
      photoIn: a.photoIn ?? '/images/placeholder-user.jpg',
      photoOut: a.photoOut ?? '/images/placeholder-user.jpg',
    }));

    return NextResponse.json({ karyawan, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } 
}