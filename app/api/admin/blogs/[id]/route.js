import { NextResponse } from "next/server";

import { getBlog, updateBlog, deleteBlog } from "@/lib/services";
import { requireAdmin } from "@/lib/auth/auth";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";

export async function GET(request, { params }) {
  const blog = await getBlog(params.id);

  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_VIEW);

  if (forbidden) {
    return forbidden;
  }

  const user = auth.user;

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  const body = await request.json();

  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_EDIT);

  if (forbidden) {
    return forbidden;
  }

  const user = auth.user;

  await updateBlog(params.id, {
    ...body,
    updatedAt: new Date(),
  });

  return NextResponse.json({
    ok: true,
  });
}

export async function DELETE(request, { params }) {
  await deleteBlog(params.id);

  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_EDIT);

  if (forbidden) {
    return forbidden;
  }

  const user = auth.user;

  return NextResponse.json({
    ok: true,
  });
}
