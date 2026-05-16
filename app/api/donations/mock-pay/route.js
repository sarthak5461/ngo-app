import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { getDb } from "@/lib/db";

// const MOCK_RAZORPAY_KEY_ID = "rzp_test_MOCK_DEMO_KEY";
const MOCK_RAZORPAY_SECRET = "MOCK_DEMO_SECRET_DO_NOT_USE_IN_PROD";

function signRazorpay(orderId, paymentId, secret = MOCK_RAZORPAY_SECRET) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const { orderId } = body;
    const order = await db.collection("donation_orders").findOne({ orderId });
    if (!order) {
      return handleCORS(
        NextResponse.json({ error: "Order not found" }, { status: 404 }),
      );
    }
    const paymentId = `pay_${uuidv4().replace(/-/g, "").slice(0, 20)}`;
    const signature = signRazorpay(orderId, paymentId);
    return handleCORS(NextResponse.json({ paymentId, signature, orderId }));
  } catch (error) {
    console.error("CREATE MOCK PAY:", error);
    return NextResponse.json({ error: "Failed to Mock Pay" }, { status: 500 });
  }
}
