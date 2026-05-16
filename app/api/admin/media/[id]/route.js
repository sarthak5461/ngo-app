import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import cloudinary from "@/lib/cloudinary";
import { getDb, COLLECTIONS } from "@/lib/db";
import { handleCORS } from "@/lib/cors";

export async function DELETE(request, { params }) {
  try {
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return handleCORS(
        NextResponse.json({ error: "Invalid media ID" }, { status: 400 }),
      );
    }

    const db = await getDb();

    const media = await db.collection(COLLECTIONS.media).findOne({
      _id: new ObjectId(id),
    });

    if (!media) {
      return handleCORS(
        NextResponse.json({ error: "Media not found" }, { status: 404 }),
      );
    }

    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    await db.collection(COLLECTIONS.media).deleteOne({
      _id: new ObjectId(id),
    });

    return handleCORS(
      NextResponse.json({
        success: true,
      }),
    );
  } catch (error) {
    console.error("MEDIA DELETE ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: error.message || "Delete failed",
        },
        { status: 500 },
      ),
    );
  }
}
