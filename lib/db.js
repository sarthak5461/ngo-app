import { MongoClient } from 'mongodb'

let client
let db

export async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Collection helpers — single source of truth for collection names
export const COLLECTIONS = {
  donations: 'donations',
  donationOrders: 'donation_orders',
  members: 'members',
  memberOrders: 'member_orders',
  volunteers: 'volunteers',
  contacts: 'contact_messages',
  csrInquiries: 'contact_messages',  // CSR are tagged contacts (subject contains 'CSR')
  contentBlocks: 'content_blocks',
  media: 'media',
  admins: 'admins',
  reports: 'reports',
}
