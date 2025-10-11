import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";

interface Params {
  params: { nomorSurat: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { nomorSurat } = params;
    const body = await req.json();
    const { status } = body;

    if (!nomorSurat || !status) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const surat = await prisma.suratKeluarAlat.update({
      where: { nomor_surat: nomorSurat },
      data: { statusManajer: status as ApprovalStatus },
    });

    return NextResponse.json({ success: true, data: surat });
  } catch (err) {
    console.error("Error update surat alat:", err);
    return NextResponse.json(
      { success: false, message: "Gagal update surat alat" },
      { status: 500 }
    );
  }
}
