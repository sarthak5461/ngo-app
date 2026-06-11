import { NextResponse } from "next/server";
import { listBlogs } from "@/lib/services";

export async function GET() {
  const rows = await listBlogs({
    status: "published",
  });

  return NextResponse.json({
    rows,
  });
}
