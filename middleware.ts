export const runtime = "nodejs";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
>>>>>>> 382e4efceb861cfed550617427996362683902f7
=======
>>>>>>> presensi

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { menuItems, MenuItem } from "@/lib/menu-items";

<<<<<<< HEAD
const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_PATHS = ["/", "/api/auth/login", "/favicon.ico"];

function flattenMenu(
  items: MenuItem[]
): { href: string; allowedRoles: string[] }[] {
  return items.flatMap((item) => [
    { href: item.href, allowedRoles: item.allowedRoles },
    ...(item.items ? flattenMenu(item.items) : []),
  ]);
}

const flattenedMenu = flattenMenu(menuItems);

export function middleware(request: NextRequest) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

=======
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value
>>>>>>> 382e4efceb861cfed550617427996362683902f7
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
<<<<<<< HEAD
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    const matchedRoute = flattenedMenu.find((route) =>
      pathname.startsWith(route.href)
    );

    if (matchedRoute && !matchedRoute.allowedRoles.includes(payload.role || "")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
<<<<<<< HEAD
=======
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string }
    if (pathname.startsWith('/admin') && !['ADMIN', 'MANAJER', 'OWNER'].includes(payload.role || '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/', request.url))
>>>>>>> 382e4efceb861cfed550617427996362683902f7
=======
>>>>>>> presensi
  }
}

export const config = {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> presensi
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/protected/:path*",
  ],
};
<<<<<<< HEAD
=======
  matcher: ['/admin/:path*', '/api/protected/:path*'],
}
>>>>>>> 382e4efceb861cfed550617427996362683902f7
=======
>>>>>>> presensi
