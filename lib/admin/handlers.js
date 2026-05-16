// Admin route handlers — wired into the existing catch-all /api route.
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  listDonations,
  listMembers,
  listVolunteers,
  listContacts,
  getDashboardStats,
} from "@/lib/services";

import { toCSV } from "@/lib/utils/csv";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";
import { ROLES } from "@/lib/auth/rbac";

function j(data, init) {
  return NextResponse.json(data, init);
}
function unauthorised() {
  return j({ error: "Unauthorised" }, { status: 401 });
}

function getSessionFromHeaders(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const m = cookieHeader
    .split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!m) return null;
  const token = m.split("=").slice(1).join("=");
  return verifySessionToken(token);
}

// Columns for CSV exports
const CSV_COLUMNS = {
  donations: [
    { key: "receiptNumber", label: "Receipt" },
    { key: "donorName", label: "Donor Name" },
    { key: "donorEmail", label: "Email" },
    { key: "donorPhone", label: "Phone" },
    { key: "amount", label: "Amount (INR)" },
    { key: "cause", label: "Cause" },
    { key: "panNumber", label: "PAN" },
    { key: "paymentId", label: "Payment ID" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Date" },
  ],
  members: [
    { key: "memberId", label: "Member ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Mobile" },
    { key: "occupation", label: "Occupation" },
    { key: "amount", label: "Contribution (INR)" },
    { key: "status", label: "Status" },
    { key: "validFrom", label: "Valid From" },
    { key: "validUntil", label: "Valid Until" },
    { key: "receiptNumber", label: "Receipt" },
    { key: "createdAt", label: "Created At" },
  ],
  volunteers: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "interest", label: "Interest" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Created At" },
  ],
  contacts: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Created At" },
  ],
};

export async function handleAdminRoute(request, route, method) {
  const url = new URL(request.url);
  const params = url.searchParams;

  // All routes below require auth
  const session = getSessionFromHeaders(request);
  if (!session) return unauthorised();

  // ── DONATIONS ─────────────────────────────────────────────────
  if (route === "/admin/donations" && method === "GET") {
    const rows = await listDonations({
      search: params.get("q") || "",
      cause: params.get("cause") || "all",
      limit: 500,
    });
    return j({ rows });
  }
  if (route === "/admin/donations/export" && method === "GET") {
    const rows = await listDonations({
      search: params.get("q") || "",
      cause: params.get("cause") || "all",
      limit: 5000,
    });
    const csv = toCSV(rows, CSV_COLUMNS.donations);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="donations-${Date.now()}.csv"`,
      },
    });
  }

  // ── MEMBERS ──────────────────────────────────────────────────
  if (route === "/admin/members" && method === "GET") {
    const rows = await listMembers({
      search: params.get("q") || "",
      status: params.get("status") || "all",
      limit: 500,
    });
    return j({ rows });
  }
  if (route === "/admin/members/export" && method === "GET") {
    const rows = await listMembers({
      search: params.get("q") || "",
      status: params.get("status") || "all",
      limit: 5000,
    });
    const csv = toCSV(rows, CSV_COLUMNS.members);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="members-${Date.now()}.csv"`,
      },
    });
  }

  // ── VOLUNTEERS ─────────────────────────────────────────────────
  if (route === "/admin/volunteers" && method === "GET") {
    const rows = await listVolunteers({
      search: params.get("q") || "",
      interest: params.get("interest") || "all",
      limit: 500,
    });
    return j({ rows });
  }
  if (route === "/admin/volunteers/export" && method === "GET") {
    const rows = await listVolunteers({
      search: params.get("q") || "",
      interest: params.get("interest") || "all",
      limit: 5000,
    });
    const csv = toCSV(rows, CSV_COLUMNS.volunteers);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="volunteers-${Date.now()}.csv"`,
      },
    });
  }

  // ── CONTACTS / CSR ──────────────────────────────────────────────────

  if (route === "/admin/contacts/export" && method === "GET") {
    const rows = await listContacts({
      search: params.get("q") || "",
      kind: params.get("kind") || "all",
      limit: 5000,
    });
    const csv = toCSV(rows, CSV_COLUMNS.contacts);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="contacts-${Date.now()}.csv"`,
      },
    });
  }

  return j({ error: `Admin route ${route} not found` }, { status: 404 });
}
