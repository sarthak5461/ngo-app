import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDb, COLLECTIONS } from "@/lib/db";
import { checkRateLimit } from "@/lib/security/rate-limit";

const ALLOWED_CAUSES = [
  "general",
  "education",
  "disaster-relief",
  "environment",
];

const MIN_DONATION = 500;
const MAX_DONATION = 1000000;

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "donation-order",
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
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

    // Only allow amount and cause
    const allowedFields = ["amount", "cause"];

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

    // Amount must be a number
    if (
      typeof body.amount !== "number" ||
      !Number.isFinite(body.amount) ||
      !Number.isInteger(body.amount)
    ) {
      return NextResponse.json(
        {
          error: "Donation amount must be a valid whole number.",
        },
        {
          status: 400,
        },
      );
    }

    const amount = body.amount;

    // Donation limits
    if (amount < MIN_DONATION) {
      return NextResponse.json(
        {
          error: `Minimum donation is ₹${MIN_DONATION}`,
        },
        {
          status: 400,
        },
      );
    }

    if (amount > MAX_DONATION) {
      return NextResponse.json(
        {
          error: "Maximum donation amount is ₹10,00,000.",
        },
        {
          status: 400,
        },
      );
    }

    // Cause validation
    const cause =
      typeof body.cause === "string"
        ? body.cause.trim()
        : "general";

    if (!ALLOWED_CAUSES.includes(cause)) {
      return NextResponse.json(
        {
          error: "Invalid donation cause.",
        },
        {
          status: 400,
        },
      );
    }

    const db = await getDb();

    const orderId = `order_${uuidv4()
      .replace(/-/g, "")
      .slice(0, 20)}`;

    const orderDoc = {
      id: uuidv4(),
      orderId,
      amount,
      cause,
      currency: "INR",
      status: "created",
      createdAt: new Date(),
    };

    await db
      .collection(COLLECTIONS.donationOrders)
      .insertOne(orderDoc);

    return NextResponse.json({
      orderId,
      amount,
      currency: "INR",
      mock: true,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      {
        status: 500,
      },
    );
  }
}