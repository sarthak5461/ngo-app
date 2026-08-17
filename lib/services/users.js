import { getDb, COLLECTIONS } from "@/lib/db";
// import { enGB } from "date-fns/locale";
import { toObjectId } from "@/lib/utils/mongodb";

export async function getUserByEmail(email) {
  const db = await getDb();

  return await db.collection(COLLECTIONS.users).findOne({
    email: email.toLowerCase(),
  });
}

export async function createUser(user) {
  const db = await getDb();

  const result = await db.collection(COLLECTIONS.users).insertOne(user);
  return result;
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

export async function updateUserProfile(id, data) {
  const db = await getDb();

  return db.collection(COLLECTIONS.users).updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role,
        status: data.status,
        updatedAt: new Date(),
      },
    },
  );
}

export async function getUserById(id) {
  const db = await getDb();

  return db.collection(COLLECTIONS.users).findOne({
    _id: toObjectId(id),
  });
}

export async function updateUserPassword(id, passwordHash) {
  const db = await getDb();

  return db.collection(COLLECTIONS.users).updateOne(
    {
      _id: toObjectId(id),
    },
    {
      $set: {
        passwordHash,
        failAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      },
    },
  );
}

export async function deleteUser(id) {
  const db = await getDb();

  return db.collection(COLLECTIONS.users).deleteOne({
    _id: toObjectId(id),
  });
}
