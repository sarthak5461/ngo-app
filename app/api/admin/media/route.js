import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getDb, COLLECTIONS } from "@/lib/db";
import { handleCORS } from "@/lib/cors";

export async function GET() {
  try {
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
    );
  } catch (error) {
    console.error("MEDIA GET ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: error.message || "Failed to load media",
        },
        { status: 500 },
      ),
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return handleCORS(
        NextResponse.json({ error: "No file uploaded" }, { status: 400 }),
      );
    }

    if (!file.type.startsWith("image/")) {
      return handleCORS(
        NextResponse.json(
          { error: "Only image uploads allowed" },
          { status: 400 },
        ),
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
    );
  } catch (error) {
    console.error("MEDIA UPLOAD ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: error.message || "Upload failed",
        },
        { status: 500 },
      ),
    );
  }
}
