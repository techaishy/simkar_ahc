import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AttendanceMasuk, AttendancePulang } from "@prisma/client";
import { nowWIB, startOfDayWIB, endOfDayWIB, isWeekendWIB } from "@/lib/timezone";
import { supabase } from '@/lib/supabase';

function getStatusMasuk(now: Date, hasIzinLokasi: boolean, isSecondClockIn: boolean): AttendanceMasuk {
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (isSecondClockIn) return AttendanceMasuk.TEPAT_WAKTU;
  if (hasIzinLokasi) return AttendanceMasuk.TEPAT_WAKTU;
  if (minutes <= 8 * 60 + 30) return AttendanceMasuk.TEPAT_WAKTU;
  if (minutes <= 9 * 60) return AttendanceMasuk.TERLAMBAT;

  return AttendanceMasuk.TIDAK_HADIR;
}

function getStatusPulang(now: Date): AttendancePulang {
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes < 17 * 60) return AttendancePulang.PULANG_CEPAT; 
  if (minutes <= 17 * 60 + 30) return AttendancePulang.TEPAT_WAKTU; 
  return AttendancePulang.TEPAT_WAKTU; 
}

async function uploadPhotoToSupabase(photoBase64: string, tipe: 'in' | 'out', userId: string) {
  const fileName = `${userId}_${tipe}_${Date.now()}.jpg`;
  const buffer = Buffer.from(photoBase64.split(',')[1], 'base64');

  const { error } = await supabase.storage
    .from('simkar')
    .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from('simkar').getPublicUrl(fileName);
  return publicUrl.publicUrl;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // console.log("📩 Data diterima di API /attendance:", data);

    const { userId, clockIn, clockOut, photoIn, photoOut, latitude, longitude, location, lokasiId } = data;

    if (!userId) {
      return NextResponse.json({ error: "userId wajib diisi" }, { status: 400 });
    }

    const now = nowWIB();
    if (isWeekendWIB(now)) {
      return NextResponse.json({ error: "Hari ini libur (weekend), tidak bisa presensi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { customId: userId },
      select: { kantorId: true },
    });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    // 🔹 validasi lokasi
    let validLokasiId: string | null = null;
    let validKantorId: string | null = null;

    if (lokasiId) {
      const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: {
          userId,
          tanggalMulai: { lte: now },
          tanggalSelesai: { gte: now },
          OR: [{ lokasiId }, { kantorId: lokasiId }],
        },
      });

      if (izinLokasi?.lokasiId) validLokasiId = izinLokasi.lokasiId;
      else if (izinLokasi?.kantorId) validKantorId = izinLokasi.kantorId;
      else if (lokasiId === user?.kantorId) validKantorId = lokasiId;
      else return NextResponse.json({ error: "Lokasi presensi tidak valid" }, { status: 400 });
    } else {
      const izinLokasi = await prisma.absensiIzinLokasi.findFirst({
        where: { userId, tanggalMulai: { lte: now }, tanggalSelesai: { gte: now } },
      });

      if (izinLokasi?.lokasiId) validLokasiId = izinLokasi.lokasiId;
      else if (user?.kantorId) validKantorId = user.kantorId;
    }

    // 🔹 cari absen hari ini
    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: { gte: startOfDayWIB(now), lte: endOfDayWIB(now) },
        ...(validLokasiId ? { lokasiId: validLokasiId } : {}),
        ...(validKantorId ? { kantorId: validKantorId } : {}),
      },
    });

    // 🔹 validasi kondisi
    if (clockIn && existing?.clockIn) {
      return NextResponse.json({ error: "Anda sudah presensi masuk hari ini" }, { status: 400 });
    }
    if (clockOut) {
      if (!existing?.clockIn) {
        return NextResponse.json({ error: "Anda belum presensi masuk" }, { status: 400 });
      }
      if (existing?.clockOut) {
        return NextResponse.json({ error: "Anda sudah presensi pulang hari ini" }, { status: 400 });
      }
    }

    // 🔹 update jika sudah ada absen
    if (existing) {
      const updateData: any = {};

      if (clockIn) {
        updateData.clockIn = clockIn;
        updateData.statusMasuk = getStatusMasuk(now, !!existing.lokasiId, !!existing.clockIn);
        if (photoIn) {
          updateData.photoIn = await uploadPhotoToSupabase(photoIn, 'in', userId);
        }
      }

      if (clockOut) {
        updateData.clockOut = clockOut;
        updateData.statusPulang = getStatusPulang(now);

        if (photoOut) {
          updateData.photoOut = await uploadPhotoToSupabase(photoOut, 'out', userId);
        }
      }

      if (latitude) updateData.latitude = latitude;
      if (longitude) updateData.longitude = longitude;
      if (location) updateData.location = location;

      const updated = await prisma.attendance.update({
        where: { id_at: existing.id_at },
        data: updateData,
      });

      return NextResponse.json(updated);
    }

    const created = await prisma.attendance.create({
      data: {
        id_at: crypto.randomUUID(),
        userId,
        date: now,
        clockIn: clockIn ?? now.toISOString(),
        clockOut: null,
        statusMasuk: getStatusMasuk(now, false, false),
        statusPulang: null,
        photoIn: photoIn ? await uploadPhotoToSupabase(photoIn, 'in', userId) : null,
        photoOut: null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        location: location ?? null,
        createdAt: now,
        kantorId: validKantorId,
        lokasiId: validLokasiId,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("❌ Error attendance:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
