import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import type {  KaryawanProfile } from '@/lib/types/user';
import { AttendanceRecord } from '@/lib/types/attendance';

export async function GET() {
  try {
    const karyawanRaw = await prisma.karyawan.findMany({
    where: {
      position: {
      not: "Owner"
      }
    },
    select: {
      id: true,
      customId: true,
      name: true,
      department: true,
      position: true,
      joinDate: true,
      status: true,
    }
  });

    const karyawan: KaryawanProfile[] = karyawanRaw.map((k: typeof karyawanRaw[number]) => ({
      id: k.id,
      customId: k.customId,
      name: k.name,
      department: k.department,
      position: k.position,
      joinDate: k.joinDate,
      status: k.status,
    }));


    // Ambil presensi hari ini
    const today = new Date().toISOString().split('T')[0];
    const attendanceRaw = await prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 24*60*60*1000)
        }
      },
      include: {
        user: {
          include: {
            karyawan: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const attendance: AttendanceRecord[] = attendanceRaw.map(a => ({
      id_at: a.id_at,
      userId: a.userId,
      date: a.date.toISOString(),
      clockIn: a.clockIn ?? null,
      clockOut: a.clockOut ?? null,
      statusMasuk: a.statusMasuk,
      statusPulang:a.statusPulang,
      karyawan: a.user?.karyawan ? {
        id: a.user.customId ?? a.user.id,
        customId: a.user.customId ?? a.user.id,
        name: a.user.karyawan.name,
        department: a.user.karyawan.department,
        position: a.user.karyawan.position,
        joinDate: a.user.karyawan.joinDate,
        status: a.user.karyawan.status,
      } : null,
      photoIn: a.photoIn ?? '/images/placeholder-user.jpg',
      photoOut: a.photoOut ?? '/images/placeholder-user.jpg'
    }));

    return NextResponse.json({ karyawan, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
