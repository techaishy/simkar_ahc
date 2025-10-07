import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nomorSurat,
      wilayah,
      tanggalMulai,
      tanggalSelesai,
      keterangan,
      pembuatSuratId, 
      employees,
      jamBerangkat,
      akomodasi,
      agenda,
      tanggal_berangkat,
      kendaraan,
    } = body;

    if (!nomorSurat || !tanggalMulai || !pembuatSuratId) {
      return NextResponse.json(
        { error: "Nomor surat, tanggal mulai, dan pembuat surat wajib diisi." },
        { status: 400 }
      );
    }

    if (!Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json(
        { error: "Minimal satu anggota harus ditambahkan." },
        { status: 400 }
      );
    }

     const result = await prisma.$transaction(async (tx) => {
      const suratTugas = await tx.suratTugas.create({
        data: {
          nomor_surat: nomorSurat,
          judul_tugas: wilayah,
          jam_berangkat: jamBerangkat,
          akomodasi: akomodasi,
          wilayah: wilayah,
          kendaraan:kendaraan,
          tanggal_berangkat:new Date(tanggalMulai),
          tanggal_mulai: new Date(tanggalMulai),
          tanggal_selesai: tanggalSelesai
            ? new Date(tanggalSelesai)
            : new Date(tanggalMulai),
          keterangan : agenda,
          approval_status_admin: "PENDING",
          approval_status_owner: "PENDING",
          pembuat_surat: {
            connect: { customId: pembuatSuratId },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await tx.suratTugasAnggota.createMany({
        data: employees.map((emp: any) => ({
          nomor_surat: nomorSurat,
          karyawan_id: emp.id_karyawan,
          peran: emp.peran || null,
        })),
        skipDuplicates: true,
      });

      return suratTugas;
    });

    return NextResponse.json(
      { message: "Surat tugas berhasil dibuat.", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Gagal membuat surat tugas:", error);
    return NextResponse.json(
      { error: "Gagal membuat surat tugas", detail: error.message },
      { status: 500 }
    );
  }
}