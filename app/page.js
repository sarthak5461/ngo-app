'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Heart, GraduationCap, LifeBuoy, Leaf, Stethoscope, Users,
  CheckCircle2, ArrowRight, Quote, Shield, Sparkles, Loader2,
  HandHeart, Building2, Award, Calendar,
} from 'lucide-react'
import SiteShell from '@/components/site/site-shell'
import { IMG, NGO_FULL_NAME, PROGRAMS, BLOG_POSTS, CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf, Stethoscope }

const TESTIMONIALS = [
  { name: 'Sushila Devi', role: 'Mother, Bhubaneswar', quote: "When the cyclone took our home, the Trust's volunteers reached us before anyone else. They gave us food, medicines and hope." },
  { name: 'Rajesh Mahapatra', role: 'School Principal, Cuttack', quote: 'Because of the scholarship programme, fourteen of my students returned to class this year. This is real, measurable change.' },
  { name: 'Anjali Sahu', role: 'Volunteer, Kolkata', quote: 'I started by helping in one tree-plantation drive. Two years on, this Trust has become my family. Pure service, zero politics.' },
]

// ────────────────────────────────────────────────────────────
//  HERO
// ────────────────────────────────────────────────────────────
function Hero() {
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
          <p className="text-lg sm:text-xl text-white/85 mb-9 max-w-2xl text-balance">
            A community-driven non-profit working across <span className="text-amber-300 font-semibold">Education</span>, <span className="text-amber-300 font-semibold">Disaster Relief</span>, <span className="text-amber-300 font-semibold">Environment</span> and <span className="text-amber-300 font-semibold">Healthcare</span> — with full transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-xl shadow-amber-500/30 h-12 px-7">
              <Link href="/programs">Explore Our Programs <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm h-12 px-7">
              <Link href="/membership"><HandHeart className="w-5 h-5 mr-2" /> Join the Mission</Link>
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

// ────────────────────────────────────────────────────────────
//  ABOUT (teaser)
// ────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
          <p className="text-slate-600 text-lg mb-7 leading-relaxed">
            Today, we are a pan-India movement working across <strong className="text-blue-800">four pillars</strong> — Education, Disaster Relief, Environment and Healthcare — guided by the timeless values of <em>seva</em>, transparency and compassion.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700 text-sm">Registered Trust under Indian Trust Act 1882</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700 text-sm">12A &amp; 80G certified</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700 text-sm">Audited financials, public annual report</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700 text-sm">Volunteers in 11 states across India</span></div>
          </div>

          <Button asChild className="gradient-trust text-white"><Link href="/about">Read our full story <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  PROGRAMS (no donate buttons — only "Explore Program" links)
// ────────────────────────────────────────────────────────────
function Programs() {
  return (
    <section id="programs" className="py-24 lg:py-32 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">What We Do</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Four pillars, one purpose.</h2>
          <p className="text-slate-600 text-lg">Each programme is measurable, transparent, and run by volunteers from the communities we serve.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map(p => {
            const Icon = ICONS[p.icon]
            return (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="group">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-white/95 backdrop-blur flex items-center justify-center shadow">
                      {Icon ? <Icon className="w-5 h-5 text-blue-800" /> : null}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-[Playfair_Display] text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-800 transition">{p.title}</h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">{p.shortDesc}</p>
                    <span className="inline-flex items-center text-sm font-semibold text-blue-800 group-hover:translate-x-1 transition-transform">
                      Explore Program <ArrowRight className="w-4 h-4 ml-1.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  IMPACT
// ────────────────────────────────────────────────────────────
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
  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {}) }, [])

  const tiles = [
    { label: 'Lives Impacted', value: stats.livesImpacted, icon: HandHeart, suffix: '+' },
    { label: 'Members & Donors', value: Math.max(stats.donorCount, 86), icon: Heart, suffix: '+' },
    { label: 'Volunteers', value: Math.max(stats.volunteerCount, 240), icon: Users, suffix: '+' },
    { label: 'Active Projects', value: stats.projectsCount, icon: Building2, suffix: '' },
  ]

  return (
    <section id="impact" className="py-24 lg:py-28 gradient-trust text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge className="bg-amber-400/20 text-amber-200 border border-amber-300/30 hover:bg-amber-400/20 mb-4">Our Impact</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold mb-4">Numbers that mean lives.</h2>
          <p className="text-white/80 text-lg">17 years of service, audited every year, visible to everyone who supports us.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {tiles.map((t, i) => {
            const Icon = t.icon
            return (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 text-center hover:bg-white/15 transition">
                <Icon className="w-8 h-8 text-amber-300 mx-auto mb-3" />
                <div className="text-3xl lg:text-4xl font-bold mb-1"><CountUp end={t.value} suffix={t.suffix} /></div>
                <div className="text-white/75 text-sm">{t.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  TRANSPARENCY (replaces aggressive donate banner)
// ────────────────────────────────────────────────────────────
function Transparency() {
  const items = [
    { stat: '87.4%', label: 'Of every rupee reaches the field', icon: Shield },
    { stat: 'CA-audited', label: 'Independent annual audit since 2011', icon: Award },
    { stat: 'Public', label: 'Annual report — free download', icon: Building2 },
  ]
  return (
    <section className="py-24 lg:py-28 bg-white">
      <div className="container max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-100 mb-4">Transparency</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Trust isn&apos;t given. It&apos;s shown.</h2>
          <p className="text-slate-600 text-lg">We hold ourselves to a strict 85/15 promise — at least 85% of every contribution must reach the field. Our books are open.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon
            return (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition">
                <CardContent className="p-7 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl gradient-trust flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">{it.stat}</div>
                  <div className="text-slate-600">{it.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-9">
          <Button asChild variant="outline" className="border-blue-200 text-blue-800 hover:bg-blue-50"><Link href="/blog/annual-report-2024">Read Annual Report 2024 <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  GALLERY
// ────────────────────────────────────────────────────────────
function Gallery() {
  const items = [IMG.education, IMG.disaster, IMG.environment, IMG.healthcare, IMG.community, IMG.about]
  return (
    <section id="gallery" className="py-24 lg:py-28 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Gallery</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Moments of seva.</h2>
          <p className="text-slate-600 text-lg">Glimpses from our recent campaigns and community events across India.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {items.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'lg:row-span-2 lg:col-span-2' : ''}`}>
              <img src={src} alt={`Gallery ${i + 1}`} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-full min-h-[300px] lg:min-h-[420px]' : 'h-44 lg:h-52'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  BLOG TEASER
// ────────────────────────────────────────────────────────────
function BlogTeaser() {
  const posts = BLOG_POSTS.slice(0, 3)
  return (
    <section className="py-24 lg:py-28 bg-white">
      <div className="container">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">From the Blog</Badge>
            <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900">Latest stories from the field.</h2>
          </div>
          <Button variant="ghost" asChild className="hidden md:inline-flex text-blue-800 hover:bg-blue-50"><Link href="/blog">Read all <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full bg-white">
                <div className="relative h-52 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
//  TESTIMONIALS
// ────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-24 lg:py-28 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Voices of Change</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Stories from those we serve.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-0 shadow-md hover:shadow-lg transition bg-white">
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

// ────────────────────────────────────────────────────────────
//  VOLUNTEER (kept on home, no contact form)
// ────────────────────────────────────────────────────────────
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
    <section id="volunteer" className="py-24 lg:py-28 bg-white">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-100 mb-4">Volunteer With Us</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-5 leading-tight">Give your time. <br /><span className="text-blue-800">Change a life.</span></h2>
          <p className="text-slate-600 text-lg mb-7 leading-relaxed">Whether it&apos;s teaching for an hour a week, joining a relief deployment or helping plant trees on weekends — we have a place for every heart.</p>
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
                <p className="text-slate-600">Our volunteer coordinator will reach out within 48 hours.</p>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                    {['education', 'disaster-relief', 'environment', 'healthcare'].map(k => (
                      <button type="button" key={k} onClick={() => setForm({ ...form, interest: k })} className={`text-xs px-2 py-2.5 rounded-lg border transition font-medium capitalize ${form.interest === k ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>{k.replace('-', ' ')}</button>
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

// ────────────────────────────────────────────────────────────
function App() {
  return (
    <SiteShell solidHeader={false}>
      <Hero />
      <About />
      <Programs />
      <Impact />
      <Transparency />
      <Gallery />
      <BlogTeaser />
      <Testimonials />
      <VolunteerSection />
    </SiteShell>
  )
}

export default App
