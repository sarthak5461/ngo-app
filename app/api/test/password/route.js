import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function GET() {
  const hash = await hashPassword("Admin@123");

  const valid = await verifyPassword("Admin@123", hash);

  return NextResponse.json({
    hash,
    valid,
  });
}
