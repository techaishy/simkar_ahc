import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

export interface AuthPayload {
  id: string;
  role?: string;
}

export function requireAuth(req: NextRequest): AuthPayload | NextResponse {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/token=([^;]+)/);
  const token = match?.[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded && typeof decoded.id === "string") {
      return {
        id: decoded.id,
        role: decoded.role,
      };
    }

    return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
