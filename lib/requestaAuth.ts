
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs"; 

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

export interface AuthPayload {
  id: string;
  role?: string;
  [key: string]: any;
}

export function requireAuth(req: NextRequest): AuthPayload | NextResponse {
  try {
    const cookieToken: string | undefined = req.cookies.get("token")?.value ?? undefined;

    const authHeader = req.headers.get("authorization") || "";
    const token: string | undefined = cookieToken ?? (authHeader.replace("Bearer ", "") || undefined);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET!) as unknown as AuthPayload;

    return payload;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
