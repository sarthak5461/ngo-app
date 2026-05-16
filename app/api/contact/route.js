import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const db = await getDb();

    const contact = {
      ...body,
      createdAt: new Date(),
    };

    console.log("Contact ROUTE HIT");
    console.log("COLLECTION:", COLLECTIONS.contacts);

    await db.collection(COLLECTIONS.contacts).insertOne(contact);

    return NextResponse.json({
      ok: true,
      message: "Message submitted successfully",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to submit contact form",
      },
      { status: 500 },
    );
  }
}
