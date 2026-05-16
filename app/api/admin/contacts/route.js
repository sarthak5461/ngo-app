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

    const rows = await db
      .collection(COLLECTIONS.contacts)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      rows: rows.map((r) => ({
        ...r,
        _id: r._id.toString(),
      })),
    });
  } catch (error) {
    console.error("ADMIN CONTACTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
