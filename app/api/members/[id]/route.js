import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const db = await getDb();

    const member = await db.collection(COLLECTIONS.members).findOne({
      id: params.id,
    });

    if (!member) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { _id, ...clean } = member;

    return NextResponse.json(clean);
  } catch (error) {
    console.error("MEMBER GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 },
    );
  }
}
