import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { handleCORS } from "@/lib/cors";

import { getDb } from "@/lib/db";

const MOCK_RAZORPAY_KEY_ID = "rzp_test_MOCK_DEMO_KEY";

export async function POST(request) {
  try {
    const body = await request.json();

    const db = await getDb();
    const amount = parseInt(body.amount, 10);
    if (!body.name || !body.email || !body.mobile || !body.address) {
      return handleCORS(
        NextResponse.json(
          { error: "Required fields missing" },
          { status: 400 },
        ),
      );
    }
    if (!/^\d{10}$/.test(body.mobile)) {
      return handleCORS(
        NextResponse.json({ error: "Invalid mobile number" }, { status: 400 }),
      );
    }
    if (!amount || amount < 500) {
      return handleCORS(
        NextResponse.json(
          { error: "Minimum support contribution is ₹500" },
          { status: 400 },
        ),
      );
    }
    const orderId = `order_${uuidv4().replace(/-/g, "").slice(0, 20)}`;
    const id = uuidv4();
    const memberDoc = {
      id,
      memberId: null,
      name: body.name,
      mobile: body.mobile,
      email: body.email,
      address: body.address,
      occupation: body.occupation || "Other",
      aadhaarLast4: (body.aadhaarLast4 || "").slice(-4),
      photo: body.photo || null,
      reason: body.reason || "",
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
    await db.collection("members").insertOne(memberDoc);
    await db.collection("member_orders").insertOne({
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
    );
  } catch (error) {
    console.error("APPLY MEMBER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to apply member" },
      { status: 500 },
    );
  }
}
