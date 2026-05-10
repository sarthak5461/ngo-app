'use client'
import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, Image as ImageIcon, X, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function MediaPicker({ value, onChange, onClose, open }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(value)
  const fileRef = useRef(null)

  useEffect(() => { setSelected(value) }, [value])

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then(r => r.json()).then(d => { setItems(d.rows || []); setLoading(false) })
  }
  useEffect(() => { if (open) load() }, [open])

  const onUpload = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 3 * 1024 * 1024) return toast.error('Max 3MB')
    setUploading(true)
    try {
      const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f) })
      const r = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: f.name, mimeType: f.type, size: f.size, dataUrl }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error)
      setSelected(d.dataUrl)
      load()
      toast.success('Uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploading(false); if (fileRef.current) fileRef.current.value = '' }
  }

  const apply = () => { onChange(selected); onClose() }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-5 border-b">
          <DialogTitle className="font-[Playfair_Display] text-xl">Pick or upload an image</DialogTitle>
        </DialogHeader>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">{items.length} image(s) in library</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} variant="outline">
              {uploading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4 mr-1.5" /> Upload new</>}
            </Button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-slate-400"><ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />Library is empty. Upload an image to start.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {items.map(it => {
                const sel = selected === it.dataUrl
                return (
                  <button key={it.id} type="button" onClick={() => setSelected(it.dataUrl)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${sel ? 'border-blue-700 ring-2 ring-blue-300' : 'border-transparent hover:border-slate-300'}`}>
                    <img src={it.dataUrl} alt={it.name} className="w-full h-full object-cover" />
                    {sel && <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center"><Check className="w-4 h-4" /></div>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-slate-50 flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={apply} disabled={!selected} className="gradient-trust text-white"><Check className="w-4 h-4 mr-1.5" /> Use this image</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
