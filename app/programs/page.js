import Link from 'next/link'
import SiteShell from '@/components/site/site-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, LifeBuoy, Leaf, ArrowRight, Heart } from 'lucide-react'
import { PROGRAMS } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf }

export const metadata = {
  title: 'Our Programs | Maa Karma Devi Sangh Trust',
  description: 'Education, Disaster Relief and Environment — the three flagship programmes of Maa Karma Devi Sangh Trust. Each measurable, transparent, on the ground.',
}

export default function ProgramsPage() {
  return (
    <SiteShell>
      <section className="pt-32 pb-12 gradient-trust text-white">
        <div className="container">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-4 backdrop-blur-sm">What We Do</Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold mb-4">Three pillars, one purpose.</h1>
          <p className="text-lg text-white/85 max-w-2xl">Every rupee you give is channelled into one of these three flagship programmes — each measurable, transparent, and on the ground.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container space-y-12">
          {PROGRAMS.map((p, i) => {
            const Icon = ICONS[p.icon]
            const reverse = i % 2 === 1
            return (
              <Card key={p.slug} className="border-0 shadow-xl overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${reverse ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`relative h-72 lg:h-auto ${reverse ? 'lg:col-start-2' : ''}`}>
                    <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-30`} />
                  </div>
                  <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-xl gradient-trust flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-white" /></div>
                    <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-3">{p.title}</h2>
                    <p className="text-amber-700 italic mb-4">{p.tagline}</p>
                    <p className="text-slate-600 leading-relaxed mb-6">{p.shortDesc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {p.stats.slice(0, 4).map((s, j) => (
                        <div key={j} className="bg-blue-50/50 rounded-lg p-3">
                          <div className="text-xl font-bold text-blue-900">{s.value}</div>
                          <div className="text-xs text-slate-600">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button asChild className="gradient-trust text-white"><Link href={`/programs/${p.slug}`}>Learn more <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="py-16 bg-white text-center">
        <div className="container">
          <Heart className="w-12 h-12 text-amber-500 mx-auto mb-4 fill-amber-500" />
          <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900 mb-3">Every cause needs a champion.</h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-6">Pick the cause that moves you. Donate today — receipts issued instantly, 80G certified.</p>
        </div>
      </section>
    </SiteShell>
  )
}
