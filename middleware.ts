import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman'
const PUBLIC_PATHS = ['/api/auth/login', '/', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // lewati path publik
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string }
    if (pathname.startsWith('/dashboard') && !['ADMIN', 'MANAJER', 'OWNER'].includes(payload.role || '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/protected/:path*'],
}
