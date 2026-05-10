// Cookie-based admin session — PLACEHOLDER auth.
// In production: swap with JWT verification, SSO, or OTP-based session middleware.

import { ROLES } from './rbac'

const COOKIE_NAME = 'mkds_admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function encode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url')
}

function decode(token) {
  try { return JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) }
  catch { return null }
}

export function createSessionToken(payload) {
  const sig = process.env.ADMIN_SESSION_SECRET || 'dev-secret'
  return encode({ ...payload, iat: Date.now(), s: sig.slice(0, 8) })
}

export function verifySessionToken(token) {
  if (!token) return null
  const decoded = decode(token)
  if (!decoded) return null
  const sig = process.env.ADMIN_SESSION_SECRET || 'dev-secret'
  if (decoded.s !== sig.slice(0, 8)) return null
  if (Date.now() - (decoded.iat || 0) > MAX_AGE * 1000) return null
  return decoded
}

export function checkAdminPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || 'admin123'
  return password === expected
}

export function getSessionFromRequest(request) {
  const c = request.cookies?.get?.(COOKIE_NAME)?.value
  return verifySessionToken(c)
}

export function buildSetCookieHeader(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`
}

export function buildClearCookieHeader() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export { COOKIE_NAME, ROLES }
