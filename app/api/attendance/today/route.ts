import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay } from "date-fns"

export async function GET() {
  try { 
    const today = new Date()
    const start = startOfDay(today)
    const end = endOfDay(today)

    const attendances = await prisma.attendance.findMany({
      where: {
        date: { gte: start, lte: end },
      },
      include: {
        user: {
          include: {
            karyawan: true,
          },
        },
      },
    })
   
    const data = attendances.map((a: typeof attendances[number]) => ({
      id: a.id_at,
      name: a.user.karyawan?.name ?? "-",
      department: a.user.karyawan?.department ?? "-",
      position: a.user.karyawan?.position ?? "-",
      clockIn: a.clockIn,
      clockOut: a.clockOut,
      AttendanceMasuk: a.statusMasuk,
      AttendancePulang: a.statusPulang, 
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching today's attendance:", error)
    return NextResponse.json({ error: "Failed to fetch today's attendance" }, { status: 500 })
  }
}
