import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
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

function newReceiptNumber() {
  const yr = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MKDS/${yr}/${rand}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const { orderId, paymentId, signature, donor = {} } = body;
    if (!orderId || !paymentId || !signature) {
      return handleCORS(
        NextResponse.json({ error: "Missing payment fields" }, { status: 400 }),
      );
    }
    const order = await db.collection("donation_orders").findOne({ orderId });
    if (!order) {
      return handleCORS(
        NextResponse.json({ error: "Invalid order" }, { status: 404 }),
      );
    }
    const valid = verifyRazorpaySignature(orderId, paymentId, signature);
    if (!valid) {
      await db.collection("donations").insertOne({
        id: uuidv4(),
        orderId,
        paymentId,
        status: "failed",
        reason: "signature_mismatch",
        createdAt: new Date(),
      });
      return handleCORS(
        NextResponse.json(
          { error: "Payment signature verification failed" },
          { status: 400 },
        ),
      );
    }

    const donation = {
      id: uuidv4(),
      receiptNumber: newReceiptNumber(),
      orderId,
      paymentId,
      amount: order.amount,
      currency: order.currency || "INR",
      cause: order.cause,
      donorName: donor.name || "Anonymous",
      donorEmail: donor.email || "",
      donorPhone: donor.phone || "",
      donorMessage: donor.message || "",
      panNumber: donor.pan || "",
      status: "success",
      createdAt: new Date(),
    };
    await db.collection("donations").insertOne(donation);
    await db
      .collection("donation_orders")
      .updateOne({ orderId }, { $set: { status: "paid", paidAt: new Date() } });

    // Strip Mongo _id before returning
    const { _id, ...clean } = donation;
    return handleCORS(NextResponse.json({ success: true, donation: clean }));
  } catch (error) {
    console.error("DONATION VERIFY:", error);
    return NextResponse.json({ error: "Failed to Verify" }, { status: 500 });
  }
}

// if (route === "/donations/verify" && method === "POST") {

// }
