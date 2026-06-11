"use client";

import Link from "next/link";
import SiteShell from "@/components/site/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  Heart,
  Award,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import { IMG, NGO_FULL_NAME } from "@/lib/content";
import { useContent } from "@/components/site/content-provider";

const ICONS = [Shield, Heart, Sparkles, Users];

export default function AboutPage() {
  const heroHeadline = useContent(
    "about.hero.headline",
    "A Trust born of devotion, grown by service.",
  );

  // Highlight last 2 words of headline for legacy visual.
  const words = (heroHeadline || "").split(" ");
  const tail = words.length > 2 ? words.splice(-2).join(" ") : "";
  const head = words.join(" ");

  const heroSubline = useContent(
    "about.hero.subline",
    "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust",
  );
  const heroImage = useContent("about.hero.image", IMG.about);

  const storyheadline = useContent(
    "about.story.headline",
    "Beyond Relief — Empowering Lives & Building Better Futures",
  );
  const storyBody = useContent(
    "about.story.body",
    "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust is a registered non-profit organization devoted to the service of humanity through spiritual, social, and cultural initiatives. Guided by the divine grace of Lord Jagannath and Maa Karma Devi, the trust is committed to promoting devotion, women empowerment, environmental sustainability, cultural and historical preservation, education, and disaster relief. Our mission is to inspire collective growth, compassion, and harmony across communities through selfless service and faith.",
  );

  const storyPointsRaw = useContent("about.story.points", []);

  const storyPoints =
    typeof storyPointsRaw === "string"
      ? safeJSON(storyPointsRaw)
      : storyPointsRaw;

  const valueheadline = useContent(
    "about.value.headline",
    "Four values that shape every decision.",
  );

  const valuePointsRaw = useContent("about.values.cards", []);

  const valuePoints =
    typeof valuePointsRaw === "string"
      ? safeJSON(valuePointsRaw)
      : valuePointsRaw;

  const missonCardsRaw = useContent("about.mission.cards", []);

  const missonCards =
    typeof missonCardsRaw === "string"
      ? safeJSON(missonCardsRaw)
      : missonCardsRaw;

  const trusteesheadline = useContent(
    "about.trustees.headline",
    "The Board of Trustees.",
  );

  const trusteesCardsRaw = useContent("about.trustees.cards", []);

  const trusteesCards =
    typeof trusteesCardsRaw === "string"
      ? safeJSON(trusteesCardsRaw)
      : trusteesCardsRaw;

  const volunteerHeadline = useContent(
    "about.bottom_pane.headline",
    "Be part of the next chapter.",
  );

  const volunteersubline = useContent(
    "about.bottom_pane.subline",
    "4 years of service. 4,200+ lives. We are just getting started.",
  );

  const volunteerProgBtn = useContent(
    "about.bottom_pane.program_button_text",
    "Explore Programms",
  );

  const volunteerProgBtnLink = useContent(
    "about.bottom_pane.program_button_link",
    "/programs",
  );

  const volunteerBtn = useContent(
    "about.bottom_pane.vol_button_text",
    "Volunteer with us",
  );

  const volunteerBtnLink = useContent(
    "about.bottom_pane.vol_button_link",
    "/#volunteer",
  );

  return (
    <SiteShell solidHeader={false}>
      {/* Hero */}
      <section className='relative h-[70vh] min-h-[500px] w-full overflow-hidden'>
        <img
          src={heroImage}
          alt='Community we serve'
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='absolute inset-0 hero-overlay' />
        <div className='relative container h-full flex flex-col justify-center pt-20'>
          <Badge className='bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-5 backdrop-blur-sm w-fit'>
            <Sparkles className='w-3.5 h-3.5 mr-1.5' /> About the Trust
          </Badge>
          <h1 className='font-[Playfair_Display] text-5xl lg:text-6xl font-bold text-white text-balance leading-[1.05] mb-4 max-w-3xl'>
            {head} {tail && <span className='text-amber-400'>{tail}</span>}
          </h1>
          <p className='text-lg text-white/85 max-w-2xl'>{heroSubline}</p>
        </div>
      </section>

      {/* Story */}
      <section className='py-20 bg-white'>
        <div className='container max-w-4xl'>
          <Badge
            variant='secondary'
            className='bg-blue-50 text-blue-800 border-blue-100 mb-4'
          >
            Our Story
          </Badge>
          <h2 className='font-[Playfair_Display] text-4xl font-bold text-slate-900 mb-6'>
            {storyheadline}
          </h2>
          <div
            className='prose prose-lg max-w-none text-slate-700 space-y-5 leading-relaxed'
            dangerouslySetInnerHTML={{
              __html: storyBody,
            }}
          />

          <div className='grid sm:grid-cols-2 gap-3 mt-10'>
            {(storyPoints || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                return (
                  <div key={i} className='flex items-start gap-3'>
                    <CheckCircle2 className='w-5 h-5 text-emerald-600 mt-0.5 shrink-0' />
                    <span className='text-slate-700'>{t.point}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-20 bg-slate-50'>
        <div className='container'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <Badge
              variant='secondary'
              className='bg-blue-50 text-blue-800 border-blue-100 mb-4'
            >
              What We Stand For
            </Badge>
            <h2 className='font-[Playfair_Display] text-4xl font-bold text-slate-900'>
              {valueheadline}
            </h2>
          </div>
          <div className='grid md:grid-cols-2 gap-5'>
            {(valuePoints || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                const Icon = ICONS[t.icon] || Shield;
                return (
                  <Card
                    key={i}
                    className='border-0 shadow-md hover:shadow-xl transition'
                  >
                    <CardContent className='p-7'>
                      <div className='w-12 h-12 rounded-xl gradient-trust flex items-center justify-center mb-4'>
                        <Icon className='w-6 h-6 text-white' />
                      </div>
                      <h3 className='text-xl font-bold text-slate-900 mb-2'>
                        {t.label}
                      </h3>
                      <p className='text-slate-600 leading-relaxed'>
                        {t.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className='py-20 bg-white'>
        <div className='container grid md:grid-cols-2 gap-6'>
          {(missonCards || [])
            .filter((t) => t.visible !== false)
            .map((t, i) => {
              const Icon = ICONS[t.icon] || Shield;
              return (
                <Card
                  key={i}
                  className='border-0 shadow-lg bg-gradient-to-br from-blue-900 to-blue-800 text-white'
                >
                  <CardContent className='p-8'>
                    <div className='w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4'>
                      <Icon className='w-6 h-6 text-amber-300' />
                    </div>
                    <h3 className='font-[Playfair_Display] text-2xl font-bold mb-3'>
                      {t.label}
                    </h3>
                    <p className='text-white/85 leading-relaxed'>{t.value}</p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      {/* Trustees */}
      <section className='py-20 bg-slate-50'>
        <div className='container'>
          <div className='text-center max-w-2xl mx-auto mb-12'>
            <Badge
              variant='secondary'
              className='bg-blue-50 text-blue-800 border-blue-100 mb-4'
            >
              Our People
            </Badge>
            <h2 className='font-[Playfair_Display] text-4xl font-bold text-slate-900'>
              {trusteesheadline}
            </h2>
          </div>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {(trusteesCards || [])
              .filter((t) => t.visible !== false)
              .map((t, i) => {
                return (
                  <Card key={i} className='border-0 shadow-md'>
                    <CardContent className='p-6'>
                      <div className='w-14 h-14 rounded-full gradient-trust text-white flex items-center justify-center font-bold text-xl mb-4'>
                        {t.name
                          .replace(
                            /^(mr\.?|mrs\.?|ms\.?|miss|shri|sri|smt\.?|dr\.?|prof\.?)\s+/i,
                            "",
                          )
                          .split(" ")
                          .filter(Boolean)
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <h4 className='font-bold text-slate-900'>{t.name}</h4>
                      <p className='text-blue-800 text-sm font-medium mb-2'>
                        {t.position}
                      </p>
                      <p className='text-slate-600 text-sm leading-relaxed'>
                        {t.value}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 gradient-trust text-white text-center'>
        <div className='container'>
          <Award className='w-12 h-12 text-amber-300 mx-auto mb-5' />
          <h2 className='font-[Playfair_Display] text-4xl font-bold mb-4'>
            {volunteerHeadline}
          </h2>
          <p className='text-white/85 max-w-xl mx-auto mb-8'>
            {volunteersubline}
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button
              asChild
              size='lg'
              className='bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-12 px-7'
            >
              <Link href={volunteerProgBtnLink}>
                {volunteerProgBtn} <ArrowRight className='w-4 h-4 ml-2' />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='bg-white/10 hover:bg-white/20 text-white border-white/40 h-12 px-7'
            >
              <Link href={volunteerBtnLink}>
                <Users className='w-4 h-4 mr-2' /> {volunteerBtn}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
