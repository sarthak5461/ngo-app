'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, FileEdit, ExternalLink } from 'lucide-react'
import { PAGES } from '@/lib/cms/schemas'

export default function PagesIndex() {
  const list = Object.entries(PAGES).map(([slug, p]) => ({ slug, ...p }))
  const [usage, setUsage] = useState({})

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(d => {
      const map = {}
      ;(d.rows || []).forEach(b => { map[b.key] = true })
      setUsage(map)
    })
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Pages</h1>
        <p className="text-slate-500 mt-1">Pick a page to edit its sections, text, images and CTAs. Changes save to MongoDB and reflect on the live site.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(p => {
          let total = 0, set = 0
          for (const s of p.sections) for (const f of s.fields) {
            total++
            if (usage[f.key]) set++
          }
          return (
            <Card key={p.slug} className="border-0 shadow-sm hover:shadow-md transition group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg gradient-trust flex items-center justify-center"><FileEdit className="w-5 h-5 text-white" /></div>
                  <Badge variant="secondary" className={set > 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}>{set}/{total} set</Badge>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{p.label}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/admin/pages/${p.slug}`} className="text-sm font-semibold text-blue-800 inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Edit page <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                  {p.href && <Link href={p.href} target="_blank" className="text-xs text-slate-400 hover:text-blue-800 inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Live</Link>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
