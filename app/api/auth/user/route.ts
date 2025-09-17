export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const runtime = "nodejs";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/token=([^;]+)/);
    const token = match?.[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let decoded: JwtPayload & { id: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload & { id: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { customId: decoded.id },
      select: {
        customId: true,
        username: true,
        email: true,
        role: true,
        karyawan: {
          select: {
            name: true,
            position: true,
            department: true,
            image: true,
            status:true,
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
      id: user.customId,
      username: user.username,
      email: user.email,
      role: user.role,
      karyawan: {
        name: user.karyawan?.name || '',
        position: user.karyawan?.position || '',
        department: user.karyawan?.department || '',
        image: user.karyawan?.image || '',
        status: user.karyawan?.status,
      },
    });
  } catch (error: unknown) {
    console.error('🔴 USER ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
