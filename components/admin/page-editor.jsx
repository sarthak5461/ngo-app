'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Save, CheckCircle2, ChevronDown, ChevronRight, Image as ImageIcon, Replace, Trash2, Upload, GripVertical, Plus, X, Eye, EyeOff } from 'lucide-react'
import MediaPicker from './media-picker'

function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition ${value ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
      {value ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
    </button>
  )
}

function ImageField({ value, onChange, fallback }) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const current = value || fallback
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-slate-100 border">
          {current ? <img src={current} alt="current" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8" /></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> {current ? 'Replace' : 'Select image'}
          </Button>
          {value && value !== fallback && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Reset to default
            </Button>
          )}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-1.5">{value ? 'Custom image set' : 'Using default image'}</p>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} value={current} onChange={onChange} />
    </div>
  )
}

function ListField({ value, onChange, itemFields, fallback }) {
  const items = Array.isArray(value) ? value : (value ? safeJSON(value) : (fallback || []))
  const update = (newItems) => onChange(newItems)
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    update(next)
  }
  const remove = (i) => update(items.filter((_, idx) => idx !== i))
  const add = () => {
    const blank = {}
    itemFields.forEach(f => { blank[f.key] = f.type === 'toggle' ? true : '' })
    update([...items, blank])
  }
  const setField = (i, key, v) => update(items.map((it, idx) => idx === i ? { ...it, [key]: v } : it))

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-3 border border-slate-200 rounded-lg bg-white">
          <div className="flex flex-col gap-0.5 shrink-0">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"><GripVertical className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            {itemFields.map(f => (
              <div key={f.key}>
                {f.type === 'toggle'
                  ? <Toggle value={!!it[f.key]} onChange={v => setField(i, f.key, v)} />
                  : <Input value={it[f.key] || ''} placeholder={f.label} onChange={e => setField(i, f.key, e.target.value)} />}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            <Button type="button" size="sm" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>↑</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)} className="text-rose-600 hover:bg-rose-50"><X className="w-4 h-4" /></Button>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={add}><Plus className="w-3.5 h-3.5 mr-1.5" /> Add item</Button>
    </div>
  )
}

function safeJSON(v) { try { return JSON.parse(v) } catch { return [] } }

function Field({ field, value, onChange }) {
  return (
    <div>
      <Label className="text-sm font-semibold text-slate-800">{field.label}</Label>
      {field.help && <p className="text-[11px] text-slate-500 mt-0.5 mb-1.5">{field.help}</p>}
      <div className="mt-1.5">
        {field.type === 'text' && <Input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.fallback || ''} />}
        {field.type === 'textarea' && <Textarea rows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.fallback || ''} />}
        {field.type === 'image' && <ImageField value={value} onChange={onChange} fallback={field.fallback} />}
        {field.type === 'list' && <ListField value={value} onChange={onChange} itemFields={field.itemFields} fallback={field.fallback} />}
      </div>
    </div>
  )
}

export default function PageEditor({ page, slug }) {
  const [values, setValues] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openSection, setOpenSection] = useState(page.sections[0]?.id)

  // Load existing values
  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(d => {
      const m = {}
      ;(d.rows || []).forEach(b => { m[b.key] = b.value })
      setValues(m)
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const setVal = (key, v) => setValues(s => ({ ...s, [key]: v }))

  const saveSection = async (section) => {
    setSaving(true)
    try {
      const writes = section.fields.map(f =>
        fetch('/api/admin/content', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: f.key, value: values[f.key] ?? '' }),
        })
      )
      const results = await Promise.all(writes)
      if (results.some(r => !r.ok)) throw new Error('Some fields failed to save')
      toast.success(`Saved “${section.label}”`)
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  if (!loaded) return <div className="py-20 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin inline" /></div>

  return (
    <div className="space-y-3">
      {page.sections.map(section => {
        const isOpen = openSection === section.id
        return (
          <Card key={section.id} className="border-0 shadow-sm overflow-hidden">
            <button type="button" onClick={() => setOpenSection(isOpen ? null : section.id)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 text-left transition">
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-5 h-5 text-blue-800" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                <div>
                  <div className="font-bold text-slate-900">{section.label}</div>
                  <div className="text-xs text-slate-500">{section.fields.length} field{section.fields.length === 1 ? '' : 's'}</div>
                </div>
              </div>
              {isOpen && (
                <div onClick={e => e.stopPropagation()}>
                  <Button size="sm" disabled={saving} onClick={() => saveSection(section)} className="gradient-trust text-white">
                    {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving</> : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save section</>}
                  </Button>
                </div>
              )}
            </button>
            {isOpen && (
              <CardContent className="px-5 pb-5 pt-0 border-t bg-slate-50/40">
                <div className="space-y-5 pt-4">
                  {section.fields.map(f => (
                    <Field key={f.key} field={f} value={values[f.key]} onChange={v => setVal(f.key, v)} />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
