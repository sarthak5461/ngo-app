import Link from 'next/link'
import SiteShell from '@/components/site/site-shell'
import CSRForm from './csr-form'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, Users, HandHeart, Award, CheckCircle2, ArrowRight, Briefcase, Shield, Sparkles, Globe } from 'lucide-react'

export const metadata = {
  title: 'CSR Activities | Maa Karma Devi Sangh Trust',
  description: 'Partner with Maa Karma Devi Sangh Trust on CSR initiatives, employee volunteering and corporate social responsibility programmes across India.',
}

const PARTNERSHIP_TYPES = [
  {
    icon: Briefcase,
    title: 'CSR Funding Partnerships',
    description: 'Direct CSR fund deployment under Section 135 of the Companies Act, 2013. We provide quarterly utilisation reports, third-party audited statements, and joint impact verification.',
    bullets: ['Section 135 compliant', 'Quarterly utilisation reports', 'Audited financials', 'Joint field visits'],
  },
  {
    icon: Users,
    title: 'Employee Volunteering',
    description: 'Bring your teams to the field. We host structured one-day to month-long volunteering programmes — tree plantations, school painting drives, medical camps, mentorship programmes.',
    bullets: ['Day, week & month-long formats', 'Pan-India deployment', 'Insurance & logistics handled', 'Impact certificates issued'],
  },
  {
    icon: HandHeart,
    title: 'In-Kind & Skill Partnerships',
    description: 'From IT systems to legal pro-bono, from medicines to school supplies — we are open to in-kind support, skills-based volunteering and shared infrastructure agreements.',
    bullets: ['Equipment & supplies', 'Pro-bono professional services', 'Tech & data partnerships', 'Joint IP & research'],
  },
  {
    icon: Globe,
    title: 'Cause-Marketing Collaborations',
    description: 'Co-branded campaigns, percentage-of-sales programmes, and cause-marketing tie-ups. We work with brands that share our values around transparency and dignity.',
    bullets: ['Co-branded campaigns', 'Cause-marketing programmes', 'Joint storytelling', 'Customisable to your brand'],
  },
]

const PAST_PARTNERS = [
  'Tata Steel Foundation', 'HDFC Parivartan', 'Wipro Cares', 'Infosys Foundation',
  'Mahindra Rise', 'Axis Bank Foundation', 'NMDC CSR', 'Reliance Foundation',
]

const TRUST_PILLARS = [
  { icon: Shield, title: 'Compliance-first', text: 'CSR-1, FCRA-track, Section 8 documentation and 12A/80G — all current. We do the paperwork so you don’t have to chase.' },
  { icon: Award, title: 'Audited & Transparent', text: 'Independent CA audit since 2011. Annual reports public. We publish what we spend and where.' },
  { icon: Sparkles, title: 'Real, measurable impact', text: 'No vanity metrics. Each programme has third-year survival rates, board-pass rates, hospital-conversion rates — not just photos.' },
]

export default function CSRPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-trust text-white">
        <div className="container max-w-5xl">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> For Corporates &amp; CSR Heads
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold leading-tight mb-5">
            CSR partnerships that deliver <span className="text-amber-400">real, audited impact.</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/85 max-w-3xl leading-relaxed">
            We partner with Indian and global corporates to deploy meaningful CSR funds across <strong>Education</strong>, <strong>Disaster Relief</strong>, <strong>Environment</strong> and <strong>Healthcare</strong>. Section 135 compliant, audited, and transparent.
          </p>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-5">
            {TRUST_PILLARS.map((t, i) => {
              const Icon = t.icon
              return (
                <Card key={i} className="border-0 shadow-md hover:shadow-lg transition">
                  <CardContent className="p-7">
                    <div className="w-12 h-12 rounded-xl gradient-trust flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-white" /></div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{t.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partnership types */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Ways to partner</Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-4">Four ways your company can engage.</h2>
            <p className="text-slate-600 text-lg">From cheque-cutting to hands-on volunteering. Pick what fits your company’s strategy.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PARTNERSHIP_TYPES.map((p, i) => {
              const Icon = p.icon
              return (
                <Card key={i} className="border-0 shadow-md hover:shadow-xl transition">
                  <CardContent className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-blue-800" /></div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{p.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{p.description}</p>
                    <ul className="space-y-2">
                      {p.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Past partners */}
      <section className="py-16 bg-white">
        <div className="container max-w-5xl text-center">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-6">Past CSR partners we&apos;ve worked with (illustrative)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PAST_PARTNERS.map((p, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg text-slate-700 font-semibold text-sm">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 bg-slate-50">
        <div className="container max-w-4xl">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-100 mb-4">What CSR partners receive</Badge>
          <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-8">A partnership built on documentation, not on promises.</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Branded MoU, signed within 5 working days of agreement',
              'Quarterly utilisation reports with photo evidence',
              'Annual third-party audit & impact assessment',
              'CSR-2 compliance documentation for filings',
              'Joint field visits — your team meets ours, on the ground',
              'Co-branded storytelling, video case studies & PR support',
              'Dedicated programme manager + escalation contact',
              'Section 80G donation receipt for non-CSR grants',
            ].map((x, i) => (
              <div key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-slate-700">{x}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* CSR Contact form */}
      <section id="csr-contact" className="py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Start the conversation</Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-3">Let&apos;s explore a partnership.</h2>
            <p className="text-slate-600">Drop us a note and our CSR Lead will respond within one business day.</p>
          </div>
          <CSRForm />
        </div>
      </section>
    </SiteShell>
  )
}
