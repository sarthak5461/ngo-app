import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const db = await getDb();

    const row = await db.collection(COLLECTIONS.programs).findOne({
      slug: params.slug,
    });

    if (!row) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json({
      program: {
        ...row,
        _id: row._id.toString(),
      },
    });
  } catch (error) {
    console.error("PUBLIC PROGRAM ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch program" },
      { status: 500 },
    );
  }
}
