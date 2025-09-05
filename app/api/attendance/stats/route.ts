import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMonthWIB } from '@/lib/timezone'
import { eachDayOfInterval } from 'date-fns'

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const year = Number(searchParams.get("year")) || new Date().getFullYear()
    const month = searchParams.get("month") ? Number(searchParams.get("month")) : null

    let start: Date
    let end: Date

    if (month !== null) {
      start = new Date(year, month - 1, 1)
      end = new Date(year, month, 0, 23, 59, 59)
    } else {
      start = new Date(year, 0, 1)
      end = new Date(year, 11, 31, 23, 59, 59)
    }

    const attendances = await prisma.attendance.findMany({
      where: { date: { gte: start, lte: end } },
    })

    // 📊 Kalau ada month → buat statistik per hari
    if (month !== null) {
      const days = eachDayOfInterval({ start, end })
      const stats: Record<number, { hadir: number; terlambat: number; tidakHadir: number }> = {}
      days.forEach((d, idx) => (stats[idx + 1] = { hadir: 0, terlambat: 0, tidakHadir: 0 }))

      attendances.forEach(a => {
        const day = new Date(a.date).getDate()
        if (a.statusMasuk === 'TEPAT_WAKTU') stats[day].hadir++
        else if (a.statusMasuk === 'TERLAMBAT') stats[day].terlambat++
        else if (a.statusMasuk === 'TIDAK_HADIR') stats[day].tidakHadir++
      })

      const data = Object.keys(stats).map(k => ({
        name: k, // tampil angka tanggal
        ...stats[Number(k)],
      }))

      return NextResponse.json(data)
    }

    // 📊 Kalau tanpa month → statistik per bulan
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
