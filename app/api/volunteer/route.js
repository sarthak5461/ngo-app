import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.client";
import { sendVolunteerNotification } from "@/lib/email/volunteer-email";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!validateEmail(body.email)) {
      return NextResponse.json(
        {
          error: "Invalid email address",
        },
        {
          status: 400,
        },
      );
    }

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

    try {
      await sendVolunteerNotification(doc);
    } catch (emailError) {
      console.error("VOLUNTEER EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      volunteer: doc,
    });
  } catch (error) {
    console.error("VOLUNTEER ERROR:", error);

    return NextResponse.json(
      { error: "Failed volunteer signup" },
      { status: 500 },
    );
  }
}
