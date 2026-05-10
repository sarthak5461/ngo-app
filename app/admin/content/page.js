'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, Loader2, CheckCircle2 } from 'lucide-react'

// CMS-managed content blocks. Public site can read these via getContentBlock()
// to override hardcoded fallbacks in /lib/content.js.
const BLOCKS = [
  { key: 'hero.headline', label: 'Hero — Headline', textarea: false, fallback: 'Hope has a home.', help: 'Main headline on the homepage hero. Use "home." prefix to highlight in amber on the public site.' },
  { key: 'hero.subline', label: 'Hero — Sub-headline', textarea: true, fallback: 'A community-driven non-profit working across Education, Disaster Relief, Environment and Healthcare — with full transparency.' },
  { key: 'hero.tagline', label: 'Hero — NGO full name', textarea: false, fallback: 'Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust' },
  { key: 'about.headline', label: 'About — Headline', textarea: false, fallback: 'A Trust born of devotion, grown by service.' },
  { key: 'about.body', label: 'About — Story (paragraph)', textarea: true, fallback: 'Founded in 2008 in the holy land of Odisha, the Trust began as a small community kitchen serving the elderly and homeless near the temples of Puri.' },
  { key: 'mission.text', label: 'Mission statement', textarea: true, fallback: 'To uplift the most vulnerable sections of Indian society by delivering education, emergency relief and a healthier environment — with full accountability to our donors and dignity to our beneficiaries.' },
  { key: 'vision.text', label: 'Vision statement', textarea: true, fallback: 'An India where every child is in school, every disaster victim is rescued within hours, and every village has clean air, clean water, and the hope of a sustainable tomorrow.' },
  { key: 'contact.address', label: 'Contact — Address', textarea: true, fallback: 'Trust Bhavan, Grand Road, Puri, Odisha 752001, India' },
  { key: 'contact.phone', label: 'Contact — Phone', textarea: false, fallback: '+91 99999 88888' },
  { key: 'contact.email', label: 'Contact — Email', textarea: false, fallback: 'contact@maakarmadevitrust.org' },
  { key: 'seo.title', label: 'SEO — Default page title', textarea: false, fallback: 'Maa Karma Devi Sangh Trust | Hope, Education & Relief Across India' },
  { key: 'seo.description', label: 'SEO — Meta description', textarea: true, fallback: 'Empowering communities through Education, Disaster Relief, Environment and Healthcare across India.' },
]

export default function ContentPage() {
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState({})

  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(d => {
      const m = {}
      ;(d.rows || []).forEach(b => { m[b.key] = b.value })
      setValues(m)
      setLoading(false)
    })
  }, [])

  const save = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    try {
      const r = await fetch('/api/admin/content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] || '' }),
      })
      if (!r.ok) throw new Error('Save failed')
      toast.success(`Saved “${key}”`)
      setSaved(s => ({ ...s, [key]: true }))
      setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2000)
    } catch (err) { toast.error(err.message) } finally {
      setSaving(s => ({ ...s, [key]: false }))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Website Content</h1>
        <p className="text-slate-500 mt-1">Edit the text shown on your public website. Changes are stored in MongoDB and read by the public site at render time.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-sm text-amber-900">
          <strong>Note:</strong> The public site falls back to hardcoded copy in <code>/lib/content.js</code> when a block is empty. Saving a value here overrides the fallback. Wire-in for live override happens in each page via <code>getContentBlock(key, fallback)</code>.
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-20 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin inline" /> Loading content blocks…</div>
      ) : (
        <div className="grid gap-4">
          {BLOCKS.map(b => (
            <Card key={b.key} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 items-start justify-between mb-2">
                  <div>
                    <Label htmlFor={b.key} className="text-base font-bold text-slate-900">{b.label}</Label>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{b.key}</p>
                  </div>
                  <Button size="sm" onClick={() => save(b.key)} disabled={saving[b.key]} className="gradient-trust text-white">
                    {saving[b.key] ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving</> :
                     saved[b.key] ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Saved</> :
                     <><Save className="w-3.5 h-3.5 mr-1.5" /> Save</>}
                  </Button>
                </div>
                {b.textarea
                  ? <Textarea id={b.key} rows={3} value={values[b.key] || ''} onChange={e => setValues(v => ({ ...v, [b.key]: e.target.value }))} placeholder={b.fallback} />
                  : <Input id={b.key} value={values[b.key] || ''} onChange={e => setValues(v => ({ ...v, [b.key]: e.target.value }))} placeholder={b.fallback} />
                }
                {b.help && <p className="text-xs text-slate-500 mt-1.5">{b.help}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
