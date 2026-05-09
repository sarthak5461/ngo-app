'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, HandHeart } from 'lucide-react'
import { NGO_FULL_NAME, NGO_SHORT } from '@/lib/content'
import { useDonate } from './donate-provider'

export default function SiteFooter() {
  const { open: openDonate } = useDonate()
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
          <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-md">
            {NGO_FULL_NAME} is a registered non-profit working across Education, Disaster Relief and Environment. 12A &amp; 80G certified.
          </p>
          <Button onClick={() => openDonate()} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
            <Heart className="w-4 h-4 mr-2 fill-current" /> Donate Now
          </Button>
        </div>

        <div>
          <div className="font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/about" className="hover:text-amber-300">About Us</Link></li>
            <li><Link href="/programs" className="hover:text-amber-300">Programs</Link></li>
            <li><Link href="/blog" className="hover:text-amber-300">Blog</Link></li>
            <li><Link href="/#impact" className="hover:text-amber-300">Our Impact</Link></li>
            <li><Link href="/#volunteer" className="hover:text-amber-300">Volunteer</Link></li>
            <li><Link href="/#contact" className="hover:text-amber-300">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-4">Legal</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Trust Reg: 432/2008</li>
            <li>PAN: AAATM0000K</li>
            <li>12A: AAATM0000K/12A</li>
            <li>80G: AAATM0000K/80G</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 container flex flex-col md:flex-row justify-between gap-3 text-sm text-slate-500">
        <div>© {new Date().getFullYear()} {NGO_SHORT}. All rights reserved.</div>
        <div>Made with <Heart className="w-3 h-3 inline fill-amber-400 text-amber-400" /> for the people of Bharat.</div>
      </div>
    </footer>
  )
}
