"use client";

import SiteShell from "@/components/site/site-shell";
import RichText from "@/components/site/rich-text";
import { useContent } from "./content-provider";

export default function TermsConditions() {
  const pageHeadline = useContent(
    "terms.term-conditions.headline",
    "Privacy Policy",
  );

  const pageContent = useContent("terms.term-conditions.content", "");

  const updatedAt = useContent("terms.term-conditions.updatedAt");

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <SiteShell solidHeader>
      {/* Hero */}
      <section className='pt-36 pb-16 bg-slate-50 border-b'>
        <div className='container max-w-5xl'>
          <span className='inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 mb-5'>
            Legal Information
          </span>

          <h1 className='font-[Playfair_Display] text-5xl font-bold text-slate-900'>
            {pageHeadline}
          </h1>

          <p className='mt-5 text-lg text-slate-600 max-w-3xl'>
            Please read these terms carefully before using our website, making
            donations, or engaging with the services and initiatives of Maa
            Karma Devi Trust.
          </p>

          <div className='mt-8 flex flex-wrap gap-6 text-sm text-slate-500'>
            <span>
              Last Updated:
              <strong className='ml-1 text-slate-700'>
                {formatDate(updatedAt)}
              </strong>
            </span>

            <span>
              Version:
              <strong className='ml-1 text-slate-700'>v1.0</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='py-16 bg-white'>
        <div className='container max-w-5xl'>
          <div className='rounded-3xl border border-slate-200 bg-white shadow-sm p-8 lg:p-12'>
            <RichText
              content={pageContent}
              className='
                prose-slate
                max-w-none
                prose-headings:font-[Playfair_Display]
                prose-headings:text-slate-900
                prose-h2:text-3xl
                prose-h2:mt-10
                prose-h2:mb-4
                prose-h3:text-2xl
                prose-h3:mt-8
                prose-p:text-slate-700
                prose-p:leading-8
                prose-li:leading-8
                prose-strong:text-slate-900
                prose-a:text-blue-700
                prose-a:no-underline
                hover:prose-a:underline
              '
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
