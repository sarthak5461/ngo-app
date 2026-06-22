import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { validateEmail } from "@/lib/validators/email.server";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = await validateEmail(body.email);

    if (!email.valid) {
      return Response.json(
        {
          error: email.message,
        },
        {
          status: 400,
        },
      );
    }

    body.email = email.email;

    const db = await getDb();

    const inquiry = {
      ...body,
      createdAt: new Date(),
    };

    await db.collection(COLLECTIONS.csrInquiries).insertOne(inquiry);

    return NextResponse.json({
      ok: true,
      message: "CSR inquiry submitted successfully",
    });
  } catch (error) {
    console.error("CSR ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to submit CSR inquiry",
      },
      { status: 500 },
    );
  }
}
