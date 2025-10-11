import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";
import { StatusAlat } from '@prisma/client';

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
      where: { 
        jumlah: { not: 0 },
        units: {
          some: { status: StatusAlat.TERSEDIA }, 
        },
      },
      select: { 
        id: true,
        merk: true,
        type: true,
        nama_alat: true,
        units: {   
          where:{ status: StatusAlat.TERSEDIA }, 
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
