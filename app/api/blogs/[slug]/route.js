import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/services";

export async function GET(_, { params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}
