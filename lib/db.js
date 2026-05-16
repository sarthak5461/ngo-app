import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("Missing MONGO_URL");
}

if (!dbName) {
  throw new Error("Missing DB_NAME");
}

let client;
let database;

export async function getDb() {
  if (database) {
    return database;
  }

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  database = client.db(dbName);

  return database;
}

export const COLLECTIONS = {
  donations: "donations",
  donationOrders: "donation_orders",

  members: "members",
  memberOrders: "member_orders",

  volunteers: "volunteers",

  contacts: "contacts",

  csrInquiries: "csr_inquiries",

  contentBlocks: "content_blocks",

  media: "media",

  admins: "admins",

  reports: "reports",
};
