import { handleCORS } from "@/lib/cors";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const db = await getDb();
    const id = params.id;
    const donation = await db.collection("donations").findOne({ id });
    if (!donation)
      return handleCORS(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
      );
    const { _id, ...clean } = donation;
    return handleCORS(NextResponse.json(clean));
  } catch (error) {
    console.error("CREATE RECEIPT", error);
    return handleCORS(
      NextResponse.json({ error: "Failed to create receipt" }, { status: 500 }),
      request,
    );
  }
}
