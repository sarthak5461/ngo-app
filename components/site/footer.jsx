'use client'

import Link from 'next/link'
import { Heart, HandHeart } from 'lucide-react'
import { NGO_FULL_NAME, NGO_SHORT } from '@/lib/content'

export default function SiteFooter() {
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
          <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-md">
            {NGO_FULL_NAME} is a registered non-profit working across Education, Disaster Relief, Environment and Healthcare. 12A &amp; 80G certified.
          </p>
          <div className="flex gap-3 text-sm text-slate-400">
            <Link href="/membership" className="hover:text-amber-300 underline-offset-4 hover:underline">Become a Member</Link>
            <span className="text-slate-700">•</span>
            <Link href="/#volunteer" className="hover:text-amber-300 underline-offset-4 hover:underline">Volunteer</Link>
            <span className="text-slate-700">•</span>
            <Link href="/csr" className="hover:text-amber-300 underline-offset-4 hover:underline">CSR</Link>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/about" className="hover:text-amber-300">About Us</Link></li>
            <li><Link href="/programs" className="hover:text-amber-300">Programs</Link></li>
            <li><Link href="/csr" className="hover:text-amber-300">CSR Activities</Link></li>
            <li><Link href="/membership" className="hover:text-amber-300">Become a Member</Link></li>
            <li><Link href="/blog" className="hover:text-amber-300">Blog &amp; News</Link></li>
            <li><Link href="/#impact" className="hover:text-amber-300">Our Impact</Link></li>
            <li><Link href="/#volunteer" className="hover:text-amber-300">Volunteer</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-4">Legal &amp; Compliance</div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Trust Reg: 432/2008</li>
            <li>PAN: AAATM0000K</li>
            <li>12A: AAATM0000K/12A</li>
            <li>80G: AAATM0000K/80G</li>
            <li>FCRA: pending</li>
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
