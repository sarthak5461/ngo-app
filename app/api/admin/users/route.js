import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS, ROLES } from "@/lib/auth/rbac";
import { hashPassword } from "@/lib/auth/password";
import { createUser, getUserByEmail } from "@/lib/services/users";

export async function GET(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) return auth.response;

    const forbidden = requirePermission(auth.user, PERMISSIONS.USERS_VIEW);

    if (forbidden) return forbidden;

    const db = await getDb();

    const users = await db
      .collection(COLLECTIONS.users)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      rows: users.map((u) => ({
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error("USERS GET ERROR:", err);

    return NextResponse.json(
      {
        error: "Failed to load users",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.USERS_EDIT);

    if (forbidden) {
      return forbidden;
    }

    const body = await request.json();

    const { name, email, password, role, status } = body;

    const normalizedName = typeof name === "string" ? name.trim() : "";

    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName || !normalizedEmail || !password || !role || !status) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const existing = await getUserByEmail(normalizedEmail);

    if (existing) {
      return NextResponse.json(
        {
          error: "A user with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const allowedRoles = Object.values(ROLES);

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const allowedStatuses = ["active", "inactive"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = {
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role,
      status,
      failedAttempts: 0,
      lockedUntil: null,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await createUser(user);

    return NextResponse.json({
      ok: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create user",
      },
      {
        status: 500,
      },
    );
  }
}
