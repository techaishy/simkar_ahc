import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse;
  }
  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const alatList = await prisma.alatKalibrator.findMany({
    select: {
      id: true,
      merk: true,
      type: true,
      nama_alat: true,
      units: {   
        select: {
          nomor_seri: true,
          kode_unit: true,
          kondisi: true,
        }
      }
    }
  });

    return NextResponse.json({ alat: alatList });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data alat' }, { status: 500 });
  }
}
