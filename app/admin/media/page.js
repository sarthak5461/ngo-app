'use client'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, Trash2, Copy, Loader2, ImageIcon } from 'lucide-react'

function prettySize(b) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

export default function MediaPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then(r => r.json()).then(d => { setItems(d.rows || []); setLoading(false) })
  }
  useEffect(load, [])

  const onUpload = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 3 * 1024 * 1024) return toast.error('File too large (max 3MB)')
    setUploading(true)
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result)
        r.onerror = reject
        r.readAsDataURL(f)
      })
      const res = await fetch('/api/admin/media', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, mimeType: f.type, size: f.size, dataUrl }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success('Uploaded')
      load()
    } catch (err) { toast.error(err.message) } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this image?')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500 mt-1">Reusable images for your website. Stored in MongoDB — ready for Cloudinary swap-in.</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="gradient-trust text-white">
          {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4 mr-2" /> Upload image</>}
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-sm text-amber-900">
          <strong>Storage placeholder:</strong> images currently stored as base64 in MongoDB (max 3MB each). For production, swap the <code>addMedia</code> service in <code>/lib/services/index.js</code> with Cloudinary/S3 SDK — the API contract stays identical.
        </CardContent>
      </Card>

      {loading ? (
        <div className="py-20 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin inline" /> Loading…</div>
      ) : items.length === 0 ? (
        <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          No media yet. Upload your first image to get started.
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(it => (
            <Card key={it.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="relative aspect-square bg-slate-100">
                <img src={it.dataUrl} alt={it.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(it.dataUrl); toast.success('URL copied') }} className="p-2 bg-white rounded-lg hover:bg-slate-100" title="Copy data URL"><Copy className="w-4 h-4 text-slate-700" /></button>
                  <button onClick={() => remove(it.id)} className="p-2 bg-white rounded-lg hover:bg-rose-50" title="Delete"><Trash2 className="w-4 h-4 text-rose-600" /></button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="text-xs font-medium text-slate-700 truncate">{it.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{prettySize(it.size || 0)} • {new Date(it.createdAt).toLocaleDateString('en-IN')}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
