import SiteShell from '@/components/site/site-shell'
import MembershipFlow from './membership-flow'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, HandHeart, Sparkles, Users, Mail, FileCheck2, Shield } from 'lucide-react'

export const metadata = {
  title: 'Become a Member | Maa Karma Devi Sangh Trust',
  description: 'Join Maa Karma Devi Sangh Trust as a member. A simple application, identity verification, and a token contribution from ₹500 unlocks one year of membership.',
}

const WHY = [
  { icon: HandHeart, title: 'Belong to the seva family', text: 'You are no longer just a donor or supporter. You become part of the trust\u2019s extended family with a member ID and yearly recognition.' },
  { icon: Mail, title: 'Quarterly impact reports', text: 'Receive detailed quarterly reports of where the Trust is working, what is changing on the ground, and how your contribution is helping.' },
  { icon: Users, title: 'Annual Day & events', text: 'Members are personally invited to the Annual Day in Puri, plus regional gatherings and field visit days through the year.' },
  { icon: FileCheck2, title: '80G tax benefit', text: 'Your token contribution is fully tax exempt under Section 80G. We issue a digital receipt instantly.' },
]

const FAQ = [
  { q: 'Is this a one-time or recurring contribution?', a: 'It is a one-time contribution per year. Your membership is valid for 12 months from the date of activation. You can renew anytime after that.' },
  { q: 'Why is there a token contribution?', a: 'Membership is not a fee \u2014 it is your symbolic stake in the work. The minimum of \u20b9500 helps us cover the administrative cost of issuing your card and reports, and ensures only committed supporters apply.' },
  { q: 'Is my Aadhaar information safe?', a: 'We do not store your full Aadhaar number. Only the last 4 digits are stored, in masked form, for our internal verification. Full identity verification will be handled via DigiLocker (rolling out soon).' },
  { q: 'Can I cancel?', a: 'Yes. You can write to membership@maakarmadevitrust.org any time. There is no refund of the token contribution as it is treated as a charitable donation.' },
  { q: 'What if I cannot afford \u20b9500?', a: 'We have a need-based waiver. Please email us at membership@maakarmadevitrust.org and we will gladly enrol you.' },
]

export default function MembershipPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-trust text-white">
        <div className="container max-w-5xl">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Members of the Trust
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold leading-tight mb-5">
            Stand with the Trust. <br /><span className="text-amber-400">Become a member.</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/85 max-w-3xl leading-relaxed">
            Membership is more than a name on a list. It is your decision to belong to a 17-year-old movement of seva, transparency and dignity. Join us with a simple application and a token contribution of ₹500 or more.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-4">Why become a member?</Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900">A small commitment. A real connection.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w, i) => {
              const Icon = w.icon
              return (
                <Card key={i} className="border-0 shadow-md hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-lg gradient-trust flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-white" /></div>
                    <h3 className="font-bold text-slate-900 mb-2">{w.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{w.text}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Token contribution explainer */}
      <section className="py-12 bg-slate-50">
        <div className="container max-w-4xl">
          <Card className="border-0 shadow-md bg-amber-50/60 border-amber-100">
            <CardContent className="p-7 flex items-start gap-4">
              <Shield className="w-7 h-7 text-amber-700 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">A note on the token contribution</h3>
                <p className="text-slate-700 text-sm leading-relaxed">We call it a <strong>support contribution</strong>, not a membership fee \u2014 because nobody buys their way into seva. The minimum of <strong>₹500</strong> is symbolic; it covers the cost of issuing your card &amp; reports, and ensures only committed members join. Need a waiver? <a className="text-blue-800 underline underline-offset-2" href="mailto:membership@maakarmadevitrust.org">Write to us.</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The flow (multi-step form) */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-3xl">
          <MembershipFlow />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="bg-blue-50 text-blue-800 border-blue-100 mb-3">FAQ</Badge>
            <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Common questions about membership.</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition">
                <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                  {f.q}
                  <span className="text-blue-800 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-slate-600 mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
