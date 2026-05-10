'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, HandHeart } from 'lucide-react'
import { useContent, useContentList } from './content-provider'

const DEFAULT_NAV = [
  { label: 'Home', href: '/', enabled: true },
  { label: 'About', href: '/about', enabled: true },
  { label: 'Programs', href: '/programs', enabled: true },
  { label: 'CSR Activities', href: '/csr', enabled: true },
  { label: 'Blog', href: '/blog', enabled: true },
  { label: 'Volunteer', href: '/#volunteer', enabled: true },
  { label: 'Contact', href: '/contact', enabled: true },
]

export default function SiteHeader({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const brandTitle = useContent('header.logo.title', 'Maa Karma Devi')
  const brandSubtitle = useContent('header.logo.subtitle', 'Sangh Trust • since 2008')
  const ctaLabel = useContent('header.cta.label', 'Become a Member')
  const ctaHref = useContent('header.cta.href', '/membership')
  const navList = useContentList('header.nav', DEFAULT_NAV)
  const NAV = (navList || []).filter(n => n && n.label && (n.enabled === undefined || n.enabled))

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
            <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{brandTitle}</div>
            <div className={`text-[11px] tracking-wide ${isLight ? 'text-slate-500' : 'text-white/80'}`}>{brandSubtitle}</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-7">
          {NAV.map((it, i) => (
            <Link key={`${it.href}-${i}`} href={it.href || '#'} className={`text-sm font-medium transition-colors ${isLight ? 'text-slate-700 hover:text-blue-800' : 'text-white/90 hover:text-white'}`}>
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex bg-blue-800 hover:bg-blue-900 text-white font-semibold shadow-md">
            <Link href={ctaHref || '/membership'}>{ctaLabel}</Link>
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
            {NAV.map((it, i) => (
              <Link key={`m-${it.href}-${i}`} href={it.href || '#'} onClick={() => setMobileOpen(false)} className="py-3 px-2 border-b text-slate-800 font-medium">{it.label}</Link>
            ))}
            <Button asChild className="mt-5 bg-blue-800 hover:bg-blue-900 text-white font-semibold" onClick={() => setMobileOpen(false)}>
              <Link href={ctaHref || '/membership'}>{ctaLabel}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
