import { NextResponse } from "next/server";

import { getBlog, updateBlog, deleteBlog } from "@/lib/services";

export async function GET(_, { params }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  const body = await request.json();

  await updateBlog(params.id, {
    ...body,
    updatedAt: new Date(),
  });

  return NextResponse.json({
    ok: true,
  });
}

export async function DELETE(_, { params }) {
  await deleteBlog(params.id);

  return NextResponse.json({
    ok: true,
  });
}
