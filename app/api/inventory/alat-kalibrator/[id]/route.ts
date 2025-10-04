import { NextResponse,  NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const alat = await prisma.alatKalibrator.findUnique({
      where: { id },
      select: {
        id: true,
        kode_barcode: true,
        nama_alat: true,
        merk: true,
        type: true,
        jumlah: true,
        units: {
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            kode_unit: true,
            nomor_seri: true,
            kondisi: true,
            created_at: true,
            updated_at: true,
            status:true,
          },
        },
      },
    });

    if (!alat) {
      return NextResponse.json(
        { error: "Alat kalibrator tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(alat);
  } catch (error) {
    console.error("Error fetching detail alat kalibrator:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data detail alat kalibrator" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { units } = body; 

    const alat = await prisma.alatKalibrator.findUnique({ where: { id } });
    if (!alat) {
      return NextResponse.json(
        { error: "Alat kalibrator tidak ditemukan" },
        { status: 404 }
      );
    }

    const newUnits = await prisma.alatKalibratorUnit.createMany({
      data: units.map((u: any) => ({
        kode_unit: u.kode_unit,
        nomor_seri: u.nomor_seri,
        status: u.status || "TERSEDIA",
        kondisi: u.kondisi || "Baik",
        alat_id: id,
      })),
    });

    return NextResponse.json(newUnits);
  } catch (error) {
    console.error("Error adding units:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan unit baru" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.alatKalibratorUnit.deleteMany({
      where: { alat_id: id },
    });

    await prisma.alatKalibrator.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Alat berhasil dihapus" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Gagal hapus alat" }, { status: 500 });
  }
}