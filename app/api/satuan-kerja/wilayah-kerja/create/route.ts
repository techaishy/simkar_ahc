import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      nama,
      alamat,
      kodeSK,
      telp,
      jamBuka,
      latitude,
      longitude,
      radius,
      alat = [],
      wilayahKerja, 
    } = body;

    if (!nama || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return NextResponse.json(
        { error: "Nama, latitude, dan longitude wajib diisi dan valid" },
        { status: 400 }
      );
    }
    const satuanKerja = await prisma.satuanKerja.findUnique({
      where: { kodeSK },
    });

    if (!satuanKerja) {
      console.error(`❌ Tidak ditemukan SatuanKerja dengan kodeSK: ${kodeSK}`);
      return NextResponse.json(
        { error: `Satuan Kerja dengan kode ${kodeSK} tidak ditemukan` },
        { status: 400 }
      );
    }

    const wilayahNama = wilayahKerja
      ?.replace(/kota-|kabupaten-/gi, '') 
      ?.replace(/-/g, ' ') 
      ?.trim();

    const wilayah = await prisma.wilayah.findFirst({
      where: {
        nama_wilayah: {
          contains: wilayahNama,
        },
      },
});

    if (!wilayah) {

      return NextResponse.json(
        { error: `Wilayah '${wilayahKerja}' tidak ditemukan.` },
        { status: 400 }
      );
    }

    const lokasiBaru = await prisma.lokasiDinas.create({
      data: {
        name: nama,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: radius ? parseInt(radius) : 25,
        Lokasi: alamat || "",
        SK: kodeSK || "",
        wilayahId: wilayah.id,
        telp,
        jamBuka, 
      },
    });

    const relasiAlat = await Promise.all(
      alat.map(async (item: { nama_alat: string; unit: number }) => {
        let alatDb = await prisma.alatKalibrasi.findFirst({
          where: { nama_alat: { equals: item.nama_alat, mode: "insensitive" } },
        });

        if (!alatDb) {
          alatDb = await prisma.alatKalibrasi.create({
            data: { nama_alat: item.nama_alat },
          });
        }

        const wilayahKerjaBaru = await prisma.wilayahKerja.create({
          data: {
            unit: item.unit,
            id_LK: lokasiBaru.id,
            id_AK: alatDb.id,
          },
        });

        return {
          alatKalibrasi: alatDb,
          wilayahKerja: wilayahKerjaBaru,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: "Lokasi dan alat berhasil ditambahkan",
        data: {
          lokasi: lokasiBaru,
          alat_terkait: relasiAlat.map((r) => ({
            nama_alat: r.alatKalibrasi.nama_alat,
            unit: r.wilayahKerja.unit,
          })),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error create wilayah kerja:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan data wilayah kerja" },
      { status: 500 }
    );
  }
}
