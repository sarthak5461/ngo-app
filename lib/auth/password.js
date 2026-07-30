import argon2 from "argon2";

/**
 * Hash a password before storing it.
 */
export async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
}

/**
 * Verify a password against its hash.
 */
export async function verifyPassword(password, hash) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
