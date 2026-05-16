import { NextResponse } from "next/server";

import { getDb, COLLECTIONS } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const [donations, members, volunteers, contactCount, csrCount] =
      await Promise.all([
        db.collection(COLLECTIONS.donations).countDocuments(),

        db.collection(COLLECTIONS.members).countDocuments(),

        db.collection(COLLECTIONS.volunteers).countDocuments(),

        db.collection(COLLECTIONS.contacts).countDocuments(),

        db.collection(COLLECTIONS.csrInquiries).countDocuments(),
      ]);

    return NextResponse.json({
      totalRaised: donations,

      donationCount: donations,

      activeMembers: members,

      pendingMembers: 0,

      volunteerCount: volunteers,

      csrCount,

      contactCount,

      memberContributions: members * 500,
    });
  } catch (error) {
    console.error("PUBLIC STATS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch stats",
      },
      {
        status: 500,
      },
    );
  }
}
