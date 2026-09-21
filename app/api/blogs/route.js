import { NextResponse } from "next/server";
import { listBlogs } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const month = searchParams.get("month") || "";
    const year = searchParams.get("year") || "";

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 9, 1),
      50,
    );

    const rows = await listBlogs({
      status: "published",
      search,
      category,
      month,
      year,
      page,
      limit,
    });

    return NextResponse.json({
      rows,
      pagination: {
        page,
        limit,
        hasMore: rows.length === limit,
      },
    });
  } catch (error) {
    console.error("BLOGS API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load blogs" },
      { status: 500 },
    );
  }
}
