import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/site/site-shell'
import DonateButton from './donate-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, LifeBuoy, Leaf, Stethoscope, CheckCircle2, ArrowRight, HandHeart, Users, Sparkles } from 'lucide-react'
import { PROGRAMS, PROGRAM_BY_SLUG, BLOG_POSTS, CATEGORY_LABEL, PROGRAM_DONATE_LABEL, SUPPORT_TIERS, IMG } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf, Stethoscope }

export function generateStaticParams() {
  return PROGRAMS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const p = PROGRAM_BY_SLUG[params.slug]
  if (!p) return { title: 'Program Not Found' }
  return { title: `${p.title} | Maa Karma Devi Sangh Trust`, description: p.shortDesc }
}

export default function ProgramDetail({ params }) {
  const p = PROGRAM_BY_SLUG[params.slug]
  if (!p) notFound()
  const Icon = ICONS[p.icon]
  const otherPrograms = PROGRAMS.filter(x => x.slug !== p.slug)
  const relatedPosts = BLOG_POSTS.filter(b => b.category === p.slug).slice(0, 3)
  const tiers = SUPPORT_TIERS[p.slug] || []
  const ctaLabel = PROGRAM_DONATE_LABEL[p.slug] || 'Support this Cause'
  const galleryImages = [IMG.community, IMG.about, IMG.hero].filter(img => img !== p.image)

  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[440px] w-full overflow-hidden">
        <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container h-full flex flex-col justify-center pt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center">{Icon ? <Icon className="w-6 h-6 text-amber-300" /> : null}</div>
            <Badge className="bg-white/15 text-white border border-white/20 backdrop-blur">Programme</Badge>
          </div>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold text-white max-w-3xl mb-3">{p.title}</h1>
          <p className="text-amber-300 italic text-lg">{p.tagline}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-6">
          {p.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-900 mb-1">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Long description */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">About this programme</Badge>
          <p className="text-xl text-slate-700 leading-relaxed">{p.longDesc}</p>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-5xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Our Initiatives</Badge>
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-10">What this programme does, exactly.</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {p.initiatives.map((it, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition">
                <CardContent className="p-7">
                  <div className="text-blue-800 font-mono text-sm mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{it.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{it.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Realistic impact / Gallery */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-100 mb-4">From the Field</Badge>
            <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-3">The work, in pictures.</h2>
            <p className="text-slate-600">Glimpses from recent {p.title.toLowerCase()} activities. Every photo is from our own field documentation — nothing is staged.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 lg:row-span-2 relative overflow-hidden rounded-xl group">
              <img src={p.image} alt={`${p.title} field 1`} className="w-full h-full min-h-[300px] lg:min-h-[420px] object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            {galleryImages.map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl group">
                <img src={src} alt={`${p.title} field ${i + 2}`} className="w-full h-44 lg:h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How your support helps */}
      {tiers.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-100 mb-4">How your support helps</Badge>
              <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Where every rupee goes.</h2>
              <p className="text-slate-600">Cost-to-impact transparency for {p.title.toLowerCase()}. No overheads hidden, no jargon.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {tiers.map((t, i) => (
                <Card key={i} className={`border-0 shadow-md hover:shadow-xl transition ${i === 1 ? 'ring-2 ring-blue-800' : ''}`}>
                  <CardContent className="p-7">
                    <div className="text-3xl font-bold text-blue-900 mb-3">₹{t.amount.toLocaleString('en-IN')}</div>
                    <p className="text-slate-700 leading-relaxed">{t.helps}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">How it works</Badge>
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-10">From your support to the field.</h2>
          <ol className="space-y-5">
            {p.howItWorks.map((s, i) => (
              <li key={i} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full gradient-trust text-white font-bold flex items-center justify-center">{i + 1}</div>
                <p className="text-slate-700 leading-relaxed pt-1">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Donation CTA — ONLY here on the site */}
      <section className="py-20 gradient-trust text-white">
        <div className="container max-w-3xl text-center">
          <Sparkles className="w-12 h-12 text-amber-300 mx-auto mb-5" />
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold mb-4">Stand with this cause.</h2>
          <p className="text-white/85 mb-8 leading-relaxed">Your contribution funds {p.title.toLowerCase()} on the ground. 80G certified, receipt issued instantly, and 87.4% of every rupee reaches the field.</p>
          <DonateButton cause={p.slug} label={ctaLabel} />
          <p className="text-white/60 text-xs mt-5">A one-time supportive contribution. We&apos;ll never spam you, sell your data or call you for repeat asks.</p>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 relative h-56 md:h-auto">
                <img src={IMG.community} alt="Volunteers" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <CardContent className="md:col-span-3 p-8 lg:p-10">
                <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-100 mb-3">Or, give your time</Badge>
                <h3 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-3">Volunteer with the {p.title} programme.</h3>
                <p className="text-slate-600 mb-5 leading-relaxed">No money? Give an hour. Our volunteers shape every campaign — from field work to social media to fundraising drives.</p>
                <Button asChild className="gradient-trust text-white"><Link href="/#volunteer"><Users className="w-4 h-4 mr-2" /> Sign up to volunteer</Link></Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Related blog posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
              <div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-3">From the Blog</Badge>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Stories from this programme.</h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:inline-flex"><Link href="/blog">All posts <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden h-full">
                    <div className="relative h-44 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className="mb-2 bg-blue-50 text-blue-800 border-blue-100">{CATEGORY_LABEL[post.category]}</Badge>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-800 transition">{post.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other programs */}
      <section className="py-20 bg-white">
        <div className="container">
          <h3 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-7">Explore other programmes</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {otherPrograms.map(other => {
              const OtherIcon = ICONS[other.icon]
              return (
                <Link key={other.slug} href={`/programs/${other.slug}`} className="group">
                  <Card className="border-0 shadow-md hover:shadow-lg transition overflow-hidden h-full">
                    <div className="flex">
                      <div className="w-28 h-28 shrink-0 relative">
                        <img src={other.image} alt={other.title} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">{OtherIcon ? <OtherIcon className="w-4 h-4 text-blue-800" /> : null}<span className="text-xs text-blue-800 font-medium">Programme</span></div>
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-800 transition leading-snug">{other.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{other.tagline}</p>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
