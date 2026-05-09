'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { CheckCircle2, ArrowRight, Shield, Loader2, Printer } from 'lucide-react'
import { NGO_FULL_NAME } from '@/lib/content'

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function DonationDialog({ open, onOpenChange, defaultCause = 'general' }) {
  const [step, setStep] = useState('form') // form | pay | receipt
  const [cause, setCause] = useState(defaultCause)
  const [amount, setAmount] = useState(1000)
  const [customAmt, setCustomAmt] = useState('')
  const [donor, setDonor] = useState({ name: '', email: '', phone: '', pan: '', message: '' })
  const [order, setOrder] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setStep('form')
      setCause(defaultCause)
      setAmount(1000)
      setCustomAmt('')
      setOrder(null)
      setReceipt(null)
    }
  }, [open, defaultCause])

  const finalAmount = customAmt ? parseInt(customAmt, 10) || 0 : amount

  const createOrder = async (e) => {
    e?.preventDefault()
    if (finalAmount < 10) return toast.error('Minimum donation is ₹10')
    if (!donor.name || !donor.email) return toast.error('Please enter your name and email')
    setLoading(true)
    try {
      const r = await fetch('/api/donations/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, cause }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setOrder(d)
      setStep('pay')
    } catch (err) {
      toast.error(err.message || 'Could not start payment')
    } finally { setLoading(false) }
  }

  const completeMockPayment = async () => {
    setLoading(true)
    try {
      const r1 = await fetch('/api/donations/mock-pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId }),
      })
      const d1 = await r1.json()
      if (!r1.ok) throw new Error(d1.error)

      const r2 = await fetch('/api/donations/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: d1.orderId, paymentId: d1.paymentId, signature: d1.signature, donor,
        }),
      })
      const d2 = await r2.json()
      if (!r2.ok) throw new Error(d2.error)
      setReceipt(d2.donation)
      setStep('receipt')
      toast.success('Donation successful — thank you! 🙏')
    } catch (err) {
      toast.error(err.message || 'Payment failed')
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[92vh] overflow-y-auto">
        {step === 'form' && (
          <>
            <div className="gradient-trust text-white p-6">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-[Playfair_Display]">Make a Donation</DialogTitle>
                <DialogDescription className="text-white/80">Your contribution is 80G tax-deductible. Receipt issued instantly.</DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={createOrder} className="p-6 space-y-5">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Choose a cause</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: 'general', l: '🙏 Where needed most' },
                    { k: 'education', l: '🎓 Education' },
                    { k: 'disaster-relief', l: '🚨 Disaster Relief' },
                    { k: 'environment', l: '🌱 Environment' },
                  ].map(o => (
                    <button type="button" key={o.k} onClick={() => setCause(o.k)} className={`px-3 py-2.5 rounded-lg text-sm border transition font-medium ${cause === o.k ? 'bg-blue-50 border-blue-700 text-blue-900' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block">Choose amount (₹)</Label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {PRESET_AMOUNTS.map(a => (
                    <button type="button" key={a} onClick={() => { setAmount(a); setCustomAmt('') }} className={`py-2.5 rounded-lg text-sm font-semibold border transition ${(!customAmt && amount === a) ? 'bg-blue-800 text-white border-blue-800' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}>{a >= 1000 ? `${a/1000}k` : a}</button>
                  ))}
                </div>
                <Input type="number" min={10} placeholder="Custom amount" value={customAmt} onChange={e => setCustomAmt(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label htmlFor="dname">Full Name *</Label><Input id="dname" required value={donor.name} onChange={e => setDonor({ ...donor, name: e.target.value })} className="mt-1.5" /></div>
                <div><Label htmlFor="demail">Email *</Label><Input id="demail" type="email" required value={donor.email} onChange={e => setDonor({ ...donor, email: e.target.value })} className="mt-1.5" /></div>
                <div><Label htmlFor="dphone">Phone</Label><Input id="dphone" value={donor.phone} onChange={e => setDonor({ ...donor, phone: e.target.value })} className="mt-1.5" /></div>
                <div className="col-span-2"><Label htmlFor="dpan">PAN (for 80G receipt &gt;₹2,000)</Label><Input id="dpan" value={donor.pan} onChange={e => setDonor({ ...donor, pan: e.target.value.toUpperCase() })} className="mt-1.5" placeholder="ABCDE1234F" /></div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-12 text-base">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : <>Continue to Pay ₹{finalAmount.toLocaleString('en-IN')} <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
              <p className="text-[11px] text-slate-500 text-center">By donating you agree to our terms. Payments are securely verified server-side.</p>
            </form>
          </>
        )}

        {step === 'pay' && order && (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-[Playfair_Display]">Confirm Payment</DialogTitle>
              <DialogDescription>Razorpay test/mock checkout — real signature verification on backend.</DialogDescription>
            </DialogHeader>
            <Card className="mt-5 border-blue-100 bg-blue-50/40">
              <CardContent className="p-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Order ID</span><span className="font-mono text-xs">{order.orderId}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Cause</span><span className="font-medium capitalize">{cause.replace('-', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Donor</span><span className="font-medium">{donor.name}</span></div>
                <div className="flex justify-between text-lg pt-2 border-t mt-2"><span className="font-semibold">Amount</span><span className="font-bold text-blue-900">₹{finalAmount.toLocaleString('en-IN')}</span></div>
              </CardContent>
            </Card>
            <div className="flex items-center gap-2 mt-4 mb-5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <Shield className="w-4 h-4 shrink-0" />
              <span><strong>Mock mode:</strong> click below to simulate Razorpay success. Backend verifies the HMAC SHA-256 signature exactly like production.</span>
            </div>
            <Button onClick={completeMockPayment} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-bold">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying signature…</> : <>Pay ₹{finalAmount.toLocaleString('en-IN')} via Razorpay (mock)</>}
            </Button>
            <Button variant="ghost" className="w-full mt-2" onClick={() => setStep('form')}>Back</Button>
          </div>
        )}

        {step === 'receipt' && receipt && (
          <div className="p-0">
            <div className="print-receipt p-7">
              <div className="text-center pb-5 border-b">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-3 no-print">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="font-[Playfair_Display] text-2xl font-bold text-slate-900">Donation Receipt</h2>
                <p className="text-sm text-slate-600 mt-1">{NGO_FULL_NAME}</p>
                <p className="text-xs text-slate-500">12A &amp; 80G Certified • Trust Reg: 432/2008</p>
              </div>

              <div className="py-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Receipt No.</span><span className="font-mono font-semibold">{receipt.receiptNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium">{new Date(receipt.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Donor</span><span className="font-medium">{receipt.donorName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium">{receipt.donorEmail}</span></div>
                {receipt.panNumber && <div className="flex justify-between"><span className="text-slate-500">PAN</span><span className="font-mono">{receipt.panNumber}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Cause</span><span className="font-medium capitalize">{receipt.cause.replace('-', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Payment ID</span><span className="font-mono text-xs">{receipt.paymentId}</span></div>
                <div className="flex justify-between text-xl pt-3 border-t"><span className="font-semibold">Total</span><span className="font-bold text-blue-900">₹{receipt.amount.toLocaleString('en-IN')}</span></div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mb-4">
                This contribution qualifies for tax deduction under <strong>Section 80G</strong> of the Income Tax Act, 1961.
              </div>
              <p className="text-center text-slate-700 italic">Thank you for your generosity. 🙏</p>
            </div>

            <div className="p-5 bg-slate-50 flex gap-3 no-print">
              <Button onClick={() => window.print()} variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" /> Print / Save PDF</Button>
              <Button onClick={() => onOpenChange(false)} className="flex-1 gradient-trust text-white">Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
