'use client'
import { Heart } from 'lucide-react'
import { useDonate } from './donate-provider'

export default function FloatingDonate() {
  const { open } = useDonate()
  return (
    <button onClick={() => open()} className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-full shadow-2xl shadow-amber-500/40 px-5 py-3 font-bold flex items-center gap-2 transition-transform hover:scale-105 lg:hidden">
      <Heart className="w-4 h-4 fill-current" /> Donate
    </button>
  )
}
