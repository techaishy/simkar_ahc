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
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    const alatList = await prisma.alatKalibrasi.findMany({
      where: q
        ? { nama_alat: { contains: q, mode: "insensitive" } }
        : undefined, 
      select: {
        id: true,
        nama_alat: true,
      },
      take: 20, 
    });

    return NextResponse.json({ alat: alatList });
  } catch (error) {
    console.error("❌ Error ambil alat:", error);
    return NextResponse.json({ error: 'Gagal mengambil data alat' }, { status: 500 });
  }
}
