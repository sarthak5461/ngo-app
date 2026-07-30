import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { verifyAccessToken } from "./jwt";
import { getDb, COLLECTIONS } from "@/lib/db";

export async function requireAdmin(request) {
  try {
    const token = request.cookies.get("mkds_token")?.value;

    if (!token) {
      return {
        success: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const payload = await verifyAccessToken(token);

    if (!payload?.userId) {
      return {
        success: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    const db = await getDb();

    const user = await db.collection(COLLECTIONS.users).findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user) {
      return {
        success: false,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    if (user.status !== "active") {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Account disabled" },
          { status: 403 },
        ),
      };
    }

    // Never expose password hash
    delete user.passwordHash;

    return {
      success: true,
      user,
    };
  } catch (err) {
    console.error("AUTH ERROR:", err);

    return {
      success: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}
