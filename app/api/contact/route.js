import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.server";
import { sendContactNotification } from "@/lib/email/contact-email";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "contact-form", 
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many contact form submissions. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    // Parse request body
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    // Only allow expected fields
    const allowedFields = ["name", "email", "subject", "message"];

    const unexpectedFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (unexpectedFields.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid fields in request.",
        },
        {
          status: 400,
        },
      );
    }

    // Validate required fields
    if (
      typeof body.name !== "string" ||
      typeof body.email !== "string" ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Name, email and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Normalize strings
    const name = body.name.trim();
    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";
    const message = body.message.trim();

    // Length validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          error: "Name must be between 2 and 100 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          error: "Subject cannot exceed 200 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (message.length < 5 || message.length > 2000) {
      return NextResponse.json(
        {
          error: "Message must be between 5 and 2000 characters.",
        },
        {
          status: 400,
        },
      );
    }

    // Email validation
    const email = await validateEmail(body.email);

    if (!email.valid) {
      return NextResponse.json(
        {
          error: email.message,
        },
        {
          status: 400,
        },
      );
    }

    // Build database document from validated fields only
    const contact = {
      name,
      email: email.email,
      subject,
      message,
      createdAt: new Date(),
    };

    console.log("Contact ROUTE HIT");
    console.log("COLLECTION:", COLLECTIONS.contacts);

    const db = await getDb();

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
      {
        status: 500,
      },
    );
  }
}