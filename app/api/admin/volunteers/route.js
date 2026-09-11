import { NextResponse } from "next/server";
import { listVolunteers } from "@/lib/services";
import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.VOLUNTEERS_VIEW);

    if (forbidden) {
      return forbidden;
    }

    const { searchParams } = new URL(request.url);

    const rows = await listVolunteers({
      search: searchParams.get("search") || "",
      interest: searchParams.get("interest") || "all",
    });

    return NextResponse.json({
      rows,
    });
  } catch (err) {
    console.error("VOLUNTEERS API:", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      },
    );
  }
}
