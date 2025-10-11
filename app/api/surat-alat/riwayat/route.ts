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
        barangList: {
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
      id: s.id,
      nomorSurat: s.nomor_surat,
      tanggal: s.tanggal,
      keperluan: s.keperluan,
      statusManajer: s.statusManajer,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      pembuat: s.pembuat?.username || "-",
      barangList:
        s.barangList?.map((item) => ({
          id: item.id,
          kodeUnit: item.unit?.kode_unit || "-",
          nomorSeri: item.unit?.nomor_seri || "-",
          kondisiUnit: item.unit?.kondisi || "-",
          statusUnit: item.unit?.status || "-",
          accessories: item.accessories || "-",
          kondisiKabel: item.kondisiKabel || "BELUM_DICEK",
          kondisiTombol: item.kondisiTombol || "BELUM_DICEK",
          kondisiFungsi: item.kondisiFungsi || "BELUM_DICEK",
          kondisiFisik: item.kondisiFisik || "BELUM_DICEK",
          alatKalibrator: item.unit?.AlatKalibrator
            ? {
                id: item.unit.AlatKalibrator.id,
                namaAlat: item.unit.AlatKalibrator.nama_alat,
                merk: item.unit.AlatKalibrator.merk || "-",
                type: item.unit.AlatKalibrator.type || "-",
                fungsiKalibrasi:
                  item.unit.AlatKalibrator.fungsi_kalibrasi || "-",
              }
            : null,
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
