import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.server";
import { sendCSRNotification } from "@/lib/email/csr-email";
import { checkRateLimit } from "@/lib/security/rate-limit";

const ALLOWED_INTERESTS = [
  "CSR Funding",
  "Employee Volunteering",
  "In-Kind Partnership",
  "Cause Marketing",
  "Other",
];

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "csr-inquiry",
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many submissions. Please try again later.",
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
      "company",
      "name",
      "designation",
      "email",
      "phone",
      "interest",
      "budget",
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
      typeof body.company !== "string" ||
      typeof body.name !== "string" ||
      typeof body.email !== "string" ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Company, name, email and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Normalize values
    const company = body.company.trim();
    const name = body.name.trim();
    const designation =
      typeof body.designation === "string"
        ? body.designation.trim()
        : "";
    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";
    const interest =
      typeof body.interest === "string"
        ? body.interest.trim()
        : "CSR Funding";
    const budget =
      typeof body.budget === "string"
        ? body.budget.trim()
        : "";
    const message = body.message.trim();

    // Company validation
    if (company.length < 2 || company.length > 150) {
      return NextResponse.json(
        {
          error: "Company name must be between 2 and 150 characters.",
        },
        {
          status: 400,
        },
      );
    }

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

    // Designation validation
    if (designation.length > 100) {
      return NextResponse.json(
        {
          error: "Designation cannot exceed 100 characters.",
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

    // Interest validation
    if (!ALLOWED_INTERESTS.includes(interest)) {
      return NextResponse.json(
        {
          error: "Invalid partnership type.",
        },
        {
          status: 400,
        },
      );
    }

    // Budget validation
    if (budget.length > 200) {
      return NextResponse.json(
        {
          error: "Budget information cannot exceed 200 characters.",
        },
        {
          status: 400,
        },
      );
    }

    // Message validation
    if (message.length < 5 || message.length > 3000) {
      return NextResponse.json(
        {
          error: "Message must be between 5 and 3000 characters.",
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
    const inquiry = {
      company,
      name,
      designation,
      email: email.email,
      phone,
      interest,
      budget,
      message,
      createdAt: new Date(),
    };

    const db = await getDb();

    await db
      .collection(COLLECTIONS.csrInquiries)
      .insertOne(inquiry);

    try {
      await sendCSRNotification(inquiry);
    } catch (emailError) {
      console.error("CSR EMAIL ERROR:", emailError);
    }

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
      {
        status: 500,
      },
    );
  }
}