import { NextResponse } from "next/server";
import { listVolunteers } from "@/lib/services";

export async function GET(request) {
  try {
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
