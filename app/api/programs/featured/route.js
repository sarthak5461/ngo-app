import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const rows = await db
      .collection(COLLECTIONS.programs)
      .find({
        status: "published",
      })
      .sort({
        updatedAt: -1,
      })
      .limit(4)
      .toArray();

    return NextResponse.json({
      rows: rows.map((r) => ({
        ...r,

        _id: r._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch programs",
      },
      {
        status: 500,
      },
    );
  }
}
