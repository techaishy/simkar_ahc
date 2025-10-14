import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) return auth as NextResponse;

  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { nama, latitude, longitude } = body;

    // Validasi field wajib
    if (!nama || latitude == null || longitude == null) {
      return NextResponse.json(
        { error: "Nama, Latitude, dan Longitude wajib diisi" },
        { status: 400 }
      );
    }

    // Simpan data wilayah baru
    const newWilayah = await prisma.wilayah.create({
      data: {
        nama_wilayah: nama,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    return NextResponse.json({ success: true, data: newWilayah }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
