'use client'

import Link from 'next/link'
import { Heart, HandHeart } from 'lucide-react'
import { NGO_FULL_NAME, NGO_SHORT } from '@/lib/content'
import { useContent, useContentList } from './content-provider'

const DEFAULT_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'CSR Activities', href: '/csr' },
  { label: 'Become a Member', href: '/membership' },
  { label: 'Blog & News', href: '/blog' },
  { label: 'Volunteer', href: '/#volunteer' },
]

export default function SiteFooter() {
  const aboutText = useContent('footer.about', `${NGO_FULL_NAME} is a registered non-profit working across Education, Disaster Relief, Environment and Healthcare. 12A & 80G certified.`)
  const links = useContentList('footer.links', DEFAULT_LINKS)
  const social = useContentList('footer.social', [])
  const trustReg = useContent('footer.reg.trust', 'Trust Reg: 432/2008')
  const pan = useContent('footer.reg.pan', 'PAN: AAATM0000K')
  const reg12a = useContent('footer.reg.12a', '12A: AAATM0000K/12A')
  const reg80g = useContent('footer.reg.80g', '80G: AAATM0000K/80G')
  const copyright = useContent('footer.copyright', `© ${NGO_SHORT}. All rights reserved.`)

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="container grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl gradient-trust flex items-center justify-center"><HandHeart className="w-6 h-6 text-white" /></div>
            <div>
              <div className="font-bold">Maa Karma Devi</div>
              <div className="text-xs text-slate-400">Sangh Trust • since 2008</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-md">{aboutText}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <Link href="/membership" className="hover:text-amber-300 underline-offset-4 hover:underline">Become a Member</Link>
            <span className="text-slate-700">•</span>
            <Link href="/#volunteer" className="hover:text-amber-300 underline-offset-4 hover:underline">Volunteer</Link>
            <span className="text-slate-700">•</span>
            <Link href="/csr" className="hover:text-amber-300 underline-offset-4 hover:underline">CSR</Link>
          </div>
          {social && social.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              {social.map((s, i) => (
                s?.href ? (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-300">
                    {s.label || s.href}
                  </a>
                ) : null
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-slate-400">
            {(links || []).filter(l => l && l.label).map((l, i) => (
              <li key={`${l.href}-${i}`}><Link href={l.href || '#'} className="hover:text-amber-300">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-4">Legal &amp; Compliance</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>{trustReg}</li>
            <li>{pan}</li>
            <li>{reg12a}</li>
            <li>{reg80g}</li>
            <li>FCRA: pending</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 container flex flex-col md:flex-row justify-between gap-3 text-sm text-slate-500">
        <div>{copyright.replace('©', `© ${new Date().getFullYear()}`)}</div>
        <div>Made with <Heart className="w-3 h-3 inline fill-amber-400 text-amber-400" /> for the people of Bharat.</div>
      </div>
    </footer>
  )
}
