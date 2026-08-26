import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import CardActions from "./CardActions";

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MembershipCardPage({ params }) {
  const memberId = params.memberId;

  const db = await getDb();

  const member = await db.collection("members").findOne({
    memberId,
    status: "active",
  });

  if (!member) {
    notFound();
  }

  return (
    <main className='min-h-screen bg-slate-100 py-10 px-4'>
      <div className='max-w-2xl mx-auto'>
        {/* PAGE HEADER */}
        <div className='text-center mb-8 print:hidden'>
          <h1 className='text-2xl font-bold text-slate-900'>Membership Card</h1>

          <p className='text-sm text-slate-500 mt-1'>
            Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust
          </p>
        </div>

        {/* MEMBERSHIP CARD */}
        <div
          id='membercard'
          className='w-[380px] max-w-full bg-white rounded-2xl overflow-hidden border shadow-2xl mx-auto'
        >
          {/* CARD HEADER */}
          <div className='gradient-trust text-white p-6 relative'>
            <div className='flex items-start justify-between mb-5'>
              <div>
                <div className='text-[10px] tracking-widest text-amber-300 mb-1'>
                  SHREE JAGANNATH SWAMI BHAKT SHIROMADI
                </div>

                <div className='font-[Playfair_Display] font-bold text-lg leading-tight'>
                  Maa Karma Devi Sangh Trust
                </div>

                <div className='text-[10px] text-white/70'>
                  Member Identity Card
                </div>
              </div>

              <div className='w-10 h-10 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center'>
                <span className='text-amber-300 text-xl'>✦</span>
              </div>
            </div>

            <div className='text-3xl font-mono font-bold tracking-wider break-all'>
              {member.memberId}
            </div>
          </div>

          {/* CARD BODY */}
          <div className='px-7 py-6'>
            {/* MEMBER */}
            <div className='flex gap-4 items-start mb-4'>
              {/* PHOTO */}
              <div className='w-20 h-20 rounded-lg bg-slate-100 overflow-hidden border-2 border-blue-100 shrink-0'>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name || "Member"}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-slate-400'>
                    <span className='text-2xl'>👤</span>
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className='flex-1 min-w-0'>
                <div className='font-bold text-slate-900 leading-8 break-words'>
                  {member.name}
                </div>

                <div className='text-xs text-slate-500 mb-2'>
                  {member.occupation || "Member"}
                </div>

                <div className='flex items-center gap-1 text-emerald-700 font-semibold text-sm'>
                  <span>✓</span>
                  Active Member
                </div>
              </div>
            </div>

            {/* VALIDITY */}
            <div className='grid grid-cols-2 gap-3 text-xs pt-4 border-t'>
              <div>
                <div className='text-slate-500'>Valid from</div>

                <div className='font-semibold text-slate-900'>
                  {formatDate(member.validFrom)}
                </div>
              </div>

              <div>
                <div className='text-slate-500'>Valid until</div>

                <div className='font-semibold text-blue-900'>
                  {formatDate(member.validUntil)}
                </div>
              </div>

              <div className='col-span-2'>
                <div className='text-slate-500'>Receipt no.</div>

                <div className='font-mono text-slate-900'>
                  {member.receiptNumber}
                </div>
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className='mt-4 pt-4 border-t text-[10px] text-slate-500 leading-relaxed'>
              This card is the property of Maa Karma Devi Sangh Trust.
              Membership is valid for 12 months from the date of activation and
              is renewable. Tax exemption under Section 80G of the Income Tax
              Act, 1961.
            </div>
          </div>
        </div>

        {/* CLIENT-SIDE ACTION */}
        <CardActions />

        <p className='text-center text-xs text-slate-500 mt-4 print:hidden'>
          Use “Print / Save as PDF” to save your membership card.
        </p>
      </div>

      {/* PRINT STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body {
                background: white !important;
              }

              main {
                padding: 0 !important;
                min-height: auto !important;
              }

              #membercard {
                box-shadow: none !important;
                margin: 40px auto !important;
                width: 380px !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}
