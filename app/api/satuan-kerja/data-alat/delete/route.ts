import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { lokasiId, nama_alat } = body;

    if (!lokasiId || !nama_alat) {
      return NextResponse.json(
        { error: "lokasiId dan nama_alat wajib diisi" },
        { status: 400 }
      );
    }
    const lokasi = await prisma.lokasiDinas.findUnique({ where: { id: lokasiId } });
    if (!lokasi) {
      return NextResponse.json({ error: "Lokasi tidak ditemukan" }, { status: 404 });
    }
    const alat = await prisma.alatKalibrasi.findFirst({
      where: { nama_alat: { equals: nama_alat, mode: "insensitive" } },
    });

    if (!alat) {
      return NextResponse.json({ error: "Alat tidak ditemukan" }, { status: 404 });
    }
    const wk = await prisma.wilayahKerja.findFirst({
      where: { id_AK: alat.id, id_LK: lokasi.id },
    });

    if (!wk) {
      return NextResponse.json(
        { error: "WilayahKerja untuk alat ini tidak ditemukan" },
        { status: 404 }
      );
    }
    await prisma.wilayahKerja.delete({
      where: { id: wk.id },
    });

    return NextResponse.json({
      success: true,
      message: `Wilayah kerja untuk alat "${alat.nama_alat}" di lokasi "${lokasi.name}" berhasil dihapus.`,
    });
  } catch (error) {
    console.error("❌ Error delete wilayah kerja:", error);
    return NextResponse.json(
      { error: "Gagal menghapus wilayah kerja", detail: String(error) },
      { status: 500 }
    );
  }
}
