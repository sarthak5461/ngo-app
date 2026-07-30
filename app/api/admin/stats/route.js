import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth";

export async function GET(request) {
  try {
    const user = await requireAdmin(request);

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
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
      {
        status: 500,
      },
    );
  }
}
