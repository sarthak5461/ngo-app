'use client'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useDonate } from '@/components/site/donate-provider'

export default function DonateButton({ cause = 'general', label = 'Support this Cause', size = 'lg', className = '', variant = 'primary' }) {
  const { open } = useDonate()
  const styles = variant === 'primary'
    ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold shadow-xl shadow-amber-500/30'
    : 'bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-sm font-semibold'
  return (
    <Button onClick={() => open(cause)} size={size} className={`${styles} h-12 px-7 ${className}`}>
      <Heart className="w-5 h-5 mr-2 fill-current" /> {label}
    </Button>
  )
}
