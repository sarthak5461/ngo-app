import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileBarChart, HeartHandshake, IdCard, Users, Building2, Printer } from 'lucide-react'

const REPORTS = [
  { key: 'donations', icon: HeartHandshake, title: 'Donations report', desc: 'All successful donations — receipt, donor, amount, cause, payment ID, date.', url: '/api/admin/donations/export', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'members', icon: IdCard, title: 'Members report', desc: 'Active and pending members with contribution amount, validity dates and contact details.', url: '/api/admin/members/export', color: 'bg-blue-100 text-blue-800' },
  { key: 'volunteers', icon: Users, title: 'Volunteers report', desc: 'All volunteer sign-ups with area of interest, city, message and signup date.', url: '/api/admin/volunteers/export', color: 'bg-amber-100 text-amber-800' },
  { key: 'csr', icon: Building2, title: 'CSR inquiries report', desc: 'Corporate enquiries received via the CSR Activities page — company, designation, budget, message.', url: '/api/admin/contacts/export?kind=csr', color: 'bg-rose-100 text-rose-800' },
  { key: 'contacts', icon: FileBarChart, title: 'General contact messages', desc: 'All non-CSR contact form messages from the website.', url: '/api/admin/contacts/export?kind=general', color: 'bg-slate-100 text-slate-800' },
]

export const metadata = { title: 'Reports | MKDS Admin' }

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Generate CSV exports of any collection. PDF/printable reports coming soon — use browser Print on the listing pages for now.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {REPORTS.map(r => {
          const Icon = r.icon
          return (
            <Card key={r.key} className="border-0 shadow-sm hover:shadow-md transition">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${r.color}`}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{r.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild size="sm" className="gradient-trust text-white">
                        <a href={r.url} download><Download className="w-4 h-4 mr-1.5" /> Download CSV</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-5 flex items-start gap-3">
          <Printer className="w-5 h-5 text-amber-700 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>PDF / printable reports:</strong> roadmap item. The CSV exports above are production-ready. PDF generation will use <code>@react-pdf/renderer</code> on the server-side once the next phase begins.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
