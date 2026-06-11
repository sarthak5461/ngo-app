"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import SiteShell from "@/components/site/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/content";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => {
        setBlogs(d.rows || []);
        setLoading(false);
      });
  }, []);

  const featured = blogs.find((b) => b.featured) || blogs[0];

  const rest = blogs.filter((b) => b.id !== featured?.id);

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getReadingTime(html = "") {
    const text = html.replace(/<[^>]+>/g, "");

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  }

  if (loading) {
    return (
      <SiteShell>
        <div className='container py-12'>
          <div className='grid md:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='animate-pulse'>
                <div className='h-52 bg-slate-200 rounded-xl' />
                <div className='h-5 bg-slate-200 rounded mt-4' />
                <div className='h-4 bg-slate-200 rounded mt-2' />
              </div>
            ))}
          </div>
        </div>
      </SiteShell>
    );
  }

  if (!blogs.length) {
    return (
      <SiteShell>
        <div className='container py-20 text-center'>
          No blogs published yet.
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* Header */}
      <section className='pt-32 pb-10 gradient-trust text-white'>
        <div className='container'>
          <Badge className='bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-4 backdrop-blur-sm'>
            Blog &amp; News
          </Badge>
          <h1 className='font-[Playfair_Display] text-5xl lg:text-6xl font-bold mb-4'>
            Stories from the field.
          </h1>
          <p className='text-lg text-white/85 max-w-2xl'>
            Programme updates, photo diaries, annual reports and honest
            reflections from our volunteers and staff.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className='py-12 bg-slate-50'>
        <div className='container'>
          <Link
            href={`/blog/${featured?.pageHeader?.slug}`}
            className='group block'
          >
            <Card className='border-0 shadow-xl overflow-hidden'>
              <div className='grid lg:grid-cols-2'>
                <div className='relative h-72 lg:h-auto min-h-[320px]'>
                  <img
                    src={featured?.hero?.coverImage}
                    alt={featured?.hero?.title}
                    className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                  />
                  <div className='absolute top-4 left-4'>
                    <Badge className='bg-amber-500 text-slate-900 hover:bg-amber-500'>
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardContent className='p-8 lg:p-10 flex flex-col justify-center'>
                  <Badge
                    variant='secondary'
                    className={`w-fit mb-4 ${CATEGORY_COLOR[featured?.hero?.category]}`}
                  >
                    {CATEGORY_LABEL[featured?.hero?.category]}
                  </Badge>
                  <h2 className='font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-800 transition'>
                    {featured?.hero?.title}
                  </h2>
                  <p className='text-slate-600 leading-relaxed mb-6'>
                    {featured?.hero?.excerpt}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-slate-500 mb-5'>
                    <span className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />{" "}
                      {formatDate(featured.publishedAt || featured.createdAt)}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />{" "}
                      {getReadingTime(featured.readTime)} mins read
                    </span>
                  </div>
                  <span className='inline-flex items-center text-blue-800 font-semibold group-hover:translate-x-1 transition-transform'>
                    Read story <ArrowRight className='w-4 h-4 ml-2' />
                  </span>
                </CardContent>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className='py-12 bg-slate-50'>
        <div className='container'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.pageHeader?.slug}`}
                className='group'
              >
                <Card className='border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full bg-white'>
                  <div className='relative h-52 overflow-hidden'>
                    <img
                      src={post.hero?.coverImage}
                      alt={post.hero?.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                  </div>
                  <CardContent className='p-6'>
                    <Badge
                      variant='secondary'
                      className={`mb-3 ${CATEGORY_COLOR[post.hero?.category]}`}
                    >
                      {CATEGORY_LABEL[post.hero?.category] ||
                        post.hero?.category}
                    </Badge>
                    <h3 className='font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-800 transition leading-snug'>
                      {post.hero?.title}
                    </h3>
                    <p className='text-sm text-slate-600 line-clamp-3 mb-4'>
                      {post.hero?.excerpt}
                    </p>
                    <div className='flex items-center justify-between text-xs text-slate-500 pt-3 border-t'>
                      {/* <span>{post.author}</span> */}
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />{" "}
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 bg-white text-center'>
        <div className='container'>
          <h2 className='font-[Playfair_Display] text-3xl font-bold text-slate-900 mb-3'>
            Want to write for us?
          </h2>
          <p className='text-slate-600 mb-6 max-w-xl mx-auto'>
            If you have volunteered with us, been a beneficiary, or have a story
            from the field — we would love to publish it.
          </p>
          <Button asChild size='lg' className='gradient-trust text-white'>
            <Link href='/#contact'>Get in touch</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
