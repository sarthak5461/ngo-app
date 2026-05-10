'use client'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, Image as ImageIcon, Check, Search, Link2 } from 'lucide-react'
import { toast } from 'sonner'

const MAX_BYTES = 10 * 1024 * 1024 // 10MB

export default function MediaPicker({ value, onChange, onClose, open }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(value)
  const [search, setSearch] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [tab, setTab] = useState('library') // library | url
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => { setSelected(value) }, [value])

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then(r => r.json()).then(d => {
      setItems(d.rows || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }
  useEffect(() => { if (open) load() }, [open])

  const uploadFile = async (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) return toast.error('Only image files are allowed')
    if (f.size > MAX_BYTES) return toast.error('Max 10MB per file')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', f)
      const r = await fetch('/api/admin/media', { method: 'POST', body: fd })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Upload failed')
      setSelected(d.url)
      load()
      toast.success(`Uploaded ${f.name}`)
    } catch (err) { toast.error(err.message) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragActive(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) uploadFile(f)
  }

  const useExternalUrl = () => {
    const u = (externalUrl || '').trim()
    if (!u) return
    setSelected(u)
    onChange(u)
    onClose()
  }

  const apply = () => { onChange(selected); onClose() }

  const filtered = (search ? items.filter(it => (it.name || '').toLowerCase().includes(search.toLowerCase())) : items)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="font-[Playfair_Display] text-xl">Pick or upload an image</DialogTitle>
        </DialogHeader>

        <div className="px-5 pt-4">
          <div className="flex border-b">
            <button type="button" onClick={() => setTab('library')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'library' ? 'border-blue-700 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Library</button>
            <button type="button" onClick={() => setTab('url')} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === 'url' ? 'border-blue-700 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>From URL</button>
          </div>
        </div>

        {tab === 'library' && (
          <div className="p-5"
               onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
               onDragLeave={() => setDragActive(false)}
               onDrop={onDrop}>
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9 h-9" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">{items.length} image(s) • drop to upload</span>
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => uploadFile(e.target.files?.[0])} className="hidden" />
                <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} variant="outline">
                  {uploading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4 mr-1.5" /> Upload</>}
                </Button>
              </div>
            </div>

            <div className={`relative rounded-lg ${dragActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
              {loading ? (
                <div className="py-12 text-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-400"><ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />{search ? 'No images match your search.' : 'Library is empty. Drop an image here or click Upload.'}</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[26rem] overflow-y-auto pr-1">
                  {filtered.map(it => {
                    const src = it.url || it.dataUrl
                    const sel = selected === src
                    return (
                      <button key={it.id} type="button" onClick={() => setSelected(src)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${sel ? 'border-blue-700 ring-2 ring-blue-300' : 'border-transparent hover:border-slate-300'}`}>
                        <img src={src} alt={it.name} className="w-full h-full object-cover" />
                        {sel && <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center"><Check className="w-4 h-4" /></div>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'url' && (
          <div className="p-5 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Image URL</label>
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-9" placeholder="https://images.unsplash.com/…" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} />
                </div>
                <Button onClick={useExternalUrl} disabled={!externalUrl.trim()} className="gradient-trust text-white">Use this URL</Button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Paste any public image URL (Unsplash, Pexels, your CDN…). The image must be reachable from the browser.</p>
            </div>
            {externalUrl && (
              <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden border bg-slate-100">
                <img src={externalUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t bg-slate-50 flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {tab === 'library' && (
            <Button onClick={apply} disabled={!selected} className="gradient-trust text-white"><Check className="w-4 h-4 mr-1.5" /> Use this image</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
