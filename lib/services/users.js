import { getDb, COLLECTIONS } from "@/lib/db";

export async function getUserByEmail(email) {
  const db = await getDb();

  return await db.collection(COLLECTIONS.users).findOne({
    email: email.toLowerCase(),
  });
}

export async function updateUser(id, update) {
  const db = await getDb();

  return db.collection(COLLECTIONS.users).updateOne(
    { _id: id },
    {
      $set: update,
    },
  );
}
