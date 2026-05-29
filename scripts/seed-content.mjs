import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function run() {
  try {
    const { seedContentBlocks } = await import("../lib/services/index.js");

    const { getDefaultsFromSchemas } = await import("../lib/cms/schemas.js");

    await seedContentBlocks(getDefaultsFromSchemas());

    console.log("Content seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    process.exit(1);
  }
}

run();
