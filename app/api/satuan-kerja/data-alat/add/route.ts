import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { lokasiId, alatList } = body;

    if (!lokasiId || !Array.isArray(alatList) || alatList.length === 0) {
      return NextResponse.json(
        { error: "lokasiId dan alatList wajib diisi" },
        { status: 400 }
      );
    }

    const lokasi = await prisma.lokasiDinas.findUnique({
      where: { id: lokasiId },
    });
    if (!lokasi) {
      return NextResponse.json(
        { error: "Lokasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const mergedAlat: Record<string, any> = {};
    for (const a of alatList) {
      const key = a.nama_alat?.trim();
      if (!key) continue;

      if (mergedAlat[key]) {
        mergedAlat[key].jumlah += a.jumlah;
        mergedAlat[key].tanggalKalibrasi =
          a.tanggalKalibrasi || mergedAlat[key].tanggalKalibrasi;
        mergedAlat[key].tanggalExpired =
          a.tanggalExpired || mergedAlat[key].tanggalExpired;
      } else {
        mergedAlat[key] = { ...a };
      }
    }

    const finalAlatList = Object.values(mergedAlat);
    const result: any[] = [];

    for (const a of finalAlatList) {
      const { nama_alat, jumlah, tanggalKalibrasi, tanggalExpired } = a;
      const jumlahValid = Number(jumlah) || 0;
      if (!nama_alat || jumlahValid <= 0) continue;

      let alat = await prisma.alatKalibrasi.findFirst({
        where: { nama_alat: { equals: nama_alat, mode: "insensitive" } },
      });

      if (!alat) {
        console.log("🆕 Buat alat baru:", nama_alat);
        alat = await prisma.alatKalibrasi.create({
          data: { nama_alat },
        });
      }

      let wk = await prisma.wilayahKerja.findFirst({
        where: { id_AK: alat.id, id_LK: lokasi.id },
      });

      if (wk) {
        wk = await prisma.wilayahKerja.update({
          where: { id: wk.id },
          data: {
            unit: wk.unit + jumlahValid,
            tanggalKalibrasi,
            tanggal_expired: tanggalExpired,
          },
        });
      } else {
        wk = await prisma.wilayahKerja.create({
          data: {
            id_AK: alat.id,
            id_LK: lokasi.id,
            unit: jumlahValid,
            tanggalKalibrasi,
            tanggal_expired: tanggalExpired,
          },
        });
      }

      result.push({
        nama_alat: alat.nama_alat,
        wilayahKerja: wk,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Data alat berhasil ditambahkan / diperbarui.",
      added: result,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan alat", detail: String(error) },
      { status: 500 }
    );
  }
}
