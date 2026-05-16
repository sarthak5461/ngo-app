import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

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

    const db = await getDb();

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");

    const filter = status && status !== "all" ? { paymentStatus: status } : {};

    const rows = await db
      .collection(COLLECTIONS.members)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      rows: rows.map((r) => ({
        ...r,
        _id: r._id.toString(),
      })),
    });
  } catch (error) {
    console.error("ADMIN MEMBERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}
