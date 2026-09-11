import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.CSR_VIEW);

    if (forbidden) {
      return forbidden;
    }

    const db = await getDb();

    const rows = await db
      .collection(COLLECTIONS.csrInquiries)
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
    console.error("ADMIN CSR GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch CSR Queries",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.CSR_EDIT);

    if (forbidden) {
      return forbidden;
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("ADMIN CSR POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed POST request",
      },
      {
        status: 500,
      },
    );
  }
}
