import { getDb, COLLECTIONS } from "@/lib/db";

let indexPromise;

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

async function ensureIndexes(collection) {
  if (!indexPromise) {
    indexPromise = collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
  }

  await indexPromise;
}

export async function checkRateLimit({
  request,
  key,
  limit,
  windowSeconds,
}) {
  const db = await getDb();
  const collection = db.collection(COLLECTIONS.rateLimits);

  await ensureIndexes(collection);

  const ip = getClientIp(request);

  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const windowStart =
    Math.floor(now / windowMs) * windowMs;

  const windowEnd = windowStart + windowMs;

  const recordId = `${key}:${ip}:${windowStart}`;

  const result = await collection.findOneAndUpdate(
    {
      _id: recordId,
    },
    {
      $inc: {
        count: 1,
      },
      $setOnInsert: {
        key,
        ip,
        windowStart: new Date(windowStart),
        expiresAt: new Date(windowEnd),
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  // MongoDB driver versions can return the document
  // directly or inside a "value" property.
  const document = result?.value ?? result;

  const count = document?.count ?? 0;

  const remaining = Math.max(limit - count, 0);

  const retryAfter = Math.max(
    Math.ceil((windowEnd - Date.now()) / 1000),
    1,
  );

  return {
    success: count <= limit,
    limit,
    remaining,
    retryAfter,
  };
}