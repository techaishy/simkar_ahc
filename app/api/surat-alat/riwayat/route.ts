import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }

  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER", "KEUANGAN"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const suratTugas = await prisma.suratTugas.findMany({
      include: {
        anggotaSurat: {
          include: {
            karyawan: true,
          },
        },
        lokasiSurat: {
          include: {
            lokasi: true,
          },
        },
        pembuat_surat: true,
        approved_by_admin: true,
        approved_by_owner: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedData = suratTugas.map((s) => ({
      nomorSurat: s.nomor_surat,
      judul: s.judul_tugas,
      tanggalMulai: s.tanggal_mulai,
      tanggalSelesai: s.tanggal_selesai,
      tanggalBerangkat: s.tanggal_berangkat,
      jamBerangkat: s.jam_berangkat,
      akomodasi: s.akomodasi,
      wilayah: s.wilayah,
      tujuan: s.wilayah, 
      kendaraan:s.kendaraan,
      keterangan: s.keterangan,
      statusOwner: s.approval_status_owner || "Pending",
      statusAdm: s.approval_status_admin || "Pending",
      createdAt: s.created_at,
      pembuat: s.pembuat_surat?.username || "-",
      anggota:
        s.anggotaSurat?.map((a) => ({
          nama: a.karyawan?.name || "-",
          jabatan: a.karyawan?.position || "-",
          alamat: a.karyawan?.address || "-", 
        })) || [],
      lokasi: s.lokasiSurat?.map((l) => l.lokasi?.Lokasi || "-") || [],
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error GET /surat-tugas:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data riwayat surat tugas." },
      { status: 500 }
    );
  }
}
