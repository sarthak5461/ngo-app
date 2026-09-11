import { NextResponse } from "next/server";

import { getBlog, updateBlog, deleteBlog } from "@/lib/services";
import { requireAdmin } from "@/lib/auth/auth";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";

export async function GET(request, { params }) {
  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_VIEW);

  if (forbidden) {
    return forbidden;
  }

  const blog = await getBlog(params.id);

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request, { params }) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_EDIT);

    if (forbidden) {
      return forbidden;
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const update = {
      pageHeader: {
        slug:
          typeof body.pageHeader?.slug === "string"
            ? body.pageHeader.slug.trim()
            : "",

        seoTitle:
          typeof body.pageHeader?.seoTitle === "string"
            ? body.pageHeader.seoTitle.trim()
            : "",

        seoDescription:
          typeof body.pageHeader?.seoDescription === "string"
            ? body.pageHeader.seoDescription.trim()
            : "",
      },

      hero: {
        title:
          typeof body.hero?.title === "string" ? body.hero.title.trim() : "",

        excerpt:
          typeof body.hero?.excerpt === "string"
            ? body.hero.excerpt.trim()
            : "",

        coverImage:
          typeof body.hero?.coverImage === "string"
            ? body.hero.coverImage.trim()
            : "",

        category:
          typeof body.hero?.category === "string"
            ? body.hero.category.trim()
            : "",
      },

      content: typeof body.content === "string" ? body.content : "",

      status: typeof body.status === "string" ? body.status : "draft",

      publishedAt: body.publishedAt || null,

      featured: Boolean(body.featured),

      popular: Boolean(body.popular),

      updatedAt: new Date(),
    };

    const allowedStatuses = ["draft", "published", "scheduled"];

    if (!allowedStatuses.includes(update.status)) {
      return NextResponse.json(
        { error: "Invalid blog status" },
        { status: 400 },
      );
    }

    await updateBlog(params.id, update);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("ADMIN BLOG UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update blog",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_EDIT);

  if (forbidden) {
    return forbidden;
  }

  await deleteBlog(params.id);

  const user = auth.user;

  return NextResponse.json({
    ok: true,
  });
}
