'use client'
import Link from 'next/link'
import { HandHeart } from 'lucide-react'

export default function FloatingDonate() {
  return (
    <Link href="/membership" className="fixed bottom-6 right-6 z-40 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-2xl shadow-blue-900/40 px-5 py-3 font-semibold flex items-center gap-2 transition-transform hover:scale-105 xl:hidden">
      <HandHeart className="w-4 h-4" /> Become a Member
    </Link>
  )
}
