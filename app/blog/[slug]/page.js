import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteShell from '@/components/site/site-shell'
import DonateButton from '@/app/programs/[slug]/donate-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, ArrowRight, Quote as QuoteIcon, User } from 'lucide-react'
import { BLOG_POSTS, BLOG_BY_SLUG, CATEGORY_LABEL, CATEGORY_COLOR } from '@/lib/content'

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }) {
  const p = BLOG_BY_SLUG[params.slug]
  if (!p) return { title: 'Story Not Found' }
  return {
    title: `${p.title} | Maa Karma Devi Sangh Trust`,
    description: p.excerpt,
    openGraph: { title: p.title, description: p.excerpt, images: [p.image] },
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function Block({ block }) {
  if (block.type === 'h2') return <h2 className="font-[Playfair_Display] text-2xl lg:text-3xl font-bold text-slate-900 mt-10 mb-3">{block.text}</h2>
  if (block.type === 'p') return <p className="text-slate-700 leading-relaxed text-lg mb-5">{block.text}</p>
  if (block.type === 'quote') return (
    <figure className="my-8 border-l-4 border-amber-500 bg-amber-50 px-6 py-5 rounded-r-lg">
      <QuoteIcon className="w-7 h-7 text-amber-500 mb-2" />
      <blockquote className="text-xl italic text-slate-800 leading-relaxed">{block.text}</blockquote>
    </figure>
  )
  if (block.type === 'list') return (
    <ul className="space-y-2 mb-6">
      {block.items.map((it, i) => (
        <li key={i} className="flex gap-3 text-slate-700 leading-relaxed text-lg">
          <span className="text-amber-500 mt-1">•</span><span>{it}</span>
        </li>
      ))}
    </ul>
  )
  return null
}

export default function BlogPostPage({ params }) {
  const post = BLOG_BY_SLUG[params.slug]
  if (!post) notFound()
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug && (p.category === post.category || post.category === 'general')).slice(0, 3)

  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container h-full flex flex-col justify-end pb-12 pt-24">
          <Link href="/blog" className="text-white/80 hover:text-white text-sm flex items-center gap-1.5 mb-5"><ArrowLeft className="w-4 h-4" /> Back to all posts</Link>
          <Badge className={`w-fit mb-4 ${CATEGORY_COLOR[post.category]}`}>{CATEGORY_LABEL[post.category]}</Badge>
          <h1 className="font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight mb-5">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/85 text-sm">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author} — <span className="text-white/65">{post.authorRole}</span></span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-14 bg-white">
        <article className="container max-w-3xl">
          <p className="text-xl text-slate-600 leading-relaxed mb-8 pb-8 border-b font-medium italic">{post.excerpt}</p>
          {post.content.map((block, i) => <Block key={i} block={block} />)}

          {/* Author card */}
          <Card className="border-0 shadow-md mt-12 bg-slate-50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-14 h-14 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-lg shrink-0">{post.author.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
              <div>
                <div className="font-bold text-slate-900">{post.author}</div>
                <div className="text-sm text-blue-800 font-medium mb-1">{post.authorRole}</div>
                <div className="text-sm text-slate-600">Sharing reflections from the work of Maa Karma Devi Sangh Trust.</div>
              </div>
            </CardContent>
          </Card>

          {/* Donate CTA mid-article */}
          <Card className="border-0 shadow-xl mt-10 gradient-trust text-white">
            <CardContent className="p-8 text-center">
              <h3 className="font-[Playfair_Display] text-2xl font-bold mb-2">Stories like this run on donations.</h3>
              <p className="text-white/85 mb-5">Your contribution funds the field work behind every post.</p>
              <DonateButton cause={post.category === 'general' ? 'general' : post.category} label="Donate now" />
            </CardContent>
          </Card>
        </article>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 bg-slate-50">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">Continue reading</h2>
              <Button variant="ghost" asChild className="hidden md:inline-flex"><Link href="/blog">All posts <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
                  <Card className="border-0 shadow-md hover:shadow-xl transition overflow-hidden h-full bg-white">
                    <div className="relative h-44 overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <CardContent className="p-5">
                      <Badge variant="secondary" className={`mb-2 ${CATEGORY_COLOR[r.category]}`}>{CATEGORY_LABEL[r.category]}</Badge>
                      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-800 transition leading-snug">{r.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">{r.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  )
}
