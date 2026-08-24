"use client";
import SiteShell from "@/components/site/site-shell";
import CSRForm from "./csr-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RichText from "@/components/site/rich-text";
import {
  Building2,
  Users,
  HandHeart,
  Award,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";
import { useContent } from "@/components/site/content-provider";

const ICONS = { Shield, Award, Sparkles, Briefcase, Globe, HandHeart, Users };

function CSRPageContent() {
  // Highlight last 2 words of headline for legacy visual.

  const heroheadline = useContent(
    "csr.hero.headline",
    "CSR partnerships that deliver real, audited impact.",
  );

  const words = (heroheadline || "").split(" ");
  const tail = words.length > 2 ? words.splice(-2).join(" ") : "";
  const head = words.join(" ");

  const herosubline = useContent("csr.hero.subline");

  const csrCardsRaw = useContent("csr.cards.cards", []);

  const csrCards =
    typeof csrCardsRaw === "string" ? safeJSON(csrCardsRaw) : csrCardsRaw;

  const partnersHeadline = useContent("csr.partnerships.headline");

  const partnerssubline = useContent("csr.partnerships.subline");

  const partnerCardsRaw = useContent("csr.partnerships.cards", []);

  const partnerCards =
    typeof partnerCardsRaw === "string"
      ? safeJSON(partnerCardsRaw)
      : partnerCardsRaw;

  const pastPartnersheadline = useContent("csr.partners.headline");
  const pastPartnersRaw = useContent("csr.partners.partners", []);

  const pastPartners =
    typeof pastPartnersRaw === "string"
      ? safeJSON(pastPartnersRaw)
      : pastPartnersRaw;

  const benifitsHeadline = useContent("csr.benifits.headline");

  const benifitsPointsRaw = useContent("csr.benifits.points", []);

  const benifitsPoints =
    typeof benifitsPointsRaw === "string"
      ? safeJSON(benifitsPointsRaw)
      : benifitsPointsRaw;

  return (
    <>
      {/* Hero */}
      <section className='pt-32 pb-16 gradient-trust text-white'>
        <div className='container max-w-5xl'>
          <Badge className='bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm'>
            <Building2 className='w-3.5 h-3.5 mr-1.5' /> For Corporates &amp;
            CSR Heads
          </Badge>
          <h1 className='font-[Playfair_Display] text-5xl lg:text-6xl font-bold leading-tight mb-5'>
            {head} {tail && <span className='text-amber-400'>{tail}</span>}
          </h1>
          <div
            dangerouslySetInnerHTML={{
              __html: herosubline,
            }}
            className='text-lg lg:text-xl text-white/85 max-w-3xl leading-relaxed'
          />
        </div>
      </section>

      {/* Trust pillars */}
      <section className='py-16 bg-white'>
        <div className='container'>
          <div className='grid md:grid-cols-3 gap-5'>
            {(csrCards || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                const Icon = ICONS[t.icon] || Shield;
                return (
                  <Card
                    key={i}
                    className='border-0 shadow-md hover:shadow-lg transition'
                  >
                    <CardContent className='p-7'>
                      <div className='w-12 h-12 rounded-xl gradient-trust flex items-center justify-center mb-4'>
                        <Icon className='w-6 h-6 text-white' />
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-2'>
                        {t.label}
                      </h3>
                      <p className='text-slate-600 leading-relaxed'>
                        {t.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Partnership types */}
      <section className='py-20 bg-slate-50'>
        <div className='container'>
          <div className='text-center max-w-2xl mx-auto mb-14'>
            <Badge
              variant='secondary'
              className='bg-blue-50 text-blue-800 border-blue-100 mb-4'
            >
              Ways to partner
            </Badge>
            <h2 className='font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-4'>
              {partnersHeadline}
            </h2>
            <p className='text-slate-600 text-lg'>{partnerssubline}</p>
          </div>
          <div className='grid md:grid-cols-2 gap-6'>
            {(partnerCards || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                const Icon = ICONS[t.icon] || Shield;
                return (
                  <Card
                    key={i}
                    className='border-0 shadow-md hover:shadow-xl transition'
                  >
                    <CardContent className='p-7'>
                      <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4'>
                        <Icon className='w-6 h-6 text-blue-800' />
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-2'>
                        {t.label}
                      </h3>
                      <RichText content={t.contnet} />
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Past partners */}
      <section className='py-16 bg-white'>
        <div className='container max-w-5xl text-center'>
          <p className='text-sm text-slate-500 uppercase tracking-widest mb-6'>
            {pastPartnersheadline}
          </p>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {(pastPartners || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => (
                <div
                  key={i}
                  className='p-4 bg-slate-50 rounded-lg text-slate-700 font-semibold text-sm'
                >
                  {t.partner}
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className='py-20 bg-slate-50'>
        <div className='container max-w-4xl'>
          <Badge
            variant='secondary'
            className='bg-emerald-50 text-emerald-800 border-emerald-100 mb-4'
          >
            What CSR partners receive
          </Badge>
          <h2 className='font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-8'>
            {benifitsHeadline}
          </h2>
          <div className='grid sm:grid-cols-2 gap-4'>
            {(benifitsPoints || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-emerald-600 mt-0.5 shrink-0' />
                  <span className='text-slate-700'>{t.label}</span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CSR Contact form */}
      <section id='csr-contact' className='py-20 bg-white'>
        <div className='container max-w-5xl'>
          <div className='text-center max-w-2xl mx-auto mb-10'>
            <Badge
              variant='secondary'
              className='bg-blue-50 text-blue-800 border-blue-100 mb-4'
            >
              Start the conversation
            </Badge>
            <h2 className='font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-3'>
              Let&apos;s explore a partnership.
            </h2>
            <p className='text-slate-600'>
              Drop us a note and our CSR Lead will respond within one business
              day.
            </p>
          </div>
          <CSRForm />
        </div>
      </section>
    </>
  );
}

export default function CSRPage() {
  return (
    <SiteShell>
      <CSRPageContent />
    </SiteShell>
  );
}
