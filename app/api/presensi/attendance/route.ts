import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      date,
      clockIn,
      clockOut,
      statusMasuk,
      statusPulang,
      photoIn,
      photoOut,
      latitude,
      longitude,
      location,
      lokasiId,
    } = body;

    if (!userId || !date) {
      return NextResponse.json({ error: "userId dan date wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: new Date(date),
        ...(lokasiId ? { lokasiId } : {}),
      },
    });

    if (existing) {
      const updateData: any = {};

      if (clockIn) {
        updateData.clockIn = clockIn;
        if (statusMasuk) updateData.statusMasuk = statusMasuk;
      }

      if (clockOut) {
        updateData.clockOut = clockOut;
        if (statusPulang) updateData.statusPulang = statusPulang;
      }

      if (photoIn) updateData.photoIn = photoIn;
      if (photoOut) updateData.photoOut = photoOut;
      if (latitude) updateData.latitude = latitude;
      if (longitude) updateData.longitude = longitude;
      if (location) updateData.location = location;

      const updated = await prisma.attendance.update({
        where: { id_at: existing.id_at },
        data: updateData,
      });

      return NextResponse.json(updated);
    } else {
      // Jika belum ada, kita buat baru
      const createData: any = {
        id_at: crypto.randomUUID(),
        userId,
        date: new Date(date),
        clockIn: clockIn || null,
        statusMasuk: statusMasuk || undefined,
        clockOut: clockOut || null,
        statusPulang: statusPulang || undefined,
        photoIn: photoIn || null,
        photoOut: photoOut || null,
        latitude: latitude || null,
        longitude: longitude || null,
        location: location || null,
        lokasiId: lokasiId || null,
      };

      const created = await prisma.attendance.create({ data: createData });
      return NextResponse.json(created);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
