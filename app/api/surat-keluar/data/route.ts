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
    const employees = await prisma.karyawan.findMany({
      where: {
        status: 'AKTIF',       
        user: {
          kantorTetap: true,   
        },
      },
      select: {
        customId: true,
        name: true,
        position: true,
        address: true,
      },
    });

    const formattedEmployees = employees.map(e => ({
      id_karyawan:e.customId,
      nama: e.name,
      jabatan: e.position,
      alamat: e.address,
    }));

    const locations = await prisma.lokasiDinas.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ employees: formattedEmployees, locations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
