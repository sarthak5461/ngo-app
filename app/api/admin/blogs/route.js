import { NextResponse } from "next/server";

import { listBlogs, createBlog } from "@/lib/services";

import { nanoid } from "nanoid";

import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

export async function GET(request) {
  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_VIEW);

  if (forbidden) {
    return forbidden;
  }

  const rows = await listBlogs({});

  // console.log("BLOGS:", rows);

  return NextResponse.json({
    rows,
  });
}

export async function POST(request) {
  const auth = await requireAdmin(request);

  if (!auth.success) {
    return auth.response;
  }

  const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_EDIT);

  if (forbidden) {
    return forbidden;
  }

  const id = nanoid();

  const blog = {
    id,

    pageHeader: {
      slug: "",
      seoTitle: "",
      seoDescription: "",
    },

    hero: {
      title: "",
      excerpt: "",
      coverImage: "",
      category: "",
    },

    content: "",

    tags: [],

    featured: false,
    popular: false,

    status: "draft",

    relatedBlogs: [],

    publishedAt: null,

    scheduledFor: null,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await createBlog(blog);

  return NextResponse.json(blog);
}
