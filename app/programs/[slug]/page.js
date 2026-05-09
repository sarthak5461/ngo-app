import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/site/site-shell'
import DonateButton from './donate-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, LifeBuoy, Leaf, CheckCircle2, ArrowRight, Heart, Calendar } from 'lucide-react'
import { PROGRAMS, PROGRAM_BY_SLUG, BLOG_POSTS, CATEGORY_LABEL } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf }

export function generateStaticParams() {
  return PROGRAMS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const p = PROGRAM_BY_SLUG[params.slug]
  if (!p) return { title: 'Program Not Found' }
  return {
    title: `${p.title} | Maa Karma Devi Sangh Trust`,
    description: p.shortDesc,
  }
}

export default function ProgramDetail({ params }) {
  const p = PROGRAM_BY_SLUG[params.slug]
  if (!p) notFound()
  const Icon = ICONS[p.icon]
  const otherPrograms = PROGRAMS.filter(x => x.slug !== p.slug)
  const relatedPosts = BLOG_POSTS.filter(b => b.category === p.slug).slice(0, 3)

  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[440px] w-full overflow-hidden">
        <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container h-full flex flex-col justify-center pt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur border border-white/30 flex items-center justify-center"><Icon className="w-6 h-6 text-amber-300" /></div>
            <Badge className="bg-white/15 text-white border border-white/20 backdrop-blur">Programme</Badge>
          </div>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold text-white max-w-3xl mb-3">{p.title}</h1>
          <p className="text-amber-300 italic text-lg">{p.tagline}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container grid grid-cols-2 lg:grid-cols-4 gap-4">
          {p.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-900 mb-1">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Long description */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <p className="text-xl text-slate-700 leading-relaxed">{p.longDesc}</p>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-5xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Our Initiatives</Badge>
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-8">What this programme does, exactly.</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {p.initiatives.map((it, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="text-blue-800 font-mono text-sm mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{it.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{it.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">How it works</Badge>
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-8">From your donation to the field.</h2>
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

      {/* Related blog posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-3">From the Blog</Badge>
                <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Stories from this programme.</h2>
              </div>
              <Button variant="ghost" asChild className="hidden md:inline-flex"><Link href="/blog">All posts <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <Card className="border-0 shadow-md hover:shadow-xl transition overflow-hidden h-full">
                    <div className="relative h-44 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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

      {/* CTA */}
      <section className="py-16 gradient-trust text-white">
        <div className="container max-w-3xl text-center">
          <Heart className="w-12 h-12 text-amber-300 mx-auto mb-4 fill-amber-300" />
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold mb-4">Power this programme.</h2>
          <p className="text-white/85 mb-7">Your contribution funds {p.title.toLowerCase()} on the ground. Receipt issued instantly. 80G certified.</p>
          <DonateButton cause={p.slug} label={`Donate to ${p.title}`} />
        </div>
      </section>

      {/* Other programs */}
      <section className="py-16 bg-white">
        <div className="container">
          <h3 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-6">Explore other programmes</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {otherPrograms.map(other => {
              const OtherIcon = ICONS[other.icon]
              return (
                <Link key={other.slug} href={`/programs/${other.slug}`} className="group">
                  <Card className="border-0 shadow-md hover:shadow-xl transition overflow-hidden">
                    <div className="flex">
                      <div className="w-32 h-32 shrink-0 relative">
                        <img src={other.image} alt={other.title} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-1.5"><OtherIcon className="w-4 h-4 text-blue-800" /><span className="text-xs text-blue-800 font-medium">Programme</span></div>
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-800 transition">{other.title}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2">{other.tagline}</p>
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
