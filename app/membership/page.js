"use client";
import SiteShell from "@/components/site/site-shell";
import MembershipFlow from "./membership-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/components/site/content-provider";
import {
  HandHeart,
  Sparkles,
  Users,
  Mail,
  FileCheck2,
  Shield,
} from "lucide-react";

const ICONS = { HandHeart, Mail, Users, FileCheck2 };

function MembershipContent() {
  const heroheadline = useContent("membership.hero.headline");
  const words = (heroheadline || "").split(" ");
  const tail = words.length > 1 ? words.splice(-1).join(" ") : "";
  const head = words.join(" ");

  const herosubline = useContent("membership.hero.subline");

  const whyheadline = useContent("membership.why.headline");

  const whyCardsRaw = useContent("membership.why.cards", []);

  const whyCards =
    typeof whyCardsRaw === "string" ? safeJSON(whyCardsRaw) : whyCardsRaw;

  const tokenHeadline = useContent("membership.token.headline");
  const tokenNote = useContent("membership.token.note");

  const faqheadline = useContent("membership.faqs.headline");

  const faqsAccRaw = useContent("membership.faqs.accordion", []);

  const faqsAcc =
    typeof faqsAccRaw === "string" ? safeJSON(faqsAccRaw) : faqsAccRaw;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 gradient-trust text-white">
        <div className="container max-w-5xl">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Members of the Trust
          </Badge>
          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold leading-tight mb-5">
            {head} {tail && <span className="text-amber-400">{tail}</span>}
          </h1>
          <p className="text-lg lg:text-xl text-white/85 max-w-3xl leading-relaxed">
            {herosubline}
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-800 border-blue-100 mb-4"
            >
              Why become a member?
            </Badge>
            <h2 className="font-[Playfair_Display] text-4xl font-bold text-slate-900">
              {whyheadline}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(whyCards || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                const Icon = ICONS[t.icon] || HandHeart;
                return (
                  <Card
                    key={i}
                    className="border-0 shadow-md hover:shadow-lg transition"
                  >
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-lg gradient-trust flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">
                        {t.label}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Token contribution explainer 
      <section className="py-12 bg-slate-50">
        <div className="container max-w-4xl">
          <Card className="border-0 shadow-md bg-amber-50/60 border-amber-100">
            <CardContent className="p-7 flex items-start gap-4">
              <Shield className="w-7 h-7 text-amber-700 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  {tokenHeadline}
                </h3>
                <div
                  className="text-slate-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: tokenNote,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>*/}

      {/* The flow (multi-step form) 
      <section className='py-16 bg-slate-50'>
        <div className='container max-w-3xl'>
          <MembershipFlow />
        </div>
      </section>*/}

      {/* Membership coming soon */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-3xl">
          <Card className="border-0 shadow-md">
            <CardContent className="p-10 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full gradient-trust flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>

              <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900 mb-3">
                Membership Coming Soon
              </h2>

              <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
                Online membership registration is currently being set up. Please
                check back soon to become a member of the Trust.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-800 border-blue-100 mb-3"
            >
              FAQ
            </Badge>
            <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900">
              {faqheadline}
            </h2>
          </div>
          <div className="space-y-3">
            {(faqsAcc || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => (
                <details
                  key={i}
                  className="group border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition"
                >
                  <summary className="cursor-pointer font-semibold text-slate-900 flex items-center justify-between">
                    {t.title}
                    <span className="text-blue-800 text-xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {t.content}
                  </p>
                </details>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function MembershipPage() {
  return (
    <SiteShell>
      <MembershipContent />
    </SiteShell>
  );
}
