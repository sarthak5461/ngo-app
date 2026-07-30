import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getDb, COLLECTIONS } from "@/lib/db";

import { requireAdmin } from "@/lib/auth/auth";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_VIEW);

    if (forbidden) {
      return forbidden;
    }

    const user = auth.user;

    const db = await getDb();

    const rows = await db
      .collection(COLLECTIONS.programs)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      rows: rows.map((r) => ({
        ...r,
        _id: r._id.toString(),
      })),
    });
  } catch (error) {
    console.error("ADMIN PROGRAMS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.CONTENT_VIEW);

    if (forbidden) {
      return forbidden;
    }
    const session = getSessionFromHeaders(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();

    const db = await getDb();

    const doc = {
      id: uuidv4(),

      pageHeader: {
        tagline: body.pageHeader?.tagline || "",
        slug: body.pageHeader?.slug || "",
        seoTitle: body.pageHeader?.seoTitle || "",
        seoDescription: body.pageHeader?.seoDescription || "",
      },

      hero: {
        title: body.hero?.title || "",

        tagline: body.hero?.tagline || "",

        excerpt: body.hero?.excerpt || "",

        coverImage: body.hero?.coverImage || "",

        icon: body.hero?.icon || "GraduationCap",
      },

      statsSection: {
        items: body.statsSection?.items || [],
      },

      aboutSection: {
        content: body.aboutSection?.content || "",
      },

      ourInitiatives: {
        title: body.ourInitiatives?.title || "",
        toptag: body.ourInitiatives?.toptag || "",
        items: body.ourInitiatives?.items || [],
      },

      galleryImages: {
        title: body.galleryImages?.title || "",
        subtcontent: body.galleryImages?.subcontent || "",
        items: body.galleryImages?.items || [],
      },

      supportTiers: {
        title: body.supportTiers?.title || "",
        subtitle: body.supportTiers?.subtitle || "",
        items: body.supportTiers?.items || [],
      },

      howItWorks: {
        title: body.howItWorks?.title || "",
        items: body.howItWorks?.items || [],
      },

      VolunteerSec: {
        title: body.VolunteerSec?.title || "",
        toptag: body.VolunteerSec?.toptag || "",
        content: body.VolunteerSec?.content || "",
        image: body.VolunteerSec?.image || "",
        buttontext: body.VolunteerSec?.buttontext || "",
        buttonlink: body.VolunteerSec?.buttonlink || "",
      },

      content: body.content || "",

      featured: body.featured || false,

      status: body.status || "draft",

      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.programs).insertOne(doc);

    return NextResponse.json({
      success: true,
      program: doc,
    });
  } catch (error) {
    console.error("ADMIN PROGRAMS POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 },
    );
  }
}
