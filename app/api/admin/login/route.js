import { NextResponse } from "next/server";

import {
  checkAdminPassword,
  createSessionToken,
  buildSetCookieHeader,
} from "@/lib/auth/session";

import { ROLES } from "@/lib/auth/rbac";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!checkAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createSessionToken({
      role: ROLES.SUPER_ADMIN,
      name: "Super Admin",
    });

    const response = NextResponse.json({
      ok: true,
      role: ROLES.SUPER_ADMIN,
      name: "Super Admin",
    });

    response.headers.set("Set-Cookie", buildSetCookieHeader(token));

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
