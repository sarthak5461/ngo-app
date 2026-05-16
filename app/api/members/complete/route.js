import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

const MOCK_RAZORPAY_SECRET = "MOCK_DEMO_SECRET_DO_NOT_USE_IN_PROD";

function signRazorpay(orderId, paymentId, secret = MOCK_RAZORPAY_SECRET) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

function verifyRazorpaySignature(
  orderId,
  paymentId,
  signature,
  secret = MOCK_RAZORPAY_SECRET,
) {
  const expected = signRazorpay(orderId, paymentId, secret);
  // Constant-time compare to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const { id, orderId, paymentId, signature } = body;
    if (!id || !orderId || !paymentId || !signature) {
      return handleCORS(
        NextResponse.json({ error: "Missing payment fields" }, { status: 400 }),
      );
    }
    const member = await db.collection("members").findOne({ id });
    if (!member)
      return handleCORS(
        NextResponse.json({ error: "Member not found" }, { status: 404 }),
      );
    if (member.orderId !== orderId)
      return handleCORS(
        NextResponse.json({ error: "Order mismatch" }, { status: 400 }),
      );

    const valid = verifyRazorpaySignature(orderId, paymentId, signature);
    if (!valid) {
      await db
        .collection("members")
        .updateOne(
          { id },
          { $set: { status: "payment_failed", updatedAt: new Date() } },
        );
      return handleCORS(
        NextResponse.json(
          { error: "Payment signature verification failed" },
          { status: 400 },
        ),
      );
    }

    const num = Math.floor(100000 + Math.random() * 900000);
    const printedId = `MKDS-MEM-${num}`;
    const validFrom = new Date();
    const validUntil = new Date(validFrom);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const receiptNumber = `MKDS/M/${validFrom.getFullYear()}/${num}`;

    await db.collection("members").updateOne(
      { id },
      {
        $set: {
          memberId: printedId,
          paymentId,
          status: "active",
          validFrom,
          validUntil,
          receiptNumber,
          updatedAt: new Date(),
        },
      },
    );
    await db
      .collection("member_orders")
      .updateOne({ orderId }, { $set: { status: "paid", paidAt: new Date() } });

    const final = await db.collection("members").findOne({ id });
    const { _id, ...clean } = final;
    return handleCORS(NextResponse.json({ success: true, member: clean }));
  } catch (error) {
    console.error("MEMEBER COMPLETE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to complete memeber" },
      { status: 500 },
    );
  }
}
