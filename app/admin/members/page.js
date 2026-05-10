'use client'
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/admin/data-table'

const STATUSES = ['all', 'active', 'pending_payment', 'payment_failed']

export default function MembersPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/members?status=${status}`).then(r => r.json()).then(d => { setRows(d.rows || []); setLoading(false) })
  }, [status])

  useEffect(() => { load() }, [load])

  const statusBadge = (s) => {
    if (s === 'active') return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
    if (s === 'payment_failed') return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Failed</Badge>
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
  }

  const columns = [
    { key: 'memberId', label: 'Member ID', render: r => <span className="font-mono text-xs">{r.memberId || '—'}</span> },
    { key: 'name', label: 'Name', render: r => <div><div className="font-medium">{r.name}</div><div className="text-xs text-slate-500">{r.email}</div></div> },
    { key: 'mobile', label: 'Mobile' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'amount', label: 'Contribution', render: r => <span className="font-semibold text-blue-900">₹{(r.amount || 0).toLocaleString('en-IN')}</span> },
    { key: 'status', label: 'Status', render: r => statusBadge(r.status) },
    { key: 'validUntil', label: 'Valid Until', render: r => r.validUntil ? new Date(r.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Members</h1>
        <p className="text-slate-500 mt-1">Active and pending Trust members. Memberships renew yearly.</p>
      </div>
      <DataTable
        rows={rows} loading={loading} columns={columns}
        searchableKeys={['name', 'email', 'memberId', 'mobile']}
        onRefresh={load}
        exportUrl={`/api/admin/members/export?status=${status}`}
        filters={
          <select value={status} onChange={e => setStatus(e.target.value)} className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white capitalize">
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        }
      />
    </div>
  )
}
