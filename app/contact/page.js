"use client";
import SiteShell from "@/components/site/site-shell";
import ContactForm from "./contact-form";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useContent } from "@/components/site/content-provider";

function ContactPageContent() {
  const heroHeadline = useContent("contact.hero.headline");
  const herosubline = useContent("contact.hero.subline");

  const addressInfo = useContent("contact.info.address");
  const phoneInfo = useContent("contact.info.phone");
  const emailInfo = useContent("contact.info.email");
  const workHoursInfo = useContent("contact.info.hours");

  return (
    <>
      <section className='pt-32 pb-12 gradient-trust text-white'>
        <div className='container'>
          <Badge className='bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-4 backdrop-blur-sm'>
            Contact
          </Badge>
          <h1 className='font-[Playfair_Display] text-5xl lg:text-6xl font-bold mb-4'>
            {heroHeadline}
          </h1>
          <p className='text-lg text-white/85 max-w-2xl'>{herosubline}</p>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='container grid lg:grid-cols-5 gap-10'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-start gap-4'>
              <div className='w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0'>
                <MapPin className='w-5 h-5 text-white' />
              </div>
              <div>
                <div className='font-semibold text-slate-900'>Headquarters</div>
                <div className='text-slate-600 text-sm'>{addressInfo}</div>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0'>
                <Phone className='w-5 h-5 text-white' />
              </div>
              <div>
                <div className='font-semibold text-slate-900'>Phone</div>
                <div className='text-slate-600 text-sm'>{phoneInfo}</div>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0'>
                <Mail className='w-5 h-5 text-white' />
              </div>
              <div>
                <div className='font-semibold text-slate-900'>Email</div>
                <div className='text-slate-600 text-sm'>{emailInfo}</div>
              </div>
            </div>
            <div className='flex items-start gap-4'>
              <div className='w-11 h-11 rounded-lg gradient-trust flex items-center justify-center shrink-0'>
                <Clock className='w-5 h-5 text-white' />
              </div>
              <div>
                <div className='font-semibold text-slate-900'>Office Hours</div>
                <div className='text-slate-600 text-sm'>{workHoursInfo}</div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-3'>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactPageContent />
    </SiteShell>
  );
}
