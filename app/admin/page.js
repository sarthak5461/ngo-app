"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  IdCard,
  Users,
  Building2,
  FileText,
  Image as ImageIcon,
  FileBarChart,
  ArrowRight,
  TrendingUp,
  Loader2,
  Building2Icon,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
  };
  return (
    <Card className='border-0 shadow-sm hover:shadow-md transition'>
      <CardContent className='p-5'>
        <div className='flex items-center justify-between mb-3'>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}
          >
            <Icon className='w-5 h-5' />
          </div>
          {sub && (
            <span className='text-xs text-emerald-700 font-semibold flex items-center gap-1'>
              <TrendingUp className='w-3 h-3' /> {sub}
            </span>
          )}
        </div>
        <div className='text-2xl font-bold text-slate-900 mb-0.5'>{value}</div>
        <div className='text-xs text-slate-500 font-medium'>{label}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        const data = await r.json();

        // console.log("CSR:", data.csrCount, "CONTACT:", data.contactCount, data);

        setStats(data);

        setLoading(false);
      })
      .catch((e) => {
        console.error("STATS FETCH ERROR:", e);

        setLoading(false);
      });
  }, []);

  const fmt = (n) => (n || 0).toLocaleString("en-IN");
  const fmtINR = (n) => "₹" + fmt(n);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-[Playfair_Display] text-3xl font-bold text-slate-900'>
          Dashboard Overview
        </h1>
        <p className='text-slate-500 mt-1'>
          A real-time snapshot of donations, members, volunteers and CSR
          engagement.
        </p>
      </div>

      {loading ? (
        <div className='py-20 text-center text-slate-400'>
          <Loader2 className='w-6 h-6 animate-spin inline' /> Loading…
        </div>
      ) : (
        <>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatCard
              icon={HeartHandshake}
              label='Donations received'
              value={fmtINR(stats?.totalRaised)}
              sub={`${stats?.donationCount || 0} txn`}
              color='emerald'
            />
            <StatCard
              icon={IdCard}
              label='Active members'
              value={fmt(stats?.activeMembers)}
              sub={`${stats?.pendingMembers || 0} pending`}
              color='blue'
            />
            <StatCard
              icon={Users}
              label='Volunteers'
              value={fmt(stats?.volunteerCount)}
              color='amber'
            />
            <StatCard
              icon={Building2}
              label='CSR inquiries'
              value={fmt(stats?.csrCount)}
              color='rose'
            />

            <StatCard
              icon={Building2Icon}
              label='General Contacts'
              value={fmt(stats?.contactCount)}
              color='blue'
            />
          </div>

          <div className='grid lg:grid-cols-3 gap-5'>
            <Card className='border-0 shadow-sm lg:col-span-2'>
              <CardContent className='p-6'>
                <h3 className='font-bold text-slate-900 mb-1'>
                  Member contributions
                </h3>
                <p className='text-xs text-slate-500 mb-4'>
                  Total support contributions received from active members.
                </p>
                <div className='text-4xl font-bold text-blue-900 mb-1'>
                  {fmtINR(stats?.memberContributions)}
                </div>
                <p className='text-xs text-slate-500'>
                  From {fmt(stats?.activeMembers)} active members — minimum ₹500
                  each, valid for 12 months.
                </p>
                <div className='mt-5 pt-5 border-t flex flex-wrap gap-2'>
                  <Button
                    asChild
                    size='sm'
                    className='gradient-trust text-white'
                  >
                    <Link href='/admin/members'>
                      Manage members <ArrowRight className='w-3 h-3 ml-1' />
                    </Link>
                  </Button>
                  <Button asChild size='sm' variant='outline'>
                    <Link href='/admin/reports'>View reports</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='border-0 shadow-sm'>
              <CardContent className='p-6'>
                <h3 className='font-bold text-slate-900 mb-1'>Quick actions</h3>
                <p className='text-xs text-slate-500 mb-4'>Common shortcuts.</p>
                <div className='space-y-2'>
                  {[
                    {
                      href: "/admin/donations",
                      label: "View latest donations",
                      icon: HeartHandshake,
                    },
                    {
                      href: "/admin/content",
                      label: "Edit homepage content",
                      icon: FileText,
                    },
                    {
                      href: "/admin/media",
                      label: "Upload to media library",
                      icon: ImageIcon,
                    },
                    {
                      href: "/admin/reports",
                      label: "Generate reports",
                      icon: FileBarChart,
                    },
                  ].map((q, i) => {
                    const I = q.icon;
                    return (
                      <Link
                        key={i}
                        href={q.href}
                        className='flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700'
                      >
                        <I className='w-4 h-4 text-blue-800' /> {q.label}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='border-0 shadow-sm bg-amber-50/40 border-amber-100'>
            <CardContent className='p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
              <div>
                <h4 className='font-bold text-slate-900'>
                  Architecture &amp; auth status
                </h4>
                <p className='text-sm text-slate-600 mt-1'>
                  Modular{" "}
                  <code className='text-xs bg-white px-1.5 py-0.5 rounded'>
                    lib/services
                  </code>
                  ,{" "}
                  <code className='text-xs bg-white px-1.5 py-0.5 rounded'>
                    lib/auth
                  </code>
                  ,{" "}
                  <code className='text-xs bg-white px-1.5 py-0.5 rounded'>
                    lib/admin/handlers
                  </code>
                  . Cookie-based auth (placeholder) with 4 RBAC roles. Ready for
                  JWT/OTP/DigiLocker swap-in.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
