import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const docs = await db
      .collection("donations")
      .find({ status: "success" })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();
    const cleaned = docs.map((d) => ({
      firstName: (d.donorName || "Anonymous").split(" ")[0],
      amount: d.amount,
      cause: d.cause,
      createdAt: d.createdAt,
    }));
    return handleCORS(NextResponse.json(cleaned));
  } catch (error) {
    console.error("RECENT DONATION:", error);
    return NextResponse.json(
      { error: "Failed to Recent donation" },
      { status: 500 },
    );
  }
}
