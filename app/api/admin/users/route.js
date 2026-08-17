import { NextResponse } from "next/server";
import { getDb, COLLECTIONS } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";
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

    if (!name || !email || !password || !role || !status) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }

    const existing = await getUserByEmail(email);

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
    const passwordHash = await hashPassword(password);

    const user = {
      name: name.trim(),

      email: email.trim().toLowerCase(),

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
    console.error("CREATE USER ERROR:", Error);

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
