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
    const { lokasiId, nama_alat, jumlah, tanggalKalibrasi, tanggalExpired } = body;

    if (!lokasiId || !nama_alat || jumlah === undefined) {
      return NextResponse.json(
        { error: "lokasiId, nama_alat, dan jumlah wajib diisi" },
        { status: 400 }
      );
    }
    
    const lokasi = await prisma.lokasiDinas.findUnique({ where: { id: lokasiId } });
    if (!lokasi) return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 404 });

    let alat = await prisma.alatKalibrasi.findFirst({
      where: { nama_alat: { equals: nama_alat, mode: "insensitive" } },
    });
    if (!alat) return NextResponse.json({ error: "Alat tidak ditemukan" }, { status: 404 });

    const wk = await prisma.wilayahKerja.findFirst({
      where: { id_AK: alat.id, id_LK: lokasi.id },
    });
    if (!wk) return NextResponse.json({ error: "Wilayah kerja untuk alat ini tidak ditemukan" }, { status: 404 });

    const updatedWK = await prisma.wilayahKerja.update({
      where: { id: wk.id },
      data: {
        unit: jumlah,
        tanggalKalibrasi,
        tanggal_expired: tanggalExpired,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Alat berhasil diperbarui",
      nama_alat: alat.nama_alat,
      jumlah: updatedWK.unit,
      tanggalKalibrasi: updatedWK.tanggalKalibrasi,
      tanggalExpired: updatedWK.tanggal_expired,
    });
  } catch (error) {
    console.error("❌ Error update alat:", error);
    return NextResponse.json(
      { error: "Gagal update alat", detail: String(error) },
      { status: 500 }
    );
  }
}
