import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const alatKalibrators = await prisma.alatKalibrator.findMany({
        include:{
            kalibrasi:true,
            aksesoris:true,
            units:true,
        },
        orderBy:{created_at:"desc"},    
    })
  const data = alatKalibrators.map(a => ({
    id: a.id,
      kode_barcode: a.kode_barcode ?? "-",
      nama_alat: a.nama_alat,
      jumlah: a.jumlah ?? 0,
      tahun_pembelian: a.tahun_pembelian ?? "-",
      merk: a.merk ?? "-",
      type: a.type ?? "-",
      fungsi_kalibrasi: a.fungsi_kalibrasi ?? "-",
      status_vendor: a.status_vendor ?? "-",
      kalibrasi_terakhir: a.kalibrasi_terakhir,
      created_at: a.created_at,
      updated_at: a.updated_at,
      totalKalibrasi: a.kalibrasi.length,
      totalAksesoris: a.aksesoris.length,
      totalUnit: a.units.length,
  }))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching today'salat kalibrator:", error)
    return NextResponse.json({ error: "Failed to fetch alat kalibrator" }, { status: 500 })
  }
}
