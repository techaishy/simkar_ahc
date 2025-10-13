import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // 🔐 Cek autentikasi JWT
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }

  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const suratList = await prisma.suratKeluarAlat.findMany({
      select: {
        id: true,
        nomor_surat: true,
        tanggal: true,
        keperluan: true,
        statusManajer: true,
        createdAt: true,
        updatedAt: true,
        pembuat: {
          select: {
            customId: true,
            username: true,
          },
        },
        daftarAlat: {
          select: {
            id: true,
            accessories: true,
            kondisiKabel: true,
            kondisiTombol: true,
            kondisiFungsi: true,
            kondisiFisik: true,
            unit: {
              select: {
                kode_unit: true,
                kondisi: true,
                status: true,
                nomor_seri: true,
                AlatKalibrator: {
                  select: {
                    id: true,
                    nama_alat: true,
                    merk: true,
                    type: true,
                    fungsi_kalibrasi: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const formattedData = suratList.map((s) => ({
      nomorSurat: s.nomor_surat,
      tanggal: s.tanggal,
      keperluan: s.keperluan,
      statusManajer: s.statusManajer,
      createdAt: s.createdAt,
      pembuatId: s.pembuat?.customId || "",
      daftarAlat: s.daftarAlat?.map((item) => ({
        nomorSurat: s.nomor_surat,
        nama: item.unit?.AlatKalibrator?.nama_alat || "-",
        merk: item.unit?.AlatKalibrator?.merk || "-",
        type: item.unit?.AlatKalibrator?.type || "-",
        noSeri: item.unit?.nomor_seri || "-",
        kodeUnit: item.unit?.kode_unit || "-",
        kondisi: {
          accessories: item.accessories || "-",
          kabel: item.kondisiKabel || "BELUM_DICEK",
          tombol: item.kondisiTombol || "BELUM_DICEK",
          fungsi: item.kondisiFungsi || "BELUM_DICEK",
          fisik: item.kondisiFisik || "BELUM_DICEK",
        },
      })) || [],
    }));


    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error GET /api/surat-alat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data surat keluar alat." },
      { status: 500 }
    );
  }
}
