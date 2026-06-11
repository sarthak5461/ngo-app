import { NextResponse } from "next/server";

import { listBlogs, createBlog } from "@/lib/services";

import { nanoid } from "nanoid";

export async function GET() {
  const rows = await listBlogs({
    status: "published",
  });

  console.log("BLOGS:", rows);

  return NextResponse.json({
    rows,
  });
}

export async function POST() {
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
