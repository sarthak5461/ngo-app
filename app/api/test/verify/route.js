import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function GET() {
  const password = "Admin@123";

  const hash = await hashPassword(password);

  const valid = await verifyPassword(password, hash);

  return NextResponse.json({
    password,
    hash,
    valid,
  });
}
