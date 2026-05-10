import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Bell, Shield, Database, Webhook, Mail } from 'lucide-react'

export const metadata = { title: 'Settings | MKDS Admin' }

const GROUPS = [
  { icon: Shield, title: 'Authentication', items: [
    { label: 'Auth method', value: 'Cookie session (placeholder)', status: 'placeholder' },
    { label: 'Session expiry', value: '7 days' },
    { label: 'JWT support', value: 'Ready (architecture)', status: 'planned' },
    { label: 'OTP login', value: 'Ready (architecture)', status: 'planned' },
  ]},
  { icon: Webhook, title: 'Payments', items: [
    { label: 'Razorpay mode', value: 'Mock (HMAC verified)', status: 'placeholder' },
    { label: 'Production swap', value: 'Replace mock-pay endpoints', status: 'planned' },
    { label: 'Webhook endpoint', value: '/api/donations/verify', status: 'live' },
  ]},
  { icon: Mail, title: 'Notifications', items: [
    { label: 'Email receipts', value: 'Disabled', status: 'planned' },
    { label: 'SMS OTP', value: 'Disabled', status: 'planned' },
    { label: 'Provider', value: 'Resend / MSG91 (planned)' },
  ]},
  { icon: Database, title: 'Database & Storage', items: [
    { label: 'MongoDB cluster', value: 'Connected', status: 'live' },
    { label: 'Media storage', value: 'In-DB base64 (placeholder)', status: 'placeholder' },
    { label: 'CDN', value: 'Cloudinary swap-in ready', status: 'planned' },
  ]},
]

function Pill({ status }) {
  if (status === 'live') return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Live</Badge>
  if (status === 'placeholder') return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Placeholder</Badge>
  if (status === 'planned') return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Planned</Badge>
  return null
}

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">System configuration overview. Editable settings UI coming in the next phase.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {GROUPS.map((g, i) => {
          const Icon = g.icon
          return (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg gradient-trust flex items-center justify-center"><Icon className="w-5 h-5 text-white" /></div>
                  <h3 className="font-bold text-slate-900">{g.title}</h3>
                </div>
                <div className="space-y-2.5">
                  {g.items.map((it, j) => (
                    <div key={j} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{it.label}</span>
                      <div className="flex items-center gap-2"><span className="text-slate-900 font-medium">{it.value}</span><Pill status={it.status} /></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
