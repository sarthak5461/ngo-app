import { NextResponse } from "next/server";

import { getContentMap } from "@/lib/services";

export async function GET(request) {
  try {
    const url = new URL(request.url);

    const prefix = url.searchParams.get("prefix") || "";

    const content = await getContentMap(prefix);

    return NextResponse.json({
      content,
    });
  } catch (error) {
    console.error("CONTENT API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch content",
      },
      {
        status: 500,
      },
    );
  }
}
