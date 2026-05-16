import { getDb, COLLECTIONS } from "@/lib/db";

function stripIds(rows) {
  return rows.map((r) => {
    const { _id, ...rest } = r;
    return rest;
  });
}

export async function listDonations({
  search = "",
  cause = "all",
  limit = 200,
} = {}) {
  const database = await getDb();
  const q = { status: "success" };
  if (cause && cause !== "all") q.cause = cause;
  if (search) {
    q.$or = [
      { donorName: { $regex: search, $options: "i" } },
      { donorEmail: { $regex: search, $options: "i" } },
      { receiptNumber: { $regex: search, $options: "i" } },
    ];
  }
  const rows = await database
    .collection(COLLECTIONS.donations)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return stripIds(rows);
}

export async function listMembers({
  search = "",
  status = "all",
  limit = 200,
} = {}) {
  const database = await getDb();
  const q = {};
  if (status && status !== "all") q.status = status;
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { memberId: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
    ];
  }
  const rows = await database
    .collection(COLLECTIONS.members)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return stripIds(rows);
}

export async function listVolunteers({
  search = "",
  interest = "all",
  limit = 200,
} = {}) {
  const database = await getDb();
  const q = {};
  if (interest && interest !== "all") q.interest = interest;
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }
  const rows = await database
    .collection(COLLECTIONS.volunteers)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return stripIds(rows);
}

export async function listContacts({
  search = "",
  kind = "all",
  limit = 200,
} = {}) {
  // kind: 'all' | 'general' | 'csr'
  const database = await getDb();
  const q = {};
  if (kind === "csr") q.subject = { $regex: "CSR", $options: "i" };
  if (kind === "general")
    q.$nor = [{ subject: { $regex: "CSR", $options: "i" } }];
  if (search) {
    const sq = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
    if (q.$or) q.$and = [{ $or: q.$or }, { $or: sq }];
    else q.$or = sq;
  }
  const rows = await database
    .collection(COLLECTIONS.contacts)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return stripIds(rows);
}

export async function getDashboardStats() {
  const database = await getDb();
  const [donations, members, volunteerCount, contactCount, csrCount] =
    await Promise.all([
      database
        .collection(COLLECTIONS.donations)
        .find({ status: "success" })
        .toArray(),

      database.collection(COLLECTIONS.members).find({}).toArray(),

      database.collection(COLLECTIONS.volunteers).countDocuments({}),

      database.collection(COLLECTIONS.contacts).countDocuments({}),

      database.collection(COLLECTIONS.csrInquiries).countDocuments({}),
    ]);

  const totalRaised = donations.reduce((s, d) => s + (d.amount || 0), 0);

  const memberContributions = members
    .filter((m) => m.status === "active")
    .reduce((s, m) => s + (m.amount || 0), 0);

  const activeMembers = members.filter((m) => m.status === "active").length;

  return {
    totalRaised,

    donationCount: donations.length,

    activeMembers,

    pendingMembers: members.filter((m) => m.status === "pending_payment")
      .length,

    memberContributions,

    volunteerCount,

    csrCount,

    contactCount,
  };
}

// Content blocks (CMS) ---------------------------------------------------
export async function getContentBlock(key, fallback = "") {
  const database = await getDb();
  const doc = await database
    .collection(COLLECTIONS.contentBlocks)
    .findOne({ key });
  return doc?.value ?? fallback;
}

export async function listContentBlocks() {
  const database = await getDb();
  const rows = await database
    .collection(COLLECTIONS.contentBlocks)
    .find({})
    .toArray();
  return stripIds(rows);
}

export async function setContentBlock(key, value, updatedBy = "admin") {
  const database = await getDb();
  await database.collection(COLLECTIONS.contentBlocks).updateOne(
    { key },
    {
      $set: { key, value, updatedBy, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  return { key, value };
}

// Seed the content_blocks collection from a defaults map ({ key: value }).
// Only inserts keys that don't already exist in the DB — safe to call any time.
// Returns the count of new keys inserted.
export async function seedContentBlocks(defaults = {}) {
  if (!defaults || typeof defaults !== "object") {
    console.error("Invalid defaults passed to seedContentBlocks");
    return 0;
  }
  const database = await getDb();
  const existing = await database
    .collection(COLLECTIONS.contentBlocks)
    .find({}, { projection: { key: 1 } })
    .toArray();
  const existingKeys = new Set(existing.map((r) => r.key));
  const toInsert = [];
  for (const [key, value] of Object.entries(defaults)) {
    if (existingKeys.has(key)) continue;
    toInsert.push({
      key,
      value,
      updatedBy: "system_seed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  if (toInsert.length > 0) {
    await database.collection(COLLECTIONS.contentBlocks).insertMany(toInsert);
  }
  return toInsert.length;
}

export async function getContentMap(prefix = "") {
  const database = await getDb();

  const q = prefix
    ? {
        key: {
          $regex: `^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        },
      }
    : {};

  const rows = await database
    .collection(COLLECTIONS.contentBlocks)
    .find(q)
    .toArray();

  const out = {};

  for (const r of rows) {
    out[r.key] = r.value;
  }

  return out;
}

// Media library ----------------------------------------------------------
export async function listMedia({ limit = 100, search = "" } = {}) {
  const database = await getDb();
  const q = search ? { name: { $regex: search, $options: "i" } } : {};
  const rows = await database
    .collection(COLLECTIONS.media)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return stripIds(rows);
}

export async function addMedia({
  id,
  name,
  mimeType,
  size,
  url,
  dataUrl,
  uploadedBy,
}) {
  const database = await getDb();
  const doc = {
    id,
    name,
    mimeType,
    size,
    // Either a static-file URL (preferred) or a base64 dataUrl (legacy).
    ...(url ? { url } : {}),
    ...(dataUrl ? { dataUrl } : {}),
    uploadedBy: uploadedBy || "admin",
    createdAt: new Date(),
  };
  await database.collection(COLLECTIONS.media).insertOne(doc);
  const { _id, ...clean } = doc;
  return clean;
}

export async function getMediaById(id) {
  const database = await getDb();
  const doc = await database.collection(COLLECTIONS.media).findOne({ id });
  if (!doc) return null;
  const { _id, ...clean } = doc;
  return clean;
}

export async function deleteMedia(id) {
  const database = await getDb();
  await database.collection(COLLECTIONS.media).deleteOne({ id });
  return { ok: true };
}
