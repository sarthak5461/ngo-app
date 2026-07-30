import { NextResponse } from "next/server";
import { createAccessToken, verifyAccessToken } from "@/lib/auth/jwt";

export async function GET() {
  const token = createAccessToken({
    _id: "12345",
    email: "admin@trust.org",
    role: "super_admin",
  });

  const decoded = verifyAccessToken(token);

  return NextResponse.json({
    token,
    decoded,
  });
}
