import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { eachDayOfInterval } from 'date-fns'
import { startOfDayWIB, endOfDayWIB, getMonthWIB } from '@/lib/timezone'
import { requireAuth, AuthPayload } from "@/lib/requestaAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!(auth as AuthPayload).id) {
    return auth as NextResponse; 
  }

  const user = auth as AuthPayload;

  if (!["ADMIN", "MANAJER", "OWNER"].includes(user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url)
    const year = Number(searchParams.get("year")) || new Date().getFullYear()
    const month = searchParams.get("month") ? Number(searchParams.get("month")) : null

    let start: Date
    let end: Date

    if (month !== null) {
      start = startOfDayWIB(new Date(year, month - 1, 1))
      end = endOfDayWIB(new Date(year, month - 1, new Date(year, month, 0).getDate()))
    } else {
      start = startOfDayWIB(new Date(year, 0, 1))
      end = endOfDayWIB(new Date(year, 11, 31))
    }

    const attendances = await prisma.attendance.findMany({
      where: { date: { gte: start, lte: end } },
    })

    if (month !== null) {
      const days = eachDayOfInterval({ start, end })
      const stats: Record<number, { hadir: number; terlambat: number; tidakHadir: number }> = {}
      days.forEach((d, idx) => (stats[idx + 1] = { hadir: 0, terlambat: 0, tidakHadir: 0 }))

      attendances.forEach(a => {
        const dateWIB = new Date(a.date)
        const day = dateWIB.getDate() 
        if (!stats[day]) return
        if (a.statusMasuk === 'TEPAT_WAKTU') stats[day].hadir++
        else if (a.statusMasuk === 'TERLAMBAT') stats[day].terlambat++
        else if (a.statusMasuk === 'TIDAK_HADIR') stats[day].tidakHadir++
      })

      const data = Object.keys(stats).map(k => ({
        name: k,
        ...stats[Number(k)],
      }))

      return NextResponse.json(data)
    }

    const stats: Record<number, { hadir: number; terlambat: number; tidakHadir: number }> = {}
    for (let m = 0; m < 12; m++) stats[m] = { hadir: 0, terlambat: 0, tidakHadir: 0 }

    attendances.forEach(a => {
      const monthIdx = getMonthWIB(new Date(a.date))
      if (a.statusMasuk === 'TEPAT_WAKTU') stats[monthIdx].hadir++
      else if (a.statusMasuk === 'TERLAMBAT') stats[monthIdx].terlambat++
      else if (a.statusMasuk === 'TIDAK_HADIR') stats[monthIdx].tidakHadir++
    })

    const data = Object.keys(stats).map(k => ({
      name: new Date(0, Number(k)).toLocaleString("id", { month: "short" }),
      ...stats[Number(k)],
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
