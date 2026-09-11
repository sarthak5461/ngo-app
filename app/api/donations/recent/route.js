import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const db = await getDb();
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
    return handleCORS(NextResponse.json(cleaned), request);
  } catch (error) {
    console.error("RECENT DONATION:", error);
    return handleCORS(
      NextResponse.json(
        { error: "Failed to Recent donation" },
        { status: 500 },
      ),
      request,
    );
  }
}
