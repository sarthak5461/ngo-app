import { NextResponse } from "next/server";

import { getUserByEmail, updateUser } from "@/lib/services/users";

import { verifyPassword } from "@/lib/auth/password";

import { createAccessToken } from "@/lib/auth/jwt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        {
          status: 400,
        },
      );
    }

    const user = await getUserByEmail(email);

    // console.log("Email entered:", email);
    // console.log("User found:", user);

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json(
        {
          error: "Your account is temporarily locked. Please try again later.",
        },
        {
          status: 423,
        },
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        {
          error: "Account is inactive.",
        },
        {
          status: 403,
        },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    // console.log("Password valid:", valid);

    if (!valid) {
      const attempts = (user.failedAttempts || 0) + 1;

      const update = {
        failedAttempts: attempts,
        updatedAt: new Date(),
      };

      if (attempts >= 5) {
        update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await updateUser(user._id, update);

      return NextResponse.json(
        {
          error:
            attempts >= 5
              ? "Account locked for 15 minutes due to multiple failed login attempts."
              : "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    const token = await createAccessToken(user);

    await updateUser(user._id, {
      lastLogin: new Date(),
      failedAttempts: 0,
      lockedUntil: null,
      updatedAt: new Date(),
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: "mkds_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Login failed.",
      },
      {
        status: 500,
      },
    );
  }
}
