import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// ────────────────────────────────────────────────────────────
//  Maa Karma Devi Sangh Trust  •  API Routes
// ────────────────────────────────────────────────────────────
//  All endpoints are mounted under /api/* via the catch-all.
//  MongoDB collections used:
//    - donations       (every successful donation)
//    - donation_orders (created but not yet paid)
//    - volunteers
//    - contact_messages
// ────────────────────────────────────────────────────────────

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ────────────────────────────────────────────────────────────
//  RAZORPAY (MOCKED) — production swap-in instructions inline
// ────────────────────────────────────────────────────────────
//  In production:
//    1. import Razorpay from 'razorpay'
//    2. const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
//    3. /create-order  → const order = await rzp.orders.create({ amount, currency:'INR', receipt })
//    4. Frontend opens Razorpay Checkout with order.id + key_id
//    5. On Razorpay success handler → POST /verify with {razorpay_order_id, razorpay_payment_id, razorpay_signature}
//    6. /verify recomputes  HMAC_SHA256(secret, order_id + '|' + payment_id)  and compares.
//
//  We use the SAME signature pattern below with a mock secret, so swapping
//  to real Razorpay is a 5-line change.
// ────────────────────────────────────────────────────────────

const MOCK_RAZORPAY_KEY_ID = 'rzp_test_MOCK_DEMO_KEY'
const MOCK_RAZORPAY_SECRET = 'MOCK_DEMO_SECRET_DO_NOT_USE_IN_PROD'

function signRazorpay(orderId, paymentId, secret = MOCK_RAZORPAY_SECRET) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}

function verifyRazorpaySignature(orderId, paymentId, signature, secret = MOCK_RAZORPAY_SECRET) {
  const expected = signRazorpay(orderId, paymentId, secret)
  // Constant-time compare to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

function newReceiptNumber() {
  const yr = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `MKDS/${yr}/${rand}`
}

// ────────────────────────────────────────────────────────────
//  ROUTE HANDLER
// ────────────────────────────────────────────────────────────
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // ── Health
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Maa Karma Devi Sangh Trust API is running', ok: true }))
    }

    // ── Public stats (used on impact section)
    if (route === '/stats' && method === 'GET') {
      const donations = await db.collection('donations').find({ status: 'success' }).toArray()
      const totalRaised = donations.reduce((s, d) => s + (d.amount || 0), 0)
      const donorCount = new Set(donations.map(d => d.email)).size
      const volunteerCount = await db.collection('volunteers').countDocuments({})
      const projectsCount = donations.length > 0 ? Math.max(12, Math.ceil(donations.length / 3)) : 12
      return handleCORS(NextResponse.json({
        totalRaised,
        donationCount: donations.length,
        donorCount,
        volunteerCount,
        projectsCount,
        livesImpacted: 4200 + donations.length * 18,
      }))
    }

    // ── DONATIONS ─────────────────────────────────────────
    // Step 1: create order
    if (route === '/donations/create-order' && method === 'POST') {
      const body = await request.json()
      const amount = parseInt(body.amount, 10)
      const cause = body.cause || 'general'
      if (!amount || amount < 10) {
        return handleCORS(NextResponse.json({ error: 'Minimum donation is ₹10' }, { status: 400 }))
      }
      const orderId = `order_${uuidv4().replace(/-/g, '').slice(0, 20)}`
      const orderDoc = {
        id: uuidv4(),
        orderId,
        amount,
        cause,
        currency: 'INR',
        status: 'created',
        createdAt: new Date(),
      }
      await db.collection('donation_orders').insertOne(orderDoc)
      return handleCORS(NextResponse.json({
        orderId,
        amount,
        currency: 'INR',
        keyId: MOCK_RAZORPAY_KEY_ID,
        // NOTE: in real Razorpay the signature is generated AFTER payment by Razorpay servers.
        // Here we expose a way for the mock checkout to obtain a valid pair.
        mock: true,
      }))
    }

    // Step 2 (mock-only helper): simulate Razorpay checkout success → returns paymentId + signature
    if (route === '/donations/mock-pay' && method === 'POST') {
      const body = await request.json()
      const { orderId } = body
      const order = await db.collection('donation_orders').findOne({ orderId })
      if (!order) {
        return handleCORS(NextResponse.json({ error: 'Order not found' }, { status: 404 }))
      }
      const paymentId = `pay_${uuidv4().replace(/-/g, '').slice(0, 20)}`
      const signature = signRazorpay(orderId, paymentId)
      return handleCORS(NextResponse.json({ paymentId, signature, orderId }))
    }

    // Step 3: verify + persist donation + return receipt
    if (route === '/donations/verify' && method === 'POST') {
      const body = await request.json()
      const { orderId, paymentId, signature, donor = {} } = body
      if (!orderId || !paymentId || !signature) {
        return handleCORS(NextResponse.json({ error: 'Missing payment fields' }, { status: 400 }))
      }
      const order = await db.collection('donation_orders').findOne({ orderId })
      if (!order) {
        return handleCORS(NextResponse.json({ error: 'Invalid order' }, { status: 404 }))
      }
      const valid = verifyRazorpaySignature(orderId, paymentId, signature)
      if (!valid) {
        await db.collection('donations').insertOne({
          id: uuidv4(), orderId, paymentId, status: 'failed', reason: 'signature_mismatch', createdAt: new Date(),
        })
        return handleCORS(NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 }))
      }

      const donation = {
        id: uuidv4(),
        receiptNumber: newReceiptNumber(),
        orderId,
        paymentId,
        amount: order.amount,
        currency: order.currency || 'INR',
        cause: order.cause,
        donorName: donor.name || 'Anonymous',
        donorEmail: donor.email || '',
        donorPhone: donor.phone || '',
        donorMessage: donor.message || '',
        panNumber: donor.pan || '',
        status: 'success',
        createdAt: new Date(),
      }
      await db.collection('donations').insertOne(donation)
      await db.collection('donation_orders').updateOne({ orderId }, { $set: { status: 'paid', paidAt: new Date() } })

      // Strip Mongo _id before returning
      const { _id, ...clean } = donation
      return handleCORS(NextResponse.json({ success: true, donation: clean }))
    }

    // Get receipt by id (for re-printing)
    if (route.startsWith('/donations/receipt/') && method === 'GET') {
      const id = route.replace('/donations/receipt/', '')
      const donation = await db.collection('donations').findOne({ id })
      if (!donation) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      const { _id, ...clean } = donation
      return handleCORS(NextResponse.json(clean))
    }

    // Recent donations (anonymised) — for social proof on the site
    if (route === '/donations/recent' && method === 'GET') {
      const docs = await db.collection('donations')
        .find({ status: 'success' })
        .sort({ createdAt: -1 })
        .limit(8)
        .toArray()
      const cleaned = docs.map(d => ({
        firstName: (d.donorName || 'Anonymous').split(' ')[0],
        amount: d.amount,
        cause: d.cause,
        createdAt: d.createdAt,
      }))
      return handleCORS(NextResponse.json(cleaned))
    }

    // ── VOLUNTEER SIGNUP ──────────────────────────────────
    if (route === '/volunteer' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.email) {
        return handleCORS(NextResponse.json({ error: 'Name and email required' }, { status: 400 }))
      }
      const doc = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        city: body.city || '',
        interest: body.interest || 'general',
        message: body.message || '',
        createdAt: new Date(),
      }
      await db.collection('volunteers').insertOne(doc)
      const { _id, ...clean } = doc
      return handleCORS(NextResponse.json({ success: true, volunteer: clean }))
    }

    // ── CONTACT FORM ─────────────────────────────────────
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.email || !body.message) {
        return handleCORS(NextResponse.json({ error: 'All fields are required' }, { status: 400 }))
      }
      const doc = {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        subject: body.subject || 'General Enquiry',
        message: body.message,
        createdAt: new Date(),
      }
      await db.collection('contact_messages').insertOne(doc)
      const { _id, ...clean } = doc
      return handleCORS(NextResponse.json({ success: true, contact: clean }))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
