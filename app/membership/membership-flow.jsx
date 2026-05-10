'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Camera, X,
  Shield, Sparkles, Printer, FileCheck2, IdCard, Building2,
} from 'lucide-react'

const PRESETS = [500, 1000, 2500, 5000, 10000]
const OCCUPATIONS = ['Salaried', 'Business', 'Self-employed', 'Student', 'Retired', 'Homemaker', 'Other']

function maskAadhaar(aadhaar) {
  if (!aadhaar) return ''
  const last4 = aadhaar.slice(-4)
  return `XXXX-XXXX-${last4}`
}

export default function MembershipFlow() {
  const [step, setStep] = useState(1) // 1: details, 2: verification, 3: contribution+pay, 4: success
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState(null)

  const [form, setForm] = useState({
    name: '', mobile: '', email: '', address: '', occupation: 'Salaried',
    aadhaar: '', photo: null, photoPreview: '', reason: '',
    contribution: 500,
  })

  const fileRef = useRef(null)
  const onPhoto = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) return toast.error('Photo must be under 2MB')
    const reader = new FileReader()
    reader.onload = () => setForm(p => ({ ...p, photo: reader.result, photoPreview: reader.result }))
    reader.readAsDataURL(f)
  }

  const next1 = (e) => {
    e?.preventDefault()
    if (!form.name || !form.mobile || !form.email || !form.address) return toast.error('Please fill all required fields')
    if (!/^\d{10}$/.test(form.mobile)) return toast.error('Enter a valid 10-digit mobile number')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error('Enter a valid email')
    setStep(2)
    window.scrollTo({ top: window.scrollY - 100, behavior: 'smooth' })
  }

  const next2 = (e) => {
    e?.preventDefault()
    if (!form.aadhaar || !/^\d{12}$/.test(form.aadhaar)) return toast.error('Enter a valid 12-digit Aadhaar number')
    if (!form.reason || form.reason.length < 10) return toast.error('Please tell us why you want to join (at least 10 characters)')
    setStep(3)
    window.scrollTo({ top: window.scrollY - 100, behavior: 'smooth' })
  }

  const submitAndPay = async () => {
    if (form.contribution < 500) return toast.error('Minimum support contribution is ₹500')
    setLoading(true)
    try {
      // 1. Apply (creates pending member + payment order)
      const r1 = await fetch('/api/members/apply', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, mobile: form.mobile, email: form.email,
          address: form.address, occupation: form.occupation,
          aadhaarLast4: form.aadhaar.slice(-4),
          photo: form.photo || null, reason: form.reason,
          amount: form.contribution,
        }),
      })
      const d1 = await r1.json()
      if (!r1.ok) throw new Error(d1.error || 'Application failed')

      // 2. Mock-pay → returns paymentId + signature
      const r2 = await fetch('/api/members/mock-pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: d1.orderId }),
      })
      const d2 = await r2.json()
      if (!r2.ok) throw new Error(d2.error || 'Payment simulation failed')

      // 3. Complete (verifies signature, activates membership)
      const r3 = await fetch('/api/members/complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: d1.id, orderId: d2.orderId, paymentId: d2.paymentId, signature: d2.signature }),
      })
      const d3 = await r3.json()
      if (!r3.ok) throw new Error(d3.error || 'Verification failed')

      setMember(d3.member)
      setStep(4)
      toast.success('Welcome to the family — your membership is active 🙏')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <Card className="border-0 shadow-2xl overflow-hidden">
      {/* Step indicator */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b">
        <div className="grid grid-cols-4">
          {['Your details', 'Verification', 'Contribution', 'Welcome'].map((label, i) => {
            const idx = i + 1
            const active = step === idx
            const done = step > idx
            return (
              <div key={i} className={`px-3 py-4 text-center text-xs sm:text-sm font-semibold border-r last:border-r-0 ${active ? 'bg-white text-blue-900' : done ? 'text-emerald-700' : 'text-slate-400'}`}>
                <div className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs ${active ? 'gradient-trust text-white' : done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : idx}
                </div>
                <span className="hidden sm:block">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <CardContent className="p-7 lg:p-9">
        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={next1} className="space-y-5">
            <div>
              <h2 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-1">Tell us about yourself</h2>
              <p className="text-sm text-slate-500">All fields marked * are required.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><Label htmlFor="m-name">Full name *</Label><Input id="m-name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="As it should appear on your member card" /></div>
              <div><Label htmlFor="m-mob">Mobile number *</Label><Input id="m-mob" required maxLength={10} value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })} className="mt-1.5" placeholder="10-digit Indian mobile" /></div>
              <div><Label htmlFor="m-em">Email *</Label><Input id="m-em" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
              <div className="sm:col-span-2"><Label htmlFor="m-adr">Address *</Label><Textarea id="m-adr" required rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="mt-1.5" placeholder="House, street, city, state, PIN" /></div>
              <div className="sm:col-span-2">
                <Label>Occupation</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1.5">
                  {OCCUPATIONS.map(o => (
                    <button type="button" key={o} onClick={() => setForm({ ...form, occupation: o })} className={`px-2 py-2 text-xs sm:text-sm rounded-lg border font-medium transition ${form.occupation === o ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-2"><Button type="submit" className="gradient-trust text-white h-11 px-7 font-semibold w-full sm:w-auto">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={next2} className="space-y-6">
            <div>
              <h2 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-1">Verification & a few more details</h2>
              <p className="text-sm text-slate-500">Identity check helps us protect the integrity of our member roll.</p>
            </div>

            {/* DigiLocker placeholder */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-blue-800 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-white" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">DigiLocker Identity Verification</h4>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 text-[10px]">Coming soon</Badge>
                  </div>
                  <p className="text-sm text-slate-700">Identity verification powered by DigiLocker integration is rolling out shortly. Until then, kindly enter your Aadhaar — only the last 4 digits are stored, in masked form.</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="m-aad">Aadhaar number *</Label>
              <Input id="m-aad" required maxLength={12} value={form.aadhaar} onChange={e => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, '') })} className="mt-1.5 font-mono" placeholder="12-digit Aadhaar" />
              {form.aadhaar.length === 12 && (
                <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Will be stored as <span className="font-mono">{maskAadhaar(form.aadhaar)}</span></p>
              )}
            </div>

            <div>
              <Label>Member photo (optional)</Label>
              <div className="mt-1.5 flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {form.photoPreview
                    ? <img src={form.photoPreview} alt="preview" className="w-full h-full object-cover" />
                    : <Camera className="w-7 h-7 text-slate-400" />}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" /> {form.photoPreview ? 'Change photo' : 'Upload photo'}</Button>
                  {form.photoPreview && <Button type="button" variant="ghost" onClick={() => setForm({ ...form, photo: null, photoPreview: '' })} className="ml-1"><X className="w-4 h-4 mr-1" /> Remove</Button>}
                  <p className="text-xs text-slate-500 mt-2">JPG/PNG, max 2MB. Will be printed on your member ID card.</p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="m-why">Why do you want to join? *</Label>
              <Textarea id="m-why" required rows={4} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="mt-1.5" placeholder="A few sentences about what brings you to the Trust." />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button type="submit" className="gradient-trust text-white h-11 px-7 font-semibold">Continue to Contribution <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-1">Your support contribution</h2>
              <p className="text-sm text-slate-500">A token contribution \u2014 minimum ₹500. 80G tax exempt. Receipt issued instantly.</p>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Choose an amount</Label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESETS.map(a => (
                  <button type="button" key={a} onClick={() => setForm({ ...form, contribution: a })} className={`py-3 rounded-lg text-sm font-semibold border transition ${form.contribution === a ? 'bg-blue-800 text-white border-blue-800' : 'border-slate-200 text-slate-700 hover:border-blue-300'}`}>{a >= 1000 ? `${a / 1000}k` : a}</button>
                ))}
              </div>
              <Input type="number" min={500} value={form.contribution} onChange={e => setForm({ ...form, contribution: parseInt(e.target.value, 10) || 0 })} placeholder="Or enter custom amount (min ₹500)" />
            </div>

            {/* Summary */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Member name</span><span className="font-medium">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Email</span><span className="font-medium">{form.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Mobile</span><span className="font-medium">{form.mobile}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Aadhaar</span><span className="font-mono text-xs">{maskAadhaar(form.aadhaar)}</span></div>
                <div className="flex justify-between text-lg pt-3 border-t mt-3"><span className="font-semibold">Support contribution</span><span className="font-bold text-blue-900">₹{form.contribution.toLocaleString('en-IN')}</span></div>
              </CardContent>
            </Card>

            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Mock mode:</strong> click below to simulate a Razorpay payment. Backend will verify the HMAC SHA-256 signature exactly as it will in production.</span>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={loading}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button onClick={submitAndPay} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-7 font-bold">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</> : <>Pay ₹{form.contribution.toLocaleString('en-IN')} via Razorpay (mock)</>}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4 — Member ID Card */}
        {step === 4 && member && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4 no-print">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900 mb-2">Welcome, {member.name.split(' ')[0]} 🙏</h2>
              <p className="text-slate-600">Your membership is active. Here is your digital member card \u2014 print or save it for your records.</p>
            </div>

            {/* The card */}
            <div className="print-receipt">
              <div className="rounded-2xl overflow-hidden shadow-2xl border max-w-md mx-auto bg-white">
                <div className="gradient-trust text-white p-6 relative">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="text-[10px] tracking-widest text-amber-300 mb-1">SHREE JAGANNATH SWAMI BHAKT SHIROMADI</div>
                      <div className="font-[Playfair_Display] font-bold text-lg leading-tight">Maa Karma Devi Sangh Trust</div>
                      <div className="text-[10px] text-white/70">Member Identity Card</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center"><Sparkles className="w-5 h-5 text-amber-300" /></div>
                  </div>
                  <div className="text-3xl font-mono font-bold tracking-wider">{member.memberId}</div>
                </div>
                <div className="p-6">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="w-20 h-20 rounded-lg bg-slate-100 overflow-hidden border-2 border-blue-100 shrink-0">
                      {member.photo ? <img src={member.photo} alt="member" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Camera className="w-7 h-7" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 leading-tight truncate">{member.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{member.occupation}</div>
                      <Badge className="bg-amber-100 text-amber-900 border-amber-200">Active Member</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t">
                    <div><div className="text-slate-500">Valid from</div><div className="font-semibold text-slate-900">{new Date(member.validFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div>
                    <div><div className="text-slate-500">Valid until</div><div className="font-semibold text-blue-900">{new Date(member.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div>
                    <div className="col-span-2"><div className="text-slate-500">Receipt no.</div><div className="font-mono text-slate-900">{member.receiptNumber}</div></div>
                  </div>
                  <div className="mt-4 pt-4 border-t text-[10px] text-slate-500 leading-relaxed">
                    This card is the property of Maa Karma Devi Sangh Trust. Membership is valid for 12 months from the date of activation and is renewable. Tax exemption under Section 80G of the Income Tax Act, 1961.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2 no-print">
              <Button onClick={() => window.print()} variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" /> Print / Save PDF</Button>
              <Button asChild className="flex-1 gradient-trust text-white"><a href="/programs"><FileCheck2 className="w-4 h-4 mr-2" /> Explore programs</a></Button>
            </div>

            <p className="text-center text-xs text-slate-500 max-w-md mx-auto">A welcome email and receipt will reach <strong>{member.email}</strong> shortly. We will also send your first quarterly impact report by post.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
