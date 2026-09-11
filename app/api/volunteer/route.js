import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.server";
import { sendVolunteerNotification } from "@/lib/email/volunteer-email";
import { checkRateLimit } from "@/lib/security/rate-limit";

const ALLOWED_INTERESTS = [
  "Education",
  "Disaster-relief",
  "Environment",
  "Healthcare",
];

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "volunteer-signup",
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    const body = await request.json();

    // Validate request body
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
    const allowedFields = [
      "name",
      "email",
      "phone",
      "city",
      "interest",
      "message",
    ];

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

    // Required fields must be strings
    if (
      typeof body.name !== "string" ||
      typeof body.email !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Name and email are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Normalize
    const name = body.name.trim();
    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";
    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";
    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";
    const interest =
      typeof body.interest === "string"
        ? body.interest.trim()
        : "Education";

    // Name validation
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

    // Phone validation
    if (phone.length > 15) {
      return NextResponse.json(
        {
          error: "Phone number cannot exceed 15 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (phone && !/^[0-9+\-()\s]+$/.test(phone)) {
      return NextResponse.json(
        {
          error: "Invalid phone number.",
        },
        {
          status: 400,
        },
      );
    }

    // City validation
    if (city.length > 100) {
      return NextResponse.json(
        {
          error: "City cannot exceed 100 characters.",
        },
        {
          status: 400,
        },
      );
    }

    // Message validation
    if (message.length > 2000) {
      return NextResponse.json(
        {
          error: "Message cannot exceed 2000 characters.",
        },
        {
          status: 400,
        },
      );
    }

    // Interest validation
    if (!ALLOWED_INTERESTS.includes(interest)) {
      return NextResponse.json(
        {
          error: "Invalid area of interest.",
        },
        {
          status: 400,
        },
      );
    }

    // Server-side email validation
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

    // Store only validated fields
    const doc = {
      id: uuidv4(),
      name,
      email: email.email,
      phone,
      city,
      interest,
      message,
      createdAt: new Date(),
    };

    const db = await getDb();

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
      {
        error: "Failed volunteer signup",
      },
      {
        status: 500,
      },
    );
  }
}