import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request) {
  try {
    const token = request.cookies.get("mkds_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = await verifyAccessToken(token);

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

    return NextResponse.json({
      email: user.email,
      role: user.role,
      userId: user.userId,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user",
      },
      {
        status: 500,
      },
    );
  }
}
