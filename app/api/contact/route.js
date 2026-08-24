import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.server";
import { sendContactNotification } from "@/lib/email/contact-email";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = await validateEmail(body.email);

    if (!email.valid) {
      return Response.json(
        {
          error: email.message,
        },
        {
          status: 400,
        },
      );
    }

    body.email = email.email;

    const db = await getDb();

    const contact = {
      ...body,
      createdAt: new Date(),
    };

    console.log("Contact ROUTE HIT");
    console.log("COLLECTION:", COLLECTIONS.contacts);

    await db.collection(COLLECTIONS.contacts).insertOne(contact);

    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error("CONTACT EMAIL ERROR:", emailError);
    }

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
