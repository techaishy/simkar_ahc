import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApprovalStatus } from "@prisma/client";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { nomorSurat, role, status, approvedBy } = body;

    if (!nomorSurat || !role || !status || !approvedBy) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const prismaStatus = status as ApprovalStatus;

    const updateData =
      role === "OWNER"
        ? {
            approval_status_owner: prismaStatus,
            approved_by_owner_id: approvedBy,
            approved_at_owner: new Date(),
          }
        : {
            approval_status_admin: prismaStatus,
            approved_by_admin_id: approvedBy,
            approved_at_admin: new Date(),
          };

    const surat = await prisma.suratTugas.update({
      where: { nomor_surat: nomorSurat },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: surat });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Gagal update surat" },
      { status: 500 }
    );
  }
}
