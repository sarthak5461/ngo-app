import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getDb, COLLECTIONS } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const amount = parseInt(body.amount, 10);

    const cause = body.cause || "general";

    if (!amount || amount < 10) {
      return NextResponse.json(
        { error: "Minimum donation is ₹10" },
        { status: 400 },
      );
    }

    const orderId = `order_${uuidv4().replace(/-/g, "").slice(0, 20)}`;

    const orderDoc = {
      id: uuidv4(),
      orderId,
      amount,
      cause,
      currency: "INR",
      status: "created",
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.donationOrders).insertOne(orderDoc);

    return NextResponse.json({
      orderId,
      amount,
      currency: "INR",
      mock: true,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
