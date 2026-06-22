import { NextResponse } from "next/server";
import { listBlogs } from "@/lib/services";

export async function GET() {
  try {
    const blogs = await listBlogs({
      status: "published",
      limit: 3,
    });

    return NextResponse.json({
      rows: blogs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
      },
      {
        status: 500,
      },
    );
  }
}
