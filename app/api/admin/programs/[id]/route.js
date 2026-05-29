import { NextResponse } from "next/server";
import { cleanHTML } from "@/lib/sanitize";
import { getDb, COLLECTIONS } from "@/lib/db";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";

function getSessionFromHeaders(request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  const token = match.split("=").slice(1).join("=");

  return verifySessionToken(token);
}

export async function GET(request, { params }) {
  try {
    const session = getSessionFromHeaders(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const db = await getDb();

    const row = await db.collection(COLLECTIONS.programs).findOne({
      id: params.id,
    });

    if (!row) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({
      row: {
        ...row,
        _id: row._id.toString(),
      },
    });
  } catch (error) {
    console.error("PROGRAM GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = getSessionFromHeaders(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();

    const db = await getDb();

    await db.collection(COLLECTIONS.programs).updateOne(
      {
        id: params.id,
      },
      {
        $set: {
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
            content: cleanHTML(body.aboutSection?.content || ""),
          },

          ourInitiatives: {
            title: body.ourInitiatives?.title || "",
            toptag: body.ourInitiatives?.toptag || "",
            items: body.ourInitiatives?.items || [],
          },

          galleryImages: {
            title: body.galleryImages?.title || "",
            subcontent: body.galleryImages?.subcontent || "",
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

          featured: body.featured || false,

          status: body.status || "draft",

          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PROGRAM UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update program" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const db = await getDb();

    await db.collection(COLLECTIONS.programs).deleteOne({
      id: params.id,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete",
      },
      {
        status: 500,
      },
    );
  }
}
