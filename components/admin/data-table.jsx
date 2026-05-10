'use client'
import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, RefreshCw, Loader2 } from 'lucide-react'

export default function DataTable({
  rows = [],
  columns,
  loading = false,
  searchableKeys = [],
  onRefresh,
  exportUrl,
  filters,
  emptyMessage = 'No records found.',
  rowKey = 'id',
}) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q) return rows
    const Q = q.toLowerCase()
    return rows.filter(r =>
      searchableKeys.some(k => String(r[k] || '').toLowerCase().includes(Q))
    )
  }, [rows, q, searchableKeys])

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="pl-9 bg-slate-50 border-slate-200" />
          </div>
          {filters}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="shrink-0">
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          )}
          {exportUrl && (
            <Button asChild variant="outline" size="sm" className="shrink-0 border-blue-200 text-blue-800 hover:bg-blue-50">
              <a href={exportUrl} download><Download className="w-4 h-4 mr-1.5" /> Export CSV</a>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {columns.map((c, i) => (
                  <th key={i} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">{emptyMessage}</td></tr>
              ) : filtered.map((row, i) => (
                <tr key={row[rowKey] || i} className="border-t hover:bg-slate-50/50">
                  {columns.map((c, j) => (
                    <td key={j} className="px-4 py-3 align-top">{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t text-xs text-slate-500">Showing {filtered.length} of {rows.length} records</div>
        )}
      </CardContent>
    </Card>
  )
}
