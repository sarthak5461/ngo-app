import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.client";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = await validateEmail(body.email);

    if (!email.valid) {
      Response.json(
        {
          error: email.message,
        },
        {
          status: 400,
        },
      );
    }

    body.email = email.email;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 },
      );
    }

    const db = await getDb();

    const doc = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      city: body.city || "",
      interest: body.interest || "general",
      message: body.message || "",
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.volunteers).insertOne(doc);

    const { _id, ...clean } = doc;

    return NextResponse.json({
      success: true,
      volunteer: clean,
    });
  } catch (error) {
    console.error("VOLUNTEER ERROR:", error);

    return NextResponse.json(
      { error: "Failed volunteer signup" },
      { status: 500 },
    );
  }
}
