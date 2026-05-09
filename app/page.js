'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Heart, GraduationCap, LifeBuoy, Leaf, Users, Phone, Mail, MapPin,
  CheckCircle2, ArrowRight, Quote, Shield, Sparkles, Loader2, Printer,
  Menu, X, ChevronDown, HandHeart, Building2, Calendar, Award,
} from 'lucide-react'

// ───────────────────────────────────────────────────────────────────────────
//  Image assets (curated by vision_expert_agent)
// ───────────────────────────────────────────────────────────────────────────
const IMG = {
  hero: 'https://images.unsplash.com/photo-1758390286125-bd31d5c8f592?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxJbmRpYSUyMHZvbHVudGVlcnMlMjBjb21tdW5pdHl8ZW58MHx8fHwxNzc4MzE0MjEzfDA&ixlib=rb-4.1.0&q=85',
  education: 'https://images.unsplash.com/flagged/photo-1574097656146-0b43b7660cb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxjaGlsZHJlbiUyMGNsYXNzcm9vbSUyMEluZGlhfGVufDB8fHx8MTc3ODMxNDIxM3ww&ixlib=rb-4.1.0&q=85',
  disaster: 'https://images.unsplash.com/photo-1588681805300-516bdf3e1539?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkaXNhc3RlciUyMHJlbGllZiUyMHZvbHVudGVlcnN8ZW58MHx8fHwxNzc4MzE0MjEzfDA&ixlib=rb-4.1.0&q=85',
  environment: 'https://images.unsplash.com/photo-1777150895644-2ca253ee1c93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwzfHx0cmVlJTIwcGxhbnRpbmclMjBlbnZpcm9ubWVudHxlbnwwfHx8fDE3NzgzMTQyMTN8MA&ixlib=rb-4.1.0&q=85',
  community: 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxJbmRpYSUyMHZvbHVudGVlcnMlMjBjb21tdW5pdHl8ZW58MHx8fHwxNzc4MzE0MjEzfDA&ixlib=rb-4.1.0&q=85',
  about: 'https://images.unsplash.com/photo-1707760509904-1507ee621999?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHw0fHxJbmRpYSUyMGNvbW11bml0eSUyMGhvcGV8ZW58MHx8fHwxNzc4MzE0MjIwfDA&ixlib=rb-4.1.0&q=85',
}

const NGO_FULL_NAME = 'Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust'
const NGO_SHORT = 'Maa Karma Devi Sangh Trust'

const PROGRAMS = [
  {
    key: 'education',
    title: 'Education for All',
    image: IMG.education,
    icon: GraduationCap,
    tagline: 'Books, schools, and second chances.',
    description: 'We sponsor underprivileged children, build village libraries, and run free coaching centres so no child is ever forced to drop out of school.',
    stats: '1,200+ children supported',
  },
  {
    key: 'disaster-relief',
    title: 'Disaster Relief',
    image: IMG.disaster,
    icon: LifeBuoy,
    tagline: 'On the ground when it matters most.',
    description: 'Rapid relief kits, food, shelter and medical aid for families struck by floods, cyclones and earthquakes — delivered within 24 hours.',
    stats: '38 relief operations completed',
  },
  {
    key: 'environment',
    title: 'Environment & Green Future',
    image: IMG.environment,
    icon: Leaf,
    tagline: 'A greener India for the next generation.',
    description: 'Tree plantation drives, clean-water initiatives, river cleanups and rural awareness camps — building a sustainable, climate-resilient Bharat.',
    stats: '24,000+ saplings planted',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sushila Devi',
    role: 'Mother, Bhubaneswar',
    quote: "When the cyclone took our home, the Trust's volunteers reached us before anyone else. They gave us food, medicines and hope.",
  },
  {
    name: 'Rajesh Mahapatra',
    role: 'School Principal, Cuttack',
    quote: "Because of the scholarship programme, fourteen of my students returned to class this year. This is real, measurable change.",
  },
  {
    name: 'Anjali Sahu',
    role: 'Volunteer, Kolkata',
    quote: "I started by helping in one tree-plantation drive. Two years on, this Trust has become my family. Pure service, zero politics.",
  },
]

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000]

// ───────────────────────────────────────────────────────────────────────────
//  HEADER
// ───────────────────────────────────────────────────────────────────────────
function Header({ onDonate }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Impact', href: '#impact' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Volunteer', href: '#volunteer' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between py-3">
        <a href="#home" className="flex items-center gap-2.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${scrolled ? 'gradient-trust' : 'bg-white/15 backdrop-blur border border-white/30'}`}>
            <HandHeart className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className={`font-bold text-sm ${scrolled ? 'text-slate-900' : 'text-white'}`}>Maa Karma Devi</div>
            <div className={`text-xs ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>Sangh Trust</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map(it => (
            <a key={it.href} href={it.href} className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-700 hover:text-blue-800' : 'text-white/90 hover:text-white'}`}>
              {it.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={onDonate} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg shadow-amber-500/25">
            <Heart className="w-4 h-4 mr-1.5 fill-current" /> Donate
          </Button>
          <button onClick={() => setMobileOpen(true)} className={`lg:hidden p-2 rounded-md ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="container flex justify-between items-center py-4">
            <span className="font-bold text-blue-900">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex flex-col container gap-1">
            {navItems.map(it => (
              <a key={it.href} href={it.href} onClick={() => setMobileOpen(false)} className="py-3 px-2 border-b text-slate-800 font-medium">{it.label}</a>
            ))}
            <Button onClick={() => { setMobileOpen(false); onDonate() }} className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              <Heart className="w-4 h-4 mr-1.5 fill-current" /> Donate Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  HERO
// ───────────────────────────────────────────────────────────────────────────
function Hero({ onDonate }) {
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
          <p className="text-base sm:text-lg text-white/85 mb-2 max-w-2xl">
            <span className="font-semibold text-white">{NGO_FULL_NAME}</span>
          </p>
          <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl text-balance">
            Empowering India&apos;s most vulnerable communities through <span className="text-amber-300 font-semibold">Education</span>, <span className="text-amber-300 font-semibold">Disaster Relief</span> and <span className="text-amber-300 font-semibold">Environmental Action</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onDonate} size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-xl shadow-amber-500/30 h-12 px-7">
              <Heart className="w-5 h-5 mr-2 fill-current" /> Donate Now
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm h-12 px-7">
              <a href="#volunteer"><Users className="w-5 h-5 mr-2" /> Become a Volunteer</a>
            </Button>
          </div>
        </div>

        {/* Floating trust badges */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white/90 text-sm"><Shield className="w-4 h-4 text-amber-300" /> 80G Tax Exempted</div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white/90 text-sm"><Award className="w-4 h-4 text-amber-300" /> 17 Years of Service</div>
          <div className="w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2 text-white/90 text-sm"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 100% Transparent</div>
        </div>
      </div>

      <a href="#about" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 animate-bounce md:hidden">
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  ABOUT
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Registered Trust under Indian Trust Act 1882</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">12A &amp; 80G certified — donations are tax exempt</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Audited financials, public annual report</span></div>
            <div className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">Boots-on-ground volunteers in 11 states</span></div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container grid md:grid-cols-2 gap-6 mt-20">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <CardContent className="p-8">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4"><Sparkles className="w-6 h-6 text-amber-300" /></div>
            <h3 className="font-[Playfair_Display] text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-white/85 leading-relaxed">To uplift the most vulnerable sections of Indian society by delivering education, emergency relief and a healthier environment — with full accountability to our donors and dignity to our beneficiaries.</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-8">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4"><Heart className="w-6 h-6 text-white fill-white" /></div>
            <h3 className="font-[Playfair_Display] text-2xl font-bold mb-3 text-slate-900">Our Vision</h3>
            <p className="text-slate-700 leading-relaxed">An India where every child is in school, every disaster victim is rescued within hours, and every village has clean air, clean water, and the hope of a sustainable tomorrow.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  PROGRAMS
// ───────────────────────────────────────────────────────────────────────────
function Programs({ onDonate }) {
  return (
    <section id="programs" className="py-20 lg:py-28 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">What We Do</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Three pillars, one purpose.</h2>
          <p className="text-slate-600 text-lg">Every rupee you give is channelled into one of these three flagship programmes — each measurable, transparent, and on the ground.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon
            return (
              <Card key={p.key} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-white">
                <div className="relative h-56 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/90 text-sm italic">{p.tagline}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-semibold text-blue-800">{p.stats}</span>
                    <Button variant="ghost" size="sm" onClick={() => onDonate(p.key)} className="text-blue-800 hover:text-blue-900 hover:bg-blue-50">
                      Support <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
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
//  IMPACT STATS (live from API)
// ───────────────────────────────────────────────────────────────────────────
function CountUp({ end, duration = 1500, prefix = '', suffix = '' }) {
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
  return <span ref={ref}>{prefix}{n.toLocaleString('en-IN')}{suffix}</span>
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
                <div className="text-3xl lg:text-4xl font-bold mb-1">
                  <CountUp end={t.value} suffix={t.suffix} />
                </div>
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
//  GALLERY (static for MVP)
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
//  TESTIMONIALS
// ───────────────────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
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
                  <div className="w-11 h-11 rounded-full gradient-trust text-white flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
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
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="volunteer" className="py-20 lg:py-28 bg-white">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-100 mb-4">Join the Movement</Badge>
          <h2 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-slate-900 mb-5 leading-tight">Give your time. <br /><span className="text-blue-800">Change a life.</span></h2>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Whether it&apos;s teaching for an hour a week, joining a relief deployment or helping us plant trees on weekends — we have a place for every heart.
          </p>
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
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>
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
                      <button type="button" key={k} onClick={() => setForm({ ...form, interest: k })} className={`text-xs sm:text-sm px-2 py-2.5 rounded-lg border transition font-medium capitalize ${form.interest === k ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}>
                        {k.replace('-', ' ')}
                      </button>
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
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50">
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
//  FOOTER
// ───────────────────────────────────────────────────────────────────────────
function Footer({ onDonate }) {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="container grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl gradient-trust flex items-center justify-center"><HandHeart className="w-6 h-6 text-white" /></div>
            <div>
              <div className="font-bold">Maa Karma Devi</div>
              <div className="text-xs text-slate-400">Sangh Trust • since 2008</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-md">
            {NGO_FULL_NAME} is a registered non-profit working across Education, Disaster Relief and Environment. 12A & 80G certified.
          </p>
          <Button onClick={onDonate} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <Heart className="w-4 h-4 mr-2 fill-current" /> Donate Now
          </Button>
        </div>

        <div>
          <div className="font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#about" className="hover:text-amber-300">About Us</a></li>
            <li><a href="#programs" className="hover:text-amber-300">Programs</a></li>
            <li><a href="#impact" className="hover:text-amber-300">Our Impact</a></li>
            <li><a href="#gallery" className="hover:text-amber-300">Gallery</a></li>
            <li><a href="#volunteer" className="hover:text-amber-300">Volunteer</a></li>
            <li><a href="#contact" className="hover:text-amber-300">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-4">Legal</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Trust Reg: 432/2008</li>
            <li>PAN: AAATM0000K</li>
            <li>12A: AAATM0000K/12A</li>
            <li>80G: AAATM0000K/80G</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 container flex flex-col md:flex-row justify-between gap-3 text-sm text-slate-500">
        <div>© {new Date().getFullYear()} {NGO_SHORT}. All rights reserved.</div>
        <div>Made with <Heart className="w-3 h-3 inline fill-amber-400 text-amber-400" /> for the people of Bharat.</div>
      </div>
    </footer>
  )
}

// ───────────────────────────────────────────────────────────────────────────
//  DONATION DIALOG (the heart of the MVP)
// ───────────────────────────────────────────────────────────────────────────
function DonationDialog({ open, onOpenChange, defaultCause = 'general' }) {
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
      // Mock-only: get a paymentId + valid signature from server simulator
      const r1 = await fetch('/api/donations/mock-pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.orderId }),
      })
      const d1 = await r1.json()
      if (!r1.ok) throw new Error(d1.error)

      // Verify on server (this is the part that runs in real prod too)
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
                <p className="text-xs text-slate-500">12A & 80G Certified • Trust Reg: 432/2008</p>
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

// ───────────────────────────────────────────────────────────────────────────
//  ROOT
// ───────────────────────────────────────────────────────────────────────────
function App() {
  const [donateOpen, setDonateOpen] = useState(false)
  const [defaultCause, setDefaultCause] = useState('general')

  const openDonate = (cause = 'general') => {
    setDefaultCause(typeof cause === 'string' ? cause : 'general')
    setDonateOpen(true)
  }

  return (
    <div className="bg-white min-h-screen">
      <Header onDonate={() => openDonate()} />
      <main>
        <Hero onDonate={() => openDonate()} />
        <About />
        <Programs onDonate={openDonate} />
        <Impact />
        <Gallery />
        <Testimonials />
        <VolunteerSection />
        <Contact />
      </main>
      <Footer onDonate={() => openDonate()} />

      {/* Floating donate button (mobile + desktop persistent) */}
      <button onClick={() => openDonate()} className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full shadow-2xl shadow-amber-500/40 px-5 py-3 font-bold flex items-center gap-2 transition-transform hover:scale-105 lg:hidden">
        <Heart className="w-4 h-4 fill-current" /> Donate
      </button>

      <DonationDialog open={donateOpen} onOpenChange={setDonateOpen} defaultCause={defaultCause} />
    </div>
  )
}

export default App
