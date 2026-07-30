import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Allow login page
  if (!path.startsWith("/admin") || path.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("mkds_token")?.value;

  // console.log("COOKIE:", token);

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyAccessToken(token);
  // console.log("USER:", user);

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
