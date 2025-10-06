import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const employees = await prisma.karyawan.findMany({
      where: { status: 'AKTIF' },
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
