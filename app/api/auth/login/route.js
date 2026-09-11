import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { getUserByEmail, updateUser } from "@/lib/services/users";
import { verifyPassword } from "@/lib/auth/password";
import { createAccessToken } from "@/lib/auth/jwt";

export async function POST(request) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit({
      request,
      key: "public-login",
      limit: 5,
      windowSeconds: 15 * 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

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

    // Don't reveal whether the email exists
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

    // Account lock check
    if (
      user.lockedUntil &&
      new Date(user.lockedUntil) > new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "Your account is temporarily locked. Please try again later.",
        },
        {
          status: 423,
        },
      );
    }

    // Account status
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

    // Password verification
    const valid = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!valid) {
      const attempts = (user.failedAttempts || 0) + 1;

      const update = {
        failedAttempts: attempts,
        updatedAt: new Date(),
      };

      if (attempts >= 5) {
        update.lockedUntil = new Date(
          Date.now() + 15 * 60 * 1000,
        );
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

    // Successful login
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
        name: user.name,
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
    console.error("AUTH LOGIN ERROR:", error);

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