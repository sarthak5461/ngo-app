import { NextResponse } from "next/server";

import {
  listContentBlocks,
  setContentBlock,
  seedContentBlocks,
} from "@/lib/services";

import { getDefaultsFromSchemas } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const rows = await listContentBlocks();

    return NextResponse.json({ rows });
  } catch (e) {
    console.error("CONTENT GET ERROR:", e);

    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { key, value } = await request.json();

    await setContentBlock(key, value, "Admin");

    // Automatically update page timestamp
    const parts = key.split(".");

    if (parts.length >= 3) {
      const pageKey = `${parts[0]}.${parts[1]}.updatedAt`;

      await setContentBlock(pageKey, new Date().toISOString(), "System");
    }
    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    console.error("CONTENT POST ERROR:", e);

    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
