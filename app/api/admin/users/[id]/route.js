import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/auth";
import { requirePermission, PERMISSIONS } from "@/lib/auth/rbac";

import {
  getUserByEmail,
  getUserById,
  updateUserProfile,
  deleteUser,
} from "@/lib/services/users";

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

    const { name, email, role, status } = body;

    if (!name || !email || !role || !status) {
      return NextResponse.json(
        {
          error: "All fields are required.",
        },
        {
          status: 400,
        },
      );
    }
    const currentUser = await getUserById(params.id);

    // Prevent users from changing their own role or status
    if (auth.user.userId === currentUser._id.toString()) {
      if (role !== currentUser.role || status !== currentUser.status) {
        return NextResponse.json(
          {
            error: "You cannot change your own role or account status.",
          },
          {
            status: 403,
          },
        );
      }
    }

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

    const existing = await getUserByEmail(email);

    if (existing && existing._id.toString() !== currentUser._id.toString()) {
      return NextResponse.json(
        {
          error: "Email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    await updateUserProfile(params.id, {
      name,
      email,
      role,
      status,
    });

    return NextResponse.json({
      ok: true,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update user.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.success) {
      return auth.response;
    }

    const forbidden = requirePermission(auth.user, PERMISSIONS.USERS_EDIT);

    if (forbidden) {
      return forbidden;
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

    // Prevent deleting yourself
    if (auth.user.userId === user._id.toString()) {
      return NextResponse.json(
        {
          error: "You cannot delete your own account.",
        },
        {
          status: 403,
        },
      );
    }

    await deleteUser(params.id);

    return NextResponse.json({
      ok: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete user.",
      },
      {
        status: 500,
      },
    );
  }
}
