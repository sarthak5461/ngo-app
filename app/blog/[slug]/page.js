import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogBySlug, listBlogs } from "@/lib/services";
import SiteShell from "@/components/site/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Quote as QuoteIcon,
  User,
  HandHeart,
} from "lucide-react";
import RichText from "@/components/site/rich-text";

export async function generateMetadata({ params }) {
  const post = await getBlogBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: post.pageHeader?.seoTitle || post.hero?.title,

    description: post.pageHeader?.seoDescription || post.hero?.excerpt,

    openGraph: {
      title: post.pageHeader?.seoTitle || post.hero?.title,

      description: post.pageHeader?.seoDescription || post.hero?.excerpt,

      images: [post.hero?.coverImage],
    },
  };
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getReadingTime(html = "") {
  const text = html.replace(/<[^>]+>/g, "");

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function formatCategory(category = "") {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();
  const allBlogs = await listBlogs({
    $or: [
      {
        status: "published",
      },
      {
        status: "scheduled",
        scheduledFor: {
          $lte: new Date(),
        },
      },
    ],
  });

  const related = allBlogs
    .filter((b) => b.id !== post.id && b.hero?.category === post.hero?.category)
    .slice(0, 3);

  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className='relative h-[55vh] min-h-[400px] w-full overflow-hidden'>
        <img
          src={post.hero?.coverImage}
          alt={post.hero?.title}
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='absolute inset-0 hero-overlay' />
        <div className='relative container h-full flex flex-col justify-end pb-12 pt-24'>
          <Link
            href='/blog'
            className='text-white/80 hover:text-white text-sm flex items-center gap-1.5 mb-5'
          >
            <ArrowLeft className='w-4 h-4' /> Back to all posts
          </Link>
          <Badge className={`w-fit mb-4 ${post.hero?.category}`}>
            {formatCategory(post.hero?.category)}
          </Badge>
          <h1 className='font-[Playfair_Display] text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight mb-5'>
            {post.hero?.title}
          </h1>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-white/85 text-sm'>
            {/* <span className='flex items-center gap-1.5'>
              <User className='w-4 h-4' /> {post.author} —{" "}
              <span className='text-white/65'>{post.authorRole}</span>
            </span> */}
            <span className='flex items-center gap-1.5'>
              <Calendar className='w-4 h-4' />{" "}
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4' />
              {getReadingTime(post.content)} min read
            </span>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className='py-14 bg-white'>
        <article className='container max-w-3xl'>
          <p className='text-xl text-slate-600 leading-relaxed mb-8 pb-8 border-b font-medium italic'>
            {post.hero?.excerpt}
          </p>
          <RichText content={post.content} />

          {/* Author card 
          <Card className='border-0 shadow-md mt-12 bg-slate-50'>
            <CardContent className='p-6 flex items-start gap-4'>
              <div className='w-14 h-14 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-lg shrink-0'>
                {post.author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <div className='font-bold text-slate-900'>{post.author}</div>
                <div className='text-sm text-blue-800 font-medium mb-1'>
                  {post.authorRole}
                </div>
                <div className='text-sm text-slate-600'>
                  Sharing reflections from the work of Maa Karma Devi Sangh
                  Trust.
                </div>
              </div>
            </CardContent>
          </Card>*/}

          {/* Membership CTA mid-article (cause-driven, non-aggressive) */}
          <Card className='border-0 shadow-xl mt-10 gradient-trust text-white'>
            <CardContent className='p-8 text-center'>
              <HandHeart className='w-10 h-10 text-amber-300 mx-auto mb-3' />
              <h3 className='font-[Playfair_Display] text-2xl font-bold mb-2'>
                Stand with the Trust.
              </h3>
              <p className='text-white/85 mb-5 max-w-md mx-auto'>
                Stories like this run on the trust of our members. Become one —
                a simple application and a token contribution.
              </p>
              <Button
                asChild
                size='lg'
                className='bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-12 px-7 shadow-xl shadow-amber-500/30'
              >
                <Link href='/membership'>
                  <HandHeart className='w-4 h-4 mr-2' /> Become a Member
                </Link>
              </Button>
            </CardContent>
          </Card>
        </article>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className='py-14 bg-slate-50'>
          <div className='container'>
            <div className='flex items-end justify-between mb-8'>
              <h2 className='font-[Playfair_Display] text-3xl font-bold text-slate-900'>
                Continue reading
              </h2>
              <Button variant='ghost' asChild className='hidden md:inline-flex'>
                <Link href='/blog'>
                  All posts <ArrowRight className='w-4 h-4 ml-2' />
                </Link>
              </Button>
            </div>
            <div className='grid md:grid-cols-3 gap-5'>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className='group'>
                  <Card className='border-0 shadow-md hover:shadow-xl transition overflow-hidden h-full bg-white'>
                    <div className='relative h-44 overflow-hidden'>
                      <img
                        src={r.image}
                        alt={r.title}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                    </div>
                    <CardContent className='p-5'>
                      <Badge
                        variant='secondary'
                        className={`mb-2 ${CATEGORY_COLOR[r.category]}`}
                      >
                        {CATEGORY_LABEL[r.category]}
                      </Badge>
                      <h4 className='font-bold text-slate-900 mb-1 group-hover:text-blue-800 transition leading-snug'>
                        {r.title}
                      </h4>
                      <p className='text-sm text-slate-600 line-clamp-2'>
                        {r.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
