import { getDb, COLLECTIONS } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

import { generateCSV, csvResponse } from "@/lib/export/csv";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(
      auth.user,
      PERMISSIONS.DONATIONS_EXPORT,
    );

    if (forbidden) {
      return forbidden;
    }

    const db = await getDb();

    const rows = await db
      .collection(COLLECTIONS.donations)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const csv = generateCSV(rows, [
      {
        header: "Receipt No",
        key: "receiptNumber",
      },
      {
        header: "Donor Name",
        key: "name",
      },
      {
        header: "Email",
        key: "email",
      },
      {
        header: "Phone",
        key: "phone",
      },
      {
        header: "Amount",
        key: "amount",
      },
      {
        header: "Cause",
        key: "cause",
      },
      {
        header: "Payment Status",
        key: "paymentStatus",
      },
      {
        header: "Payment ID",
        key: "paymentId",
      },
      {
        header: "Transaction ID",
        key: "transactionId",
      },
      {
        header: "Date",
        format: (row) =>
          row.createdAt ? new Date(row.createdAt).toLocaleString() : "",
      },
    ]);

    return csvResponse(
      `donations-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Failed to export donations",
      },
      {
        status: 500,
      },
    );
  }
}
