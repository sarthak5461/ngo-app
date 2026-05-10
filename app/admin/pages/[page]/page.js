import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGES } from '@/lib/cms/schemas'
import PageEditor from '@/components/admin/page-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react'

export function generateStaticParams() {
  return Object.keys(PAGES).map(p => ({ page: p }))
}

export default function PageEditorRoute({ params }) {
  const page = PAGES[params.page]
  if (!page) notFound()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/pages" className="text-sm text-slate-500 hover:text-blue-800 inline-flex items-center gap-1.5 mb-2"><ArrowLeft className="w-3.5 h-3.5" /> All pages</Link>
          <h1 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">{page.label}</h1>
          <p className="text-slate-500 mt-1">{page.description}</p>
        </div>
        {page.href && (
          <Button asChild variant="outline"><Link href={page.href} target="_blank"><Eye className="w-4 h-4 mr-2" /> View live page <ExternalLink className="w-3 h-3 ml-1.5" /></Link></Button>
        )}
      </div>

      <PageEditor page={page} slug={params.page} />
    </div>
  )
}
