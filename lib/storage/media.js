// File-system based media storage.
// Files are saved under /app/public/uploads/{uuid}.{ext} so Next.js can
// serve them as static assets at /uploads/{uuid}.{ext}.
//
// Why disk + DB-metadata instead of base64-in-DB?
//   - MongoDB BSON document max size is 16 MB → base64 of even a single
//     hi-res image easily breaches that.
//   - Static file serving by Next.js is dramatically faster than streaming
//     a base64 data-URI from the API on every request.
//   - Drop-in path to swap in S3 / Cloudinary later (just replace this file).

import { writeFile, unlink, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const PUBLIC_PREFIX = '/uploads'

const SAFE_EXT = /^(jpg|jpeg|png|gif|webp|svg|avif)$/i

function extFromName(name = '', mimeType = '') {
  const dot = name.lastIndexOf('.')
  let ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
  if (!ext || !SAFE_EXT.test(ext)) {
    if (mimeType.includes('jpeg')) ext = 'jpg'
    else if (mimeType.includes('png')) ext = 'png'
    else if (mimeType.includes('gif')) ext = 'gif'
    else if (mimeType.includes('webp')) ext = 'webp'
    else if (mimeType.includes('svg')) ext = 'svg'
    else if (mimeType.includes('avif')) ext = 'avif'
    else ext = 'bin'
  }
  return ext
}

export async function saveBufferToDisk(buffer, { id, name, mimeType }) {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext = extFromName(name, mimeType)
  const filename = `${id}.${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)
  await writeFile(filepath, buffer)
  return { url: `${PUBLIC_PREFIX}/${filename}`, filename, filepath }
}

// Decode a data URL like "data:image/png;base64,iVBOR..." into a Buffer.
export function bufferFromDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') return null
  const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl)
  if (!m) return null
  return { mimeType: m[1], buffer: Buffer.from(m[2], 'base64') }
}

export async function deleteFileForUrl(url) {
  if (!url || !url.startsWith(PUBLIC_PREFIX + '/')) return false
  const filename = url.slice((PUBLIC_PREFIX + '/').length)
  // Disallow path traversal
  if (filename.includes('/') || filename.includes('..')) return false
  const filepath = path.join(UPLOAD_DIR, filename)
  try { await unlink(filepath); return true } catch { return false }
}
