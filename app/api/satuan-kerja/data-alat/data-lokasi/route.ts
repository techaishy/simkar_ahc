import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";


export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const wilayah = await prisma.lokasiDinas.findMany({
      where: {
        name: {
          notIn: ["Apotek Aishy", "PT. AISHY AND SONS"],
        },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(wilayah);
  } catch (error) {
    console.error("❌ Error fetching wilayah:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar wilayah" },
      { status: 500 }
    );
  }
}
