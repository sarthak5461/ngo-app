import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";

import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";

function getSessionFromHeaders(request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const match = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;

  const token = match.split("=").slice(1).join("=");

  return verifySessionToken(token);
}

export async function GET(request) {
  try {
    const session = getSessionFromHeaders(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const db = await getDb();

    const [donations, activeMembers, volunteerCount, contactCount, csrCount] =
      await Promise.all([
        db.collection(COLLECTIONS.donations).find({}).toArray(),

        db.collection(COLLECTIONS.members).countDocuments(),

        db.collection(COLLECTIONS.volunteers).countDocuments(),

        db.collection(COLLECTIONS.contacts).countDocuments(),

        db.collection(COLLECTIONS.csrInquiries).countDocuments(),
      ]);

    const donationCount = donations.length;

    const totalRaised = donations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0,
    );

    return NextResponse.json({
      totalRaised,

      donationCount,

      activeMembers,

      pendingMembers: 0,

      volunteerCount,

      csrCount,

      contactCount,

      memberContributions: activeMembers * 500,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch admin stats",
      },
      { status: 500 },
    );
  }
}
