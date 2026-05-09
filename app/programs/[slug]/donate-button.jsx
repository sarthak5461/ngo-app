'use client'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useDonate } from '@/components/site/donate-provider'

export default function DonateButton({ cause = 'general', label = 'Donate Now', size = 'lg', className = '' }) {
  const { open } = useDonate()
  return (
    <Button onClick={() => open(cause)} size={size} className={`bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-xl shadow-amber-500/30 h-12 px-7 ${className}`}>
      <Heart className="w-5 h-5 mr-2 fill-current" /> {label}
    </Button>
  )
}
