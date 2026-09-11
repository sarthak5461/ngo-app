import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const db = await getDb();
    const user = auth.user;

    const canViewDonations = hasPermission(user, PERMISSIONS.DONATIONS_VIEW);

    const canViewMembers = hasPermission(user, PERMISSIONS.MEMBERS_VIEW);

    const canViewVolunteers = hasPermission(user, PERMISSIONS.VOLUNTEERS_VIEW);

    const canViewCSR = hasPermission(user, PERMISSIONS.CSR_VIEW);

    const [donations, activeMembers, volunteerCount, contactCount, csrCount] =
      await Promise.all([
        canViewDonations
          ? db.collection(COLLECTIONS.donations).find({}).toArray()
          : Promise.resolve([]),

        canViewMembers
          ? db.collection(COLLECTIONS.members).countDocuments()
          : Promise.resolve(0),

        canViewVolunteers
          ? db.collection(COLLECTIONS.volunteers).countDocuments()
          : Promise.resolve(0),

        canViewCSR
          ? db.collection(COLLECTIONS.contacts).countDocuments()
          : Promise.resolve(0),

        canViewCSR
          ? db.collection(COLLECTIONS.csrInquiries).countDocuments()
          : Promise.resolve(0),
      ]);

    const donationCount = canViewDonations ? donations.length : 0;

    const totalRaised = canViewDonations
      ? donations.reduce((sum, d) => sum + Number(d.amount || 0), 0)
      : 0;

    return NextResponse.json({
      totalRaised,
      donationCount,

      activeMembers,
      pendingMembers: 0,
      memberContributions: canViewMembers ? activeMembers * 500 : 0,

      volunteerCount,
      csrCount,
      contactCount,
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
