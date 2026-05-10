import { getDb, COLLECTIONS } from '@/lib/db'

function stripIds(rows) {
  return rows.map(r => { const { _id, ...rest } = r; return rest })
}

export async function listDonations({ search = '', cause = 'all', limit = 200 } = {}) {
  const db = await getDb()
  const q = { status: 'success' }
  if (cause && cause !== 'all') q.cause = cause
  if (search) {
    q.$or = [
      { donorName: { $regex: search, $options: 'i' } },
      { donorEmail: { $regex: search, $options: 'i' } },
      { receiptNumber: { $regex: search, $options: 'i' } },
    ]
  }
  const rows = await db.collection(COLLECTIONS.donations).find(q).sort({ createdAt: -1 }).limit(limit).toArray()
  return stripIds(rows)
}

export async function listMembers({ search = '', status = 'all', limit = 200 } = {}) {
  const db = await getDb()
  const q = {}
  if (status && status !== 'all') q.status = status
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { memberId: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
    ]
  }
  const rows = await db.collection(COLLECTIONS.members).find(q).sort({ createdAt: -1 }).limit(limit).toArray()
  return stripIds(rows)
}

export async function listVolunteers({ search = '', interest = 'all', limit = 200 } = {}) {
  const db = await getDb()
  const q = {}
  if (interest && interest !== 'all') q.interest = interest
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
    ]
  }
  const rows = await db.collection(COLLECTIONS.volunteers).find(q).sort({ createdAt: -1 }).limit(limit).toArray()
  return stripIds(rows)
}

export async function listContacts({ search = '', kind = 'all', limit = 200 } = {}) {
  // kind: 'all' | 'general' | 'csr'
  const db = await getDb()
  const q = {}
  if (kind === 'csr') q.subject = { $regex: 'CSR', $options: 'i' }
  if (kind === 'general') q.$nor = [{ subject: { $regex: 'CSR', $options: 'i' } }]
  if (search) {
    const sq = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ]
    if (q.$or) q.$and = [{ $or: q.$or }, { $or: sq }]
    else q.$or = sq
  }
  const rows = await db.collection(COLLECTIONS.contacts).find(q).sort({ createdAt: -1 }).limit(limit).toArray()
  return stripIds(rows)
}

export async function getDashboardStats() {
  const db = await getDb()
  const [donations, members, volunteers, contacts] = await Promise.all([
    db.collection(COLLECTIONS.donations).find({ status: 'success' }).toArray(),
    db.collection(COLLECTIONS.members).find({}).toArray(),
    db.collection(COLLECTIONS.volunteers).countDocuments({}),
    db.collection(COLLECTIONS.contacts).find({}).toArray(),
  ])
  const totalRaised = donations.reduce((s, d) => s + (d.amount || 0), 0)
  const memberContributions = members.filter(m => m.status === 'active').reduce((s, m) => s + (m.amount || 0), 0)
  const activeMembers = members.filter(m => m.status === 'active').length
  const csrCount = contacts.filter(c => /CSR/i.test(c.subject || '')).length
  return {
    totalRaised,
    donationCount: donations.length,
    activeMembers,
    pendingMembers: members.filter(m => m.status === 'pending_payment').length,
    memberContributions,
    volunteerCount: volunteers,
    csrCount,
    contactCount: contacts.length - csrCount,
  }
}

// Content blocks (CMS) ---------------------------------------------------
export async function getContentBlock(key, fallback = '') {
  const db = await getDb()
  const doc = await db.collection(COLLECTIONS.contentBlocks).findOne({ key })
  return doc?.value ?? fallback
}

export async function listContentBlocks() {
  const db = await getDb()
  const rows = await db.collection(COLLECTIONS.contentBlocks).find({}).toArray()
  return stripIds(rows)
}

export async function setContentBlock(key, value, updatedBy = 'admin') {
  const db = await getDb()
  await db.collection(COLLECTIONS.contentBlocks).updateOne(
    { key },
    { $set: { key, value, updatedBy, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  )
  return { key, value }
}

// Media library ----------------------------------------------------------
export async function listMedia({ limit = 100 } = {}) {
  const db = await getDb()
  const rows = await db.collection(COLLECTIONS.media).find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  return stripIds(rows)
}

export async function addMedia({ id, name, mimeType, size, dataUrl, uploadedBy }) {
  const db = await getDb()
  const doc = { id, name, mimeType, size, dataUrl, uploadedBy: uploadedBy || 'admin', createdAt: new Date() }
  await db.collection(COLLECTIONS.media).insertOne(doc)
  const { _id, ...clean } = doc
  return clean
}

export async function deleteMedia(id) {
  const db = await getDb()
  await db.collection(COLLECTIONS.media).deleteOne({ id })
  return { ok: true }
}
