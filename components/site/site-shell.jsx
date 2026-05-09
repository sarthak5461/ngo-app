'use client'

import DonateProvider from './donate-provider'
import SiteHeader from './header'
import SiteFooter from './footer'
import FloatingDonate from './floating-donate'

export default function SiteShell({ children, solidHeader = true }) {
  return (
    <DonateProvider>
      <div className="bg-white min-h-screen">
        <SiteHeader solid={solidHeader} />
        <main>{children}</main>
        <SiteFooter />
        <FloatingDonate />
      </div>
    </DonateProvider>
  )
}
