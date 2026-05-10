'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/sidebar'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return }
    fetch('/api/admin/me').then(async r => {
      if (r.ok) setUser(await r.json())
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [pathname])

  // Login page renders standalone
  if (pathname === '/admin/login') return <>{children}</>

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar user={user} />
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <main className="p-5 lg:p-8 max-w-[1400px]">{children}</main>
      </div>
    </div>
  )
}
