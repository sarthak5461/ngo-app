import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const db = await getDb();

    const inquiry = {
      ...body,
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.csrInquiries).insertOne(inquiry);

    return NextResponse.json({
      ok: true,
      message: "CSR inquiry submitted successfully",
    });
  } catch (error) {
    console.error("CSR ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to submit CSR inquiry",
      },
      { status: 500 },
    );
  }
}
