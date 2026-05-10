import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import { ROLES, ROLE_LABELS, ROLE_PERMISSIONS } from '@/lib/auth/rbac'

export const metadata = { title: 'User Management | MKDS Admin' }

const SAMPLE_USERS = [
  { name: 'Super Admin', email: 'admin@maakarmadevitrust.org', role: ROLES.SUPER_ADMIN, status: 'active' },
]

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Admins of this dashboard, with their roles and permissions. Multi-admin invite flow planned for next phase.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-sm text-amber-900">
          <strong>Placeholder:</strong> Currently a single password-based admin. Architecture supports 4 RBAC roles. Multi-user invite, password reset and role assignment will be wired in once JWT/email auth is enabled.
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="p-5 border-b"><h3 className="font-bold text-slate-900">Active admins</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr>
                <th className="text-left font-semibold px-4 py-3">Name</th>
                <th className="text-left font-semibold px-4 py-3">Email</th>
                <th className="text-left font-semibold px-4 py-3">Role</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
              </tr></thead>
              <tbody>
                {SAMPLE_USERS.map((u, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-xs">{u.name[0]}</div><span className="font-medium">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3"><Badge className="bg-blue-100 text-blue-800 border-blue-200">{ROLE_LABELS[u.role]}</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4"><ShieldCheck className="w-5 h-5 text-blue-800" /><h3 className="font-bold text-slate-900">RBAC role definitions</h3></div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(ROLES).map(role => (
              <div key={role} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2"><strong className="text-slate-900">{ROLE_LABELS[role]}</strong><Badge variant="secondary" className="text-[10px]">{(ROLE_PERMISSIONS[role] || []).length} perms</Badge></div>
                <div className="flex flex-wrap gap-1.5">
                  {(ROLE_PERMISSIONS[role] || []).slice(0, 6).map(p => (
                    <span key={p} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{p}</span>
                  ))}
                  {(ROLE_PERMISSIONS[role] || []).length > 6 && <span className="text-[10px] text-slate-500">+{(ROLE_PERMISSIONS[role] || []).length - 6} more</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
