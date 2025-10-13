import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomorSurat, keperluan, pembuatId, daftarAlat } = body;

    if (!nomorSurat || !pembuatId) {
      return NextResponse.json(
        { error: "Nomor surat dan pembuat surat wajib diisi." },
        { status: 400 }
      );
    }

    if (!Array.isArray(daftarAlat) || daftarAlat.length === 0) {
      return NextResponse.json(
        { error: "Minimal satu alat harus ditambahkan." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Buat surat
      const surat = await tx.suratKeluarAlat.create({
        data: {
          nomor_surat: nomorSurat,
          tanggal: new Date(),
          keperluan: keperluan || "-",
          statusManajer: "PENDING",
          pembuat: {
            connect: { customId: pembuatId },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      for (const item of daftarAlat) {
        await tx.suratKeluarAlatItem.create({
          data: {
            nomor_surat: nomorSurat,
            unitId: item.kodeUnit,
            accessories: item.kondisi?.accessories || "BELUM_DICEK",
            kondisiKabel: item.kondisi?.kabel || "BELUM_DICEK",
            kondisiTombol: item.kondisi?.tombol || "BELUM_DICEK",
            kondisiFungsi: item.kondisi?.fungsi || "BELUM_DICEK",
            kondisiFisik: item.kondisi?.fisik || "BELUM_DICEK",
          },
        });

        await tx.alatKalibratorUnit.update({
          where: { kode_unit: item.kodeUnit },
          data: { status: "DIGUNAKAN" },
        });
       
      }

      return surat;
    });

    return NextResponse.json(
      { message: "✅ Surat keluar alat berhasil dibuat.", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Gagal membuat surat keluar alat:", error);
    return NextResponse.json(
      { error: "Gagal membuat surat keluar alat", detail: error.message },
      { status: 500 }
    );
  }
}
