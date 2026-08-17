import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

const ACCESS_TOKEN_EXPIRY = "7d";

/**
 * Create JWT
 */
export async function createAccessToken(user) {
  return await new SignJWT({
    userId: user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

/**
 * Verify JWT
 */
export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT VERIFY ERROR:", err.message);
    }

    return null;
  }
}
