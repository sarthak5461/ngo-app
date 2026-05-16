import { NextResponse } from "next/server";

import {
  listContentBlocks,
  setContentBlock,
  seedContentBlocks,
} from "@/lib/services";

import { getDefaultsFromSchemas } from "@/lib/cms/schemas";

export async function GET() {
  try {
    await seedContentBlocks(getDefaultsFromSchemas());

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

    if (!key) {
      return NextResponse.json({ error: "key required" }, { status: 400 });
    }

    const result = await setContentBlock(key, value, "Admin");

    return NextResponse.json(result);
  } catch (e) {
    console.error("CONTENT POST ERROR:", e);

    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}
