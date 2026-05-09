'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Heart, GraduationCap, LifeBuoy, Leaf, Users, Phone, Mail, MapPin,
  CheckCircle2, ArrowRight, Quote, Shield, Sparkles, Loader2,
  HandHeart, Building2, Award, Calendar,
} from 'lucide-react'
import SiteShell from '@/components/site/site-shell'
import { useDonate } from '@/components/site/donate-provider'
import { IMG, NGO_FULL_NAME, PROGRAMS, BLOG_POSTS, CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf }

const TESTIMONIALS = [
  { name: 'Sushila Devi', role: 'Mother, Bhubaneswar', quote: "When the cyclone took our home, the Trust's volunteers reached us before anyone else. They gave us food, medicines and hope." },
  { name: 'Rajesh Mahapatra', role: 'School Principal, Cuttack', quote: 'Because of the scholarship programme, fourteen of my students returned to class this year. This is real, measurable change.' },
  { name: 'Anjali Sahu', role: 'Volunteer, Kolkata', quote: 'I started by helping in one tree-plantation drive. Two years on, this Trust has become my family. Pure service, zero politics.' },
]

// ───────────────────────────────────────────────────────────────────────────
//  HERO
// ───────────────────────────────────────────────────────────────────────────
function Hero() {
  const { open } = useDonate()
  return (
    <section id="home" className="relative h-[100vh] min-h-[680px] w-full overflow-hidden">
      <img src={IMG.hero} alt="Volunteers from Maa Karma Devi Sangh Trust serving the community" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative container h-full flex flex-col justify-center pt-20">
        <div className="max-w-3xl animate-fade-up">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Registered NGO • Serving since 2008
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl sm:text-6xl lg:text-7xl font-bold text-white text-balance leading-[1.05] mb-5">
            Hope has a <span className="text-amber-400">home.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/85 mb-2 max-w-2xl"><span className="font-semibold text-white">{NGO_FULL_NAME}</span></p>
          <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl text-balance">
            Empowering India&apos;s most vulnerable communities through <span className="text-amber-300 font-semibold">Education</span>, <span className="text-amber-300 font-semibold">Disaster Relief</span> and <span className="text-amber-300 font-semibold">Environmental Action</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => open()} size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-xl shadow-amber-500/30 h-12 px-7">
              <Heart className="w-5 h-5 mr-2 fill-current" /> Donate Now
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm h-12 px-7">
              <a href="#volunteer"><Users className="w-5 h-5 mr-2" /> Become a Volunteer</a>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white/90 text-sm"><Shield className="w-4 h-4 text-amber-300" /> 80G Tax Exempted</div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white/90 text-sm"><Award className="w-4 h-4 text-amber-300" /> 17 Years of Service</div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white/90 text-sm"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 100% Transparent</div>
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  ABOUT (teaser)
// ───────────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative">
          <img src={IMG.about} alt="Community we serve" className="rounded-2xl shadow-2xl w-full aspect-[4/5] object-cover" />
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-6 py-5 border max-w-[250px] hidden md:block">
            <div className="text-3xl font-bold text-blue-900">17+</div>
            <div className="text-sm text-slate-600">Years of selfless service to the underprivileged</div>
          </div>
          <div className="absolute -top-6 -left-6 gradient-trust text-white rounded-2xl shadow-xl px-6 py-5 max-w-[200px] hidden md:block">
            <div className="text-3xl font-bold">4,200+</div>
            <div className="text-sm text-white/90">Lives transformed</div>
          </div>
        </div>

        <div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">About Us</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            A Trust born of devotion, <span className="text-blue-800">grown by service.</span>
          </h2>
          <p className="text-slate-600 text-lg mb-4 leading-relaxed">
            Founded in <strong>2008</strong> in the holy land of Odisha, <strong>{NGO_FULL_NAME}</strong> began as a small community kitchen serving the elderly and homeless near the temples of Puri.
          </p>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Today, we are a pan-India movement working across <strong className="text-blue-800">three pillars</strong> — Education, Disaster Relief and Environmental Action — guided by the timeless values of <em>seva</em>, transparency and compassion.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-7">
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Registered Trust under Indian Trust Act 1882</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">12A &amp; 80G certified — donations are tax exempt</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Audited financials, public annual report</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Boots-on-ground volunteers in 11 states</span></div>
          </div>

          <Button asChild className="gradient-trust text-white"><Link href="/about">Read our full story <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  PROGRAMS (cards link to /programs/[slug])
// ───────────────────────────────────────────────────────────────────────────
function Programs() {
  const { open } = useDonate()
  return (
    <section id="programs" className="py-20 lg:py-28 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">What We Do</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Three pillars, one purpose.</h2>
          <p className="text-slate-600 text-lg">Every rupee you give is channelled into one of these three flagship programmes — each measurable, transparent, and on the ground.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {PROGRAMS.map(p => {
            const Icon = ICONS[p.icon]
            return (
              <Card key={p.slug} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white">
                <Link href={`/programs/${p.slug}`} className="block relative h-56 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/90 text-sm italic">{p.tagline}</p>
                  </div>
                </Link>
                <CardContent className="p-6">
                  <Link href={`/programs/${p.slug}`}><h3 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-2 hover:text-blue-800 transition">{p.title}</h3></Link>
                  <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">{p.shortDesc}</p>
                  <div className="flex items-center justify-between pt-4 border-t gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-blue-800 hover:text-blue-900 hover:bg-blue-50"><Link href={`/programs/${p.slug}`}>Learn more <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
                    <Button onClick={() => open(p.slug)} size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"><Heart className="w-4 h-4 mr-1.5 fill-current" /> Donate</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  IMPACT
// ───────────────────────────────────────────────────────────────────────────
function CountUp({ end, duration = 1500, suffix = '' }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration)
          setN(Math.floor(t * end))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{n.toLocaleString('en-IN')}{suffix}</span>
}

function Impact() {
  const [stats, setStats] = useState({ totalRaised: 0, donorCount: 0, volunteerCount: 0, livesImpacted: 4200, projectsCount: 12 })
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const tiles = [
    { label: 'Lives Impacted', value: stats.livesImpacted, icon: HandHeart, suffix: '+' },
    { label: 'Donors', value: Math.max(stats.donorCount, 86), icon: Heart, suffix: '+' },
    { label: 'Volunteers', value: Math.max(stats.volunteerCount, 240), icon: Users, suffix: '+' },
    { label: 'Active Projects', value: stats.projectsCount, icon: Building2, suffix: '' },
  ]

  return (
    <section id="impact" className="py-20 lg:py-24 gradient-trust text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge className="bg-amber-400/20 text-amber-200 border border-amber-300/30 hover:bg-amber-400/20 mb-4">Our Impact</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold mb-4">Numbers that mean lives.</h2>
          <p className="text-white/80 text-lg">17 years of service, audited every year, visible to every donor.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {tiles.map((t, i) => {
            const Icon = t.icon
            return (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 transition">
                <Icon className="w-8 h-8 text-amber-300 mx-auto mb-3" />
                <div className="text-3xl lg:text-4xl font-bold mb-1"><CountUp end={t.value} suffix={t.suffix} /></div>
                <div className="text-white/75 text-sm">{t.label}</div>
              </div>
            )
          })}
        </div>

        {stats.totalRaised > 0 && (
          <div className="text-center mt-10 text-white/80">
            <span className="text-amber-300 font-bold text-lg">₹{stats.totalRaised.toLocaleString('en-IN')}</span> raised through this platform
          </div>
        )}
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  GALLERY
// ───────────────────────────────────────────────────────────────────────────
function Gallery() {
  const items = [IMG.education, IMG.disaster, IMG.environment, IMG.community, IMG.about, IMG.hero]
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Gallery</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Moments of seva.</h2>
          <p className="text-slate-600 text-lg">Glimpses from our recent campaigns and community events across India.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {items.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'lg:row-span-2 lg:col-span-2' : ''}`}>
              <img src={src} alt={`Gallery ${i + 1}`} className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${i === 0 ? 'h-full min-h-[300px] lg:min-h-[420px]' : 'h-44 lg:h-52'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  LATEST FROM BLOG
// ───────────────────────────────────────────────────────────────────────────
function BlogTeaser() {
  const posts = BLOG_POSTS.slice(0, 3)
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">From the Blog</Badge>
            <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900">Latest stories from the field.</h2>
          </div>
          <Button variant="ghost" asChild className="hidden md:inline-flex"><Link href="/blog">Read all <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full bg-white">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className={`mb-3 ${CATEGORY_COLOR[post.category]}`}>{CATEGORY_LABEL[post.category]}</Badge>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-800 transition leading-snug">{post.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild><Link href="/blog">Read all stories <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  TESTIMONIALS
// ───────────────────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Voices of Change</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Stories from those we serve.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-0 shadow-md hover:shadow-xl transition bg-white">
              <CardContent className="p-7">
                <Quote className="w-8 h-8 text-amber-500 mb-4" />
                <p className="text-slate-700 italic leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="w-11 h-11 rounded-full gradient-trust text-white flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  VOLUNTEER
// ───────────────────────────────────────────────────────────────────────────
function VolunteerSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', interest: 'education', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/volunteer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setDone(true)
      toast.success('Thank you! We will get in touch within 48 hours.')
    } catch (err) { toast.error(err.message || 'Something went wrong') } finally { setLoading(false) }
  }

  return (
    <section id="volunteer" className="py-20 lg:py-28 bg-slate-50">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-100 mb-4">Join the Movement</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-5 leading-tight">Give your time. <br /><span className="text-blue-800">Change a life.</span></h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">Whether it&apos;s teaching for an hour a week, joining a relief deployment or helping us plant trees on weekends — we have a place for every heart.</p>
          <ul className="space-y-3">
            {['Field volunteering — relief camps, drives & rallies', 'Online volunteering — design, content, social media', 'Corporate / college partnerships welcome'].map((l, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />{l}</li>
            ))}
          </ul>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-7">
            {done ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4"><CheckCircle2 className="w-9 h-9 text-emerald-600" /></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome aboard!</h3>
                <p className="text-slate-600">Thank you for stepping forward. Our volunteer coordinator will reach out within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Volunteer Sign-up</h3>
                <p className="text-sm text-slate-500 mb-4">All fields marked * are required.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="vname">Full Name *</Label><Input id="vname" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
                  <div><Label htmlFor="vemail">Email *</Label><Input id="vemail" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
                  <div><Label htmlFor="vphone">Phone</Label><Input id="vphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1.5" /></div>
                  <div><Label htmlFor="vcity">City</Label><Input id="vcity" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="mt-1.5" /></div>
                </div>
                <div>
                  <Label>Area of Interest</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {['education', 'disaster-relief', 'environment'].map(k => (
                      <button type="button" key={k} onClick={() => setForm({ ...form, interest: k })} className={`text-xs sm:text-sm px-2 py-2.5 rounded-lg border transition font-medium capitalize ${form.interest === k ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>{k.replace('-', ' ')}</button>
                    ))}
                  </div>
                </div>
                <div><Label htmlFor="vmsg">Why do you want to volunteer?</Label><Textarea id="vmsg" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="mt-1.5" /></div>
                <Button type="submit" disabled={loading} className="w-full gradient-trust text-white h-11 font-semibold">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : <><HandHeart className="w-4 h-4 mr-2" /> Sign me up</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  CONTACT
// ───────────────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      toast.success('Message sent — we will respond within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) { toast.error(err.message || 'Something went wrong') } finally { setLoading(false) }
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="container grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Get in Touch</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">Let&apos;s talk seva.</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">For partnerships, CSR, press, or to plan a visit to our headquarters — write to us anytime.</p>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-white" /></div>
              <div><div className="font-semibold text-slate-900">Headquarters</div><div className="text-slate-600 text-sm">Trust Bhavan, Grand Road, Puri,<br />Odisha 752001, India</div></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-white" /></div>
              <div><div className="font-semibold text-slate-900">Phone</div><div className="text-slate-600 text-sm">+91 99999 88888 <br /><span className="text-xs text-slate-500">Mon–Sat, 10 AM – 6 PM IST</span></div></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-white" /></div>
              <div><div className="font-semibold text-slate-900">Email</div><div className="text-slate-600 text-sm">contact@maakarmadevitrust.org<br />donations@maakarmadevitrust.org</div></div>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl lg:col-span-3">
          <CardContent className="p-7">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label htmlFor="cname">Name *</Label><Input id="cname" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
                <div><Label htmlFor="cemail">Email *</Label><Input id="cemail" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="csub">Subject</Label><Input id="csub" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1.5" /></div>
              <div><Label htmlFor="cmsg">Message *</Label><Textarea id="cmsg" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="gradient-trust text-white h-11 font-semibold w-full sm:w-auto px-8">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</> : <>Send Message <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  ROOT
// ───────────────────────────────────────────────────────────────────────────
function App() {
  return (
    <SiteShell solidHeader={false}>
      <Hero />
      <About />
      <Programs />
      <Impact />
      <Gallery />
      <BlogTeaser />
      <Testimonials />
      <VolunteerSection />
      <Contact />
    </SiteShell>
  )
}

export default App
