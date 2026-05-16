import { NextResponse } from "next/server";

import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";

function getSessionFromHeaders(request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  const token = match.split("=").slice(1).join("=");

  return verifySessionToken(token);
}

export async function GET(request) {
  try {
    const session = getSessionFromHeaders(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    return NextResponse.json({
      role: session.role,
      name: session.name,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 },
    );
  }
}
