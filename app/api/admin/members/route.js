import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

import { requireAdmin } from "@/lib/auth/auth";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.MEMBERS_VIEW);

    if (forbidden) {
      return forbidden;
    }

    const user = auth.user;

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
