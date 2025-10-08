import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { nomor: string } }
) {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }

  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const nomor = decodeURIComponent(params.nomor); 

    if (!nomor || typeof nomor !== "string") {
      return NextResponse.json(
        { error: "Nomor surat tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.suratTugas.findUnique({
      where: { nomor_surat: nomor.trim() },
    });

    if (!existing) {
      return NextResponse.json(
        { error: `Surat dengan nomor ${nomor} tidak ditemukan.` },
        { status: 404 }
      );
    }

    await prisma.suratTugas.delete({
      where: { nomor_surat: nomor.trim() },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("❌ Gagal menghapus surat:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus surat.",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}
