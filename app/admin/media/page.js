'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Upload, Trash2, Copy, Loader2, ImageIcon, Search, CheckCircle2, X } from 'lucide-react'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB

function prettySize(b) {
  if (!b) return '0 B'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

export default function MediaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(null) // { current, total, current_name }
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/media').then(r => r.json()).then(d => {
      setItems(d.rows || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  const uploadOne = async (f) => {
    if (!f.type.startsWith('image/')) { toast.error(`${f.name}: only image files allowed`); return null }
    if (f.size > MAX_BYTES) { toast.error(`${f.name}: too large (max 10MB)`); return null }
    const fd = new FormData()
    fd.append('file', f)
    const r = await fetch('/api/admin/media', { method: 'POST', body: fd })
    const d = await r.json()
    if (!r.ok) { toast.error(`${f.name}: ${d.error || 'upload failed'}`); return null }
    return d
  }

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    if (files.length === 0) return
    const total = files.length
    let okCount = 0
    for (let i = 0; i < total; i++) {
      setProgress({ current: i + 1, total, currentName: files[i].name })
      const res = await uploadOne(files[i])
      if (res) okCount++
    }
    setProgress(null)
    if (okCount > 0) toast.success(`${okCount}/${total} image(s) uploaded`)
    load()
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragActive(false)
    handleFiles(e.dataTransfer?.files)
  }

  const remove = async (id) => {
    if (!confirm('Delete this image? This cannot be undone.')) return
    const r = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    if (!r.ok) return toast.error('Delete failed')
    toast.success('Deleted')
    setSelected(s => { const n = new Set(s); n.delete(id); return n })
    load()
  }

  const bulkDelete = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} image(s)? This cannot be undone.`)) return
    const ids = Array.from(selected)
    let ok = 0
    for (const id of ids) {
      const r = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (r.ok) ok++
    }
    toast.success(`Deleted ${ok}/${ids.length}`)
    setSelected(new Set())
    load()
  }

  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const filtered = search ? items.filter(it => (it.name || '').toLowerCase().includes(search.toLowerCase())) : items

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500 mt-1">Drag & drop or upload images. Stored on disk and served as static files at <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">/uploads/&lt;id&gt;.&lt;ext&gt;</code>.</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <Button variant="outline" onClick={bulkDelete} className="text-rose-600 border-rose-200 hover:bg-rose-50">
              <Trash2 className="w-4 h-4 mr-2" /> Delete {selected.size}
            </Button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} disabled={!!progress} className="gradient-trust text-white">
            {progress ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading {progress.current}/{progress.total}…</> : <><Upload className="w-4 h-4 mr-2" /> Upload images</>}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search by file name…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
          )}
        </div>
        <span className="text-xs text-slate-500">{filtered.length} of {items.length}</span>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition ${dragActive ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200'} p-1`}
      >
        {loading ? (
          <div className="py-20 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin inline" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            {search ? 'No images match your search.' : (
              <>
                <p>No media yet — drop images here or click <strong>Upload images</strong>.</p>
                <p className="text-xs mt-1">JPG, PNG, WebP, SVG, GIF up to 10 MB each.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
            {filtered.map(it => {
              const src = it.url || it.dataUrl
              const isSelected = selected.has(it.id)
              return (
                <Card key={it.id} className={`border-0 shadow-sm overflow-hidden group transition relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                  {/* Selection checkbox */}
                  <button
                    type="button"
                    onClick={() => toggle(it.id)}
                    className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition ${isSelected ? 'bg-blue-700 text-white' : 'bg-white/90 backdrop-blur border border-slate-300 text-transparent hover:text-slate-300 group-hover:opacity-100 opacity-70'}`}
                    aria-label="Select"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="relative aspect-square bg-slate-100">
                    <img src={src} alt={it.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(src || ''); toast.success('URL copied') }} className="p-2 bg-white rounded-lg hover:bg-slate-100" title="Copy URL"><Copy className="w-4 h-4 text-slate-700" /></button>
                      <button onClick={() => remove(it.id)} className="p-2 bg-white rounded-lg hover:bg-rose-50" title="Delete"><Trash2 className="w-4 h-4 text-rose-600" /></button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="text-xs font-medium text-slate-700 truncate" title={it.name}>{it.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{prettySize(it.size || 0)} • {it.createdAt ? new Date(it.createdAt).toLocaleDateString('en-IN') : ''}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Drop overlay */}
        {dragActive && (
          <div className="absolute inset-0 rounded-xl bg-blue-50/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div className="text-blue-800 font-bold text-lg">Drop to upload</div>
          </div>
        )}
      </div>
    </div>
  )
}
