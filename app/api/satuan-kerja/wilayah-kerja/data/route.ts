import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) return auth as NextResponse;

  const user = auth as AuthPayload;
  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const wilayahList = await prisma.wilayah.findMany({
      select: {
        id: true,
        nama_wilayah: true,
        lokasiList: {
          select: {
            SK: true,
          },
        },
      },
    });

    const lokasi = wilayahList.map((w) => {
      let jumlahPuskesmas = 0;
      let jumlahRS = 0;
      let jumlahKL = 0;

      w.lokasiList.forEach((lokasi) => {
        switch (lokasi.SK) {
          case "TSK-005":
            jumlahPuskesmas += 1;
            break;
          case "TSK-001":
            break; 
          case "TSK-002":
          case "TSK-003":
            jumlahKL += 1;
          break;
          case "TSK-004":
          case "TSK-006":
            jumlahRS += 1;
            break;
          default:
            break;
        }
      });

      return {
        id: w.id.toString(),
        name: w.nama_wilayah,
        deskripsi: "",       
        jumlahPuskesmas,
        jumlahRS,
        jumlahKL,
        populasi: "0",      
      };
    });

    return NextResponse.json({ lokasi });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
