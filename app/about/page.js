import Link from 'next/link'
import SiteShell from '@/components/site/site-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Sparkles, Heart, Award, Shield, Users, ArrowRight } from 'lucide-react'
import { IMG, NGO_FULL_NAME } from '@/lib/content'

export const metadata = {
  title: 'About Us | Maa Karma Devi Sangh Trust',
  description: 'Learn about Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust — 17 years of seva across Education, Disaster Relief and Environment in India.',
}

const TRUSTEES = [
  { name: 'Sri Bhagaban Mohanty', role: 'Founder & Chief Trustee', bio: 'Retired schoolmaster and lifelong devotee of Lord Jagannath. Founded the Trust in 2008.' },
  { name: 'Smt. Lata Mishra', role: 'Managing Trustee', bio: 'Former social welfare officer with the Government of Odisha. Leads programme strategy.' },
  { name: 'Sri Pratap Mohanty', role: 'Head of Disaster Operations', bio: 'Trained in NDRF protocols. Has led 14 cyclone and flood deployments.' },
  { name: 'Dr. Asha Patnaik', role: 'Environment Programme Director', bio: 'PhD in environmental science (Utkal University). Leads our climate-resilience initiatives.' },
  { name: 'Sri Manoj Pradhan', role: 'Education Coordinator', bio: 'Former librarian. Heads the village library and scholarship programme.' },
  { name: 'CA Sanjay Behera', role: 'Honorary Auditor', bio: 'Independent CA conducting our annual statutory audit since 2011.' },
]

const VALUES = [
  { icon: Shield, title: 'Radical Transparency', text: 'Every rupee tracked. Annual report publicly downloadable. Audited by an independent CA every year.' },
  { icon: Heart, title: 'Dignity Before Charity', text: 'We do not hand out help; we partner with families. The beneficiary’s voice shapes every programme.' },
  { icon: Sparkles, title: 'Long-term Over Photogenic', text: 'We measure success in three-year survival rates and Class XII pass marks — not in event photos.' },
  { icon: Users, title: 'Local First', text: '94% of our field staff are from the communities we serve. Outsiders advise; locals lead.' },
]

export default function AboutPage() {
  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img src={IMG.about} alt="Community we serve" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container h-full flex flex-col justify-center pt-20">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm w-fit">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> About the Trust
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold text-white text-balance leading-[1.05] mb-4 max-w-3xl">
            A Trust born of devotion, <span className="text-amber-400">grown by service.</span>
          </h1>
          <p className="text-lg text-white/85 max-w-2xl">{NGO_FULL_NAME}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Our Story</Badge>
          <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-6">From a community kitchen, to eleven states.</h2>
          <div className="prose prose-lg max-w-none text-slate-700 space-y-5 leading-relaxed">
            <p>The Trust began in <strong>2008</strong>, in a borrowed room three lanes from the Jagannath Temple in Puri. Sri Bhagaban Mohanty, a retired schoolmaster, had spent his pension on a daily lunch programme for the elderly homeless who slept along the temple wall. By the third year, the queue was 240 people long.</p>
            <p>What began as one man’s daily seva became, over the next decade, a registered Trust with three flagship programmes — Education, Disaster Relief and Environment — boots-on-ground in <strong>eleven states</strong>, and a volunteer base of over <strong>240 active workers</strong>.</p>
            <p>We have never taken a government grant. We are funded entirely by individual donors and a small number of corporate CSR partners who share our values. This independence is what allows us to speak honestly about what works in development — and what doesn’t.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-10">
            {[
              'Registered Trust under Indian Trust Act, 1882',
              '12A & 80G certified — donations are tax exempt',
              'Annual statutory audit by independent CA',
              'Public annual report — free download',
              '85%+ of every rupee reaches the field',
              'Active in 11 states across India',
            ].map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-slate-700">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">What We Stand For</Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900">Four values that shape every decision.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <Card key={i} className="border-0 shadow-md hover:shadow-xl transition">
                  <CardContent className="p-7">
                    <div className="w-12 h-12 rounded-xl gradient-trust flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{v.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{v.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-white">
        <div className="container grid md:grid-cols-2 gap-6">
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

      {/* Trustees */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Our People</Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900">The Board of Trustees.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TRUSTEES.map((t, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-xl mb-4">{t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-blue-800 text-sm font-medium mb-2">{t.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{t.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-trust text-white text-center">
        <div className="container">
          <Award className="w-12 h-12 text-amber-300 mx-auto mb-5" />
          <h2 className="font-[Playfair_Display] text-4xl font-bold mb-4">Be part of the next chapter.</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8">17 years of service. 4,200+ lives. We are just getting started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-12 px-7"><Link href="/programs">Explore Programs <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 h-12 px-7"><Link href="/#volunteer"><Users className="w-4 h-4 mr-2" /> Volunteer with us</Link></Button>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
