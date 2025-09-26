import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');

  try {
    const { username, password } = await request.json();
    if (!username || !password)
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
      select: {
        customId: true,
        username: true,
        email: true,
        role: true,
        passwordHash: true,
        karyawan: { select: { status: true, name: true, position: true, department: true, image: true } },
      },
    });

    if (!user) {
      await bcrypt.compare(password, '$2a$10$fakehashforprotection');
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    if (user.karyawan?.status !== 'AKTIF') return NextResponse.json({ error: 'Akun tidak aktif' }, { status: 403 });

    const token = jwt.sign({ id: user.customId, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    const res = NextResponse.json({
      success: true,
      data: {
        id: user.customId,
        username: user.username,
        email: user.email,
        role: user.role,
        karyawan: {
          name: user.karyawan?.name || '',
          position: user.karyawan?.position || '',
          department: user.karyawan?.department || '',
          image: user.karyawan?.image || '',
        },
      },
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect()
  }
}