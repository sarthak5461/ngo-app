import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getDb, COLLECTIONS } from "@/lib/db";
import { handleCORS } from "@/lib/cors";
import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.MEDIA_VIEW);

    if (forbidden) {
      return forbidden;
    }

    const db = await getDb();

    const rows = await db
      .collection(COLLECTIONS.media)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const normalized = rows.map((item) => ({
      ...item,
      id: item._id.toString(),
    }));

    return handleCORS(
      NextResponse.json({
        rows: normalized,
      }),
      request,
    );
  } catch (error) {
    console.error("MEDIA GET ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: "Failed to load media",
        },
        { status: 500 },
      ),
      request,
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.MEDIA_UPLOAD);

    if (forbidden) {
      return forbidden;
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return handleCORS(
        NextResponse.json({ error: "No file uploaded" }, { status: 400 }),
        request,
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (file.size > MAX_FILE_SIZE) {
      return handleCORS(
        NextResponse.json(
          { error: "File size must be 5 MB or less" },
          { status: 400 },
        ),
        request,
      );
    }

    if (!file.type.startsWith("image/")) {
      return handleCORS(
        NextResponse.json(
          { error: "Only image uploads allowed" },
          { status: 400 },
        ),
        request,
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "mkds-media",
    });

    const mediaDoc = {
      name: file.name,
      url: result.secure_url,
      publicId: result.public_id,
      size: file.size,
      createdAt: new Date(),
    };

    const db = await getDb();

    const inserted = await db.collection(COLLECTIONS.media).insertOne(mediaDoc);

    return handleCORS(
      NextResponse.json({
        success: true,
        id: inserted.insertedId,
        ...mediaDoc,
      }),
      request,
    );
  } catch (error) {
    console.error("MEDIA UPLOAD ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: "Upload failed",
        },
        { status: 500 },
      ),
      request,
    );
  }
}
