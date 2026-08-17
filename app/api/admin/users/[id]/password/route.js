import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

import { hashPassword } from "@/lib/auth/password";

import { getUserById, updateUserPassword } from "@/lib/services/users";

export async function PUT(request, { params }) {
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

    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          error: "Password is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await getUserById(params.id);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const passwordHash = await hashPassword(password);

    await updateUserPassword(params.id, passwordHash);

    return NextResponse.json({
      ok: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to reset password.",
      },
      {
        status: 500,
      },
    );
  }
}
