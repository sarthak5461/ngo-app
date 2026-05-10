'use client'
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/admin/data-table'

const CAUSES = ['all', 'general', 'education', 'disaster-relief', 'environment', 'healthcare']

export default function DonationsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [cause, setCause] = useState('all')

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/donations?cause=${cause}`).then(r => r.json()).then(d => { setRows(d.rows || []); setLoading(false) }).catch(() => setLoading(false))
  }, [cause])

  useEffect(() => { load() }, [load])

  const columns = [
    { key: 'receiptNumber', label: 'Receipt', render: r => <span className="font-mono text-xs">{r.receiptNumber}</span> },
    { key: 'donorName', label: 'Donor', render: r => <div><div className="font-medium">{r.donorName}</div><div className="text-xs text-slate-500">{r.donorEmail}</div></div> },
    { key: 'amount', label: 'Amount', render: r => <span className="font-semibold text-blue-900">₹{(r.amount || 0).toLocaleString('en-IN')}</span> },
    { key: 'cause', label: 'Cause', render: r => <Badge variant="secondary" className="capitalize">{(r.cause || 'general').replace('-', ' ')}</Badge> },
    { key: 'panNumber', label: 'PAN', render: r => r.panNumber ? <span className="font-mono text-xs">{r.panNumber}</span> : '—' },
    { key: 'createdAt', label: 'Date', render: r => new Date(r.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Donations</h1>
        <p className="text-slate-500 mt-1">All successful donation transactions, with HMAC-verified payment IDs.</p>
      </div>
      <DataTable
        rows={rows} loading={loading} columns={columns}
        searchableKeys={['donorName', 'donorEmail', 'receiptNumber', 'paymentId']}
        onRefresh={load}
        exportUrl={`/api/admin/donations/export?cause=${cause}`}
        filters={
          <select value={cause} onChange={e => setCause(e.target.value)} className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white">
            {CAUSES.map(c => <option key={c} value={c}>{c === 'all' ? 'All causes' : c.replace('-', ' ')}</option>)}
          </select>
        }
      />
    </div>
  )
}
