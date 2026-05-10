'use client'
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/admin/data-table'

const INTERESTS = ['all', 'education', 'disaster-relief', 'environment', 'healthcare']

export default function VolunteersPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [interest, setInterest] = useState('all')

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/volunteers?interest=${interest}`).then(r => r.json()).then(d => { setRows(d.rows || []); setLoading(false) })
  }, [interest])

  useEffect(() => { load() }, [load])

  const columns = [
    { key: 'name', label: 'Name', render: r => <div><div className="font-medium">{r.name}</div><div className="text-xs text-slate-500">{r.email}</div></div> },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'interest', label: 'Interest', render: r => <Badge variant="secondary" className="capitalize">{(r.interest || 'general').replace('-', ' ')}</Badge> },
    { key: 'message', label: 'Message', render: r => <div className="max-w-xs text-xs text-slate-600 line-clamp-2">{r.message || '—'}</div> },
    { key: 'createdAt', label: 'Signed up', render: r => new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Volunteers</h1>
        <p className="text-slate-500 mt-1">Sign-ups from the public website. Reach out within 48 hours.</p>
      </div>
      <DataTable
        rows={rows} loading={loading} columns={columns}
        searchableKeys={['name', 'email', 'city', 'phone']}
        onRefresh={load}
        exportUrl={`/api/admin/volunteers/export?interest=${interest}`}
        filters={
          <select value={interest} onChange={e => setInterest(e.target.value)} className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white capitalize">
            {INTERESTS.map(i => <option key={i} value={i}>{i.replace('-', ' ')}</option>)}
          </select>
        }
      />
    </div>
  )
}
