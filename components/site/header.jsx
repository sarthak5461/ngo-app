'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, HandHeart } from 'lucide-react'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'CSR Activities', href: '/csr' },
  { label: 'Blog', href: '/blog' },
  { label: 'Volunteer', href: '/#volunteer' },
  { label: 'Contact', href: '/contact' },
]

export default function SiteHeader({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (solid) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [solid])

  const isLight = scrolled || solid

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isLight ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${isLight ? 'gradient-trust' : 'bg-white/15 backdrop-blur border border-white/30'}`}>
            <HandHeart className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Maa Karma Devi</div>
            <div className={`text-[11px] tracking-wide ${isLight ? 'text-slate-500' : 'text-white/80'}`}>Sangh Trust • since 2008</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-7">
          {NAV.map(it => (
            <Link key={it.href} href={it.href} className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-700 hover:text-blue-800' : 'text-white/90 hover:text-white'}`}>
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex bg-blue-800 hover:bg-blue-900 text-white font-semibold shadow-md">
            <Link href="/membership">Become a Member</Link>
          </Button>
          <button onClick={() => setMobileOpen(true)} className={`xl:hidden p-2 rounded-md ${isLight ? 'text-slate-900' : 'text-white'}`} aria-label="Open menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="container flex justify-between items-center py-4 border-b">
            <span className="font-bold text-blue-900">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close menu"><X className="w-6 h-6" /></button>
          </div>
          <nav className="flex flex-col container gap-1 mt-2">
            {NAV.map(it => (
              <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)} className="py-3 px-2 border-b text-slate-800 font-medium">{it.label}</Link>
            ))}
            <Button asChild className="mt-5 bg-blue-800 hover:bg-blue-900 text-white font-semibold" onClick={() => setMobileOpen(false)}>
              <Link href="/membership">Become a Member</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
