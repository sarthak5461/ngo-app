import Link from 'next/link'
import SiteShell from '@/components/site/site-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, LifeBuoy, Leaf, Stethoscope, ArrowRight, Sparkles } from 'lucide-react'
import { PROGRAMS } from '@/lib/content'

const ICONS = { GraduationCap, LifeBuoy, Leaf, Stethoscope }

export const metadata = {
  title: 'Our Programs | Maa Karma Devi Sangh Trust',
  description: 'Education, Disaster Relief, Environment and Healthcare — the four flagship programmes of Maa Karma Devi Sangh Trust. Each measurable, transparent, on the ground.',
}

export default function ProgramsPage() {
  return (
    <SiteShell>
      <section className="pt-32 pb-14 gradient-trust text-white">
        <div className="container">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> What We Do
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold mb-4">Four pillars, one purpose.</h1>
          <p className="text-lg text-white/85 max-w-2xl">Each programme is measurable, transparent, and on the ground. Pick one to learn more or to see how to support it.</p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container space-y-12">
          {PROGRAMS.map((p, i) => {
            const Icon = ICONS[p.icon]
            const reverse = i % 2 === 1
            return (
              <Card key={p.slug} className="border-0 shadow-xl overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${reverse ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`relative h-72 lg:h-auto ${reverse ? 'lg:col-start-2' : ''}`}>
                    <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-xl gradient-trust flex items-center justify-center mb-5">{Icon ? <Icon className="w-7 h-7 text-white" /> : null}</div>
                    <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-3">{p.title}</h2>
                    <p className="text-amber-700 italic mb-4">{p.tagline}</p>
                    <p className="text-slate-600 leading-relaxed mb-6">{p.shortDesc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-7">
                      {p.stats.slice(0, 4).map((s, j) => (
                        <div key={j} className="bg-blue-50/60 rounded-lg p-3">
                          <div className="text-xl font-bold text-blue-900">{s.value}</div>
                          <div className="text-xs text-slate-600">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="gradient-trust text-white w-fit"><Link href={`/programs/${p.slug}`}>Explore Program <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </SiteShell>
  )
}
