import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { getDb } from "@/lib/db";

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

    const order = await db
      .collection("member_orders")
      .findOne({ orderId: body.orderId });
    if (!order)
      return handleCORS(
        NextResponse.json({ error: "Order not found" }, { status: 404 }),
      );
    const paymentId = `pay_${uuidv4().replace(/-/g, "").slice(0, 20)}`;
    const signature = signRazorpay(body.orderId, paymentId);
    return handleCORS(
      NextResponse.json({ paymentId, signature, orderId: body.orderId }),
    );
  } catch (error) {
    console.error("MOCK PAY ERROR:", error);

    return NextResponse.json({ error: "Failed to pay" }, { status: 500 });
  }
}
