import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Maa Karma Devi Sangh Trust | Hope, Education & Relief Across India',
  description: 'Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust - empowering communities through education, disaster relief and environmental action across India. Donate, volunteer, make a difference.',
  keywords: 'NGO India, donate, education for poor, disaster relief, environment, volunteer, charity, Maa Karma Devi Sangh Trust',
  openGraph: {
    title: 'Maa Karma Devi Sangh Trust',
    description: 'Empowering communities through Education, Disaster Relief & Environmental action.',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F4C81',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
