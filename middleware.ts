import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { menuItems, MenuItem } from "@/lib/menu-items";

const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_PATHS = ["/", "/api/auth/login", "/favicon.ico"];
const SYSTEM_PATHS = ["/not-found", "/maintenance", "/unauthorized"];

function flattenMenu(items: MenuItem[]): { href: string; allowedRoles: string[]; available: boolean }[] {
  return items.flatMap((item) => {
    const result = [];
    

    if (!item.items || item.items.length === 0) {
      result.push({ 
        href: item.href, 
        allowedRoles: item.allowedRoles, 
        available: item.available ?? true 
      });
    } else {
      result.push({ 
        href: item.href, 
        allowedRoles: item.allowedRoles, 
        available: item.available ?? true 
      });
    }
    
    if (item.items) {
      result.push(...flattenMenu(item.items));
    }
    
    return result;
  });
}

const flattenedMenu = flattenMenu(menuItems);

export function middleware(request: NextRequest) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path)) || 
      SYSTEM_PATHS.includes(pathname)) {
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

    if (!isApi) {
      const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
        ? pathname.slice(0, -1) 
        : pathname;
      
      const matchedMenu = flattenedMenu.find((m) => {
        const normalizedHref = m.href.endsWith('/') && m.href !== '/' 
          ? m.href.slice(0, -1) 
          : m.href;
        if (normalizedPath === normalizedHref) return true;
        if (normalizedPath.startsWith(normalizedHref + "/")) return true;
        
        return false;
      });
      
      console.log('=== MIDDLEWARE DEBUG ===');
      console.log('Pathname:', pathname);
      console.log('Normalized:', normalizedPath);
      console.log('Matched menu:', matchedMenu);
      console.log('All menu items:', flattenedMenu);
      
      if (!matchedMenu) {
        console.log('→ Redirecting to NOT-FOUND');
        return NextResponse.rewrite(new URL("/not-found"));
      }

      if (matchedMenu.available === false) {
        console.log('→ Redirecting to MAINTENANCE');
        return NextResponse.rewrite(new URL("/maintenance"));
      }
      
      if (matchedMenu.allowedRoles.length > 0 && 
          !matchedMenu.allowedRoles.includes(payload.role || "")) {
        console.log('→ Redirecting to UNAUTHORIZED');
        return NextResponse.rewrite(new URL("/unauthorized"));
      }
      
      console.log('→ Access GRANTED');
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT Error:', error);
    if (isApi) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
  runtime: "nodejs",
};