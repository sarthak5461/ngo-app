import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { handleCORS } from "@/lib/cors";
import { validateEmail } from "@/lib/validators/email.server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { getDb, COLLECTIONS } from "@/lib/db";

const MOCK_RAZORPAY_KEY_ID = "rzp_test_MOCK_DEMO_KEY";

const MIN_AMOUNT = 500;
const MAX_AMOUNT = 50000;

const ALLOWED_OCCUPATIONS = [
  "Salaried",
  "Business",
  "Self-employed",
  "Student",
  "Retired",
  "Homemaker",
  "Other",
];

const MAX_PHOTO_SIZE = 2 * 1024 * 1024;

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "member-application",
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Too many membership applications. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(rateLimit.retryAfter),
            },
          },
        ),
        request,
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid request body.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Only allow expected fields
    const allowedFields = [
      "name",
      "mobile",
      "email",
      "address",
      "occupation",
      "aadhaarLast4",
      "photo",
      "reason",
      "amount",
    ];

    const unexpectedFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (unexpectedFields.length > 0) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid fields in request.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Required fields must be strings
    if (
      typeof body.name !== "string" ||
      typeof body.mobile !== "string" ||
      typeof body.email !== "string" ||
      typeof body.address !== "string" ||
      typeof body.aadhaarLast4 !== "string" ||
      typeof body.reason !== "string"
    ) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid member information.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Normalize strings
    const name = body.name.trim();
    const mobile = body.mobile.trim();
    const address = body.address.trim();
    const aadhaarLast4 = body.aadhaarLast4.trim();
    const reason = body.reason.trim();

    const occupation =
      typeof body.occupation === "string" ? body.occupation.trim() : "Other";

    const photo = typeof body.photo === "string" ? body.photo : null;

    // Name validation
    if (name.length < 2 || name.length > 100) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Name must be between 2 and 100 characters.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Mobile validation
    if (!/^\d{10}$/.test(mobile)) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid mobile number.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Address validation
    if (address.length < 5 || address.length > 500) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Address must be between 5 and 500 characters.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Aadhaar — only last 4 digits should reach this endpoint
    if (!/^\d{4}$/.test(aadhaarLast4)) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid Aadhaar information.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Occupation allowlist
    if (!ALLOWED_OCCUPATIONS.includes(occupation)) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Invalid occupation.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Reason validation
    if (reason.length < 10 || reason.length > 2000) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Reason must be between 10 and 2000 characters.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Validate email on the server
    const email = await validateEmail(body.email);

    if (!email.valid) {
      return handleCORS(
        NextResponse.json(
          {
            error: email.message,
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Amount must be an actual integer
    if (
      typeof body.amount !== "number" ||
      !Number.isFinite(body.amount) ||
      !Number.isInteger(body.amount)
    ) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Membership contribution must be a valid whole number.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    const amount = body.amount;

    if (amount < MIN_AMOUNT) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Minimum support contribution is ₹500.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    if (amount > MAX_AMOUNT) {
      return handleCORS(
        NextResponse.json(
          {
            error: "Maximum membership contribution is ₹8,000.",
          },
          {
            status: 400,
          },
        ),
        request,
      );
    }

    // Photo validation
    if (photo) {
      if (!/^data:image\/(jpeg|jpg|png);base64,/i.test(photo)) {
        return handleCORS(
          NextResponse.json(
            {
              error: "Photo must be a JPG or PNG image.",
            },
            {
              status: 400,
            },
          ),
          request,
        );
      }

      const base64Data = photo.split(",")[1];

      if (!base64Data) {
        return handleCORS(
          NextResponse.json(
            {
              error: "Invalid photo data.",
            },
            {
              status: 400,
            },
          ),
          request,
        );
      }

      const approximateSize = Math.floor((base64Data.length * 3) / 4);

      if (approximateSize > MAX_PHOTO_SIZE) {
        return handleCORS(
          NextResponse.json(
            {
              error: "Photo must be under 2MB.",
            },
            {
              status: 400,
            },
          ),
          request,
        );
      }
    }

    const db = await getDb();

    const orderId = `order_${uuidv4().replace(/-/g, "").slice(0, 20)}`;

    const id = uuidv4();

    // Only validated fields are stored
    const memberDoc = {
      id,
      memberId: null,
      name,
      mobile,
      email: email.email,
      address,
      occupation,
      aadhaarLast4,
      photo,
      reason,
      amount,
      orderId,
      paymentId: null,
      status: "pending_payment",
      validFrom: null,
      validUntil: null,
      receiptNumber: null,
      kind: "membership",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(COLLECTIONS.members).insertOne(memberDoc);

    await db.collection(COLLECTIONS.memberOrders).insertOne({
      id: uuidv4(),
      orderId,
      memberId: id,
      amount,
      status: "created",
      createdAt: new Date(),
    });

    return handleCORS(
      NextResponse.json({
        id,
        orderId,
        amount,
        currency: "INR",
        keyId: MOCK_RAZORPAY_KEY_ID,
        mock: true,
      }),
      request,
    );
  } catch (error) {
    console.error("APPLY MEMBER ERROR:", error);

    return handleCORS(
      NextResponse.json(
        {
          error: "Failed to apply member",
        },
        {
          status: 500,
        },
      ),
      request,
    );
  }
}
