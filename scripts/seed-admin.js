import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

async function seedAdmin() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);

    const users = db.collection("users");

    const existing = await users.findOne({
      role: "super_admin",
    });

    if (existing) {
      console.log("✓ Super Admin already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

    await users.insertOne({
      name: "Administrator",
      email: "admin@example.com",
      passwordHash,
      role: "super_admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✓ Super Admin created successfully.");
    console.log("Email: admin@example.com");
    console.log("Password: ChangeMe123!");
    console.log("⚠ Change the password immediately after first login.");
  } finally {
    await client.close();
  }
}

seedAdmin().catch(console.error);
