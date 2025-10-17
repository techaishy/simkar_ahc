export const runtime = "nodejs"; 

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { menuItems, MenuItem } from "@/lib/menu-items";

const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_PATHS = ["/", "/api/auth/login", "/favicon.ico"];

function flattenMenu(items: MenuItem[]): { href: string; allowedRoles: string[] }[] {
  return items.flatMap((item) => [
    { href: item.href, allowedRoles: item.allowedRoles },
    ...(item.items ? flattenMenu(item.items) : []),
  ]);
}

const flattenedMenu = flattenMenu(menuItems);

export function middleware(request: NextRequest) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role?: string };

    if (isApi) {
      const headers = new Headers(request.headers);
      headers.set("x-user-id", payload.id);
      headers.set("x-user-role", payload.role || "");

      return NextResponse.next({
        request: {
          headers,
        },
      });
    }

    return NextResponse.next();
  } catch {
    if (isApi) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};
