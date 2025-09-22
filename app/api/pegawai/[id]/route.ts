import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: { id: string } }

export async function GET(req: Request, { params }: Params) {
  try {
    const pegawai = await prisma.karyawan.findUnique({
      where: { customId: params.id },
      include: { user: true },
    })

    if (!pegawai) {
      return NextResponse.json({ error: "Pegawai not found" }, { status: 404 })
    }

    return NextResponse.json(pegawai)
  } catch (error) {
    console.error("Error fetching Pegawai:", error)
    return NextResponse.json({ error: "Failed to fetch Pegawai" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json()

    const updatedPegawai = await prisma.karyawan.update({
      where: { customId: params.id },
      data: {
        nik: body.nik,
        nip: body.nip,
        name: body.name,
        phone: body.phone,
        department: body.department,
        position: body.position,
        jenisKelamin: body.jenisKelamin,
        agama: body.agama,
        status: body.status,
        emailPribadi: body.emailPribadi,
      },
    })

    return NextResponse.json(updatedPegawai)
  } catch (error) {
    console.error("Error updating Pegawai:", error)
    return NextResponse.json({ error: "Failed to update Pegawai" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const pegawai = await prisma.karyawan.findUnique({
      where: { customId: params.id },
      include: { user: true },
    });

    if (!pegawai) {
      return NextResponse.json(
        { error: "Pegawai not found" },
        { status: 404 }
      );
    }
    if (pegawai.user) {
      await prisma.user.delete({
        where: { customId: pegawai.user.customId },
      });
    }
    await prisma.karyawan.delete({
      where: { customId: params.id },
    });

    return NextResponse.json({
      message: `Pegawai ${pegawai.name} dan user terkait berhasil dihapus`,
    });
  } catch (error) {
    console.error("Error deleting Pegawai:", error);
    return NextResponse.json(
      { error: "Failed to delete Pegawai" },
      { status: 500 }
    );
  }
}