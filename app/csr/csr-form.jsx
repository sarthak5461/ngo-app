"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const INTERESTS = [
  "CSR Funding",
  "Employee Volunteering",
  "In-Kind Partnership",
  "Cause Marketing",
  "Other",
];

export default function CSRForm() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    designation: "",
    email: "",
    phone: "",
    interest: "CSR Funding",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/csr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.name} (${form.company})`,
          email: form.email,
          subject: `CSR Enquiry — ${form.interest}`,
          message: `Company: ${form.company}\nDesignation: ${form.designation}\nPhone: ${form.phone}\nInterest: ${form.interest}\nBudget: ${form.budget}\n\nMessage:\n${form.message}`,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
      toast.success("Thank you. Our CSR Lead will respond within 24 hours.");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className='border-0 shadow-xl'>
        <CardContent className='p-12 text-center'>
          <div className='w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4'>
            <CheckCircle2 className='w-9 h-9 text-emerald-600' />
          </div>
          <h3 className='text-2xl font-bold text-slate-900 mb-2'>
            Enquiry received.
          </h3>
          <p className='text-slate-600 max-w-md mx-auto'>
            Our CSR Lead has been notified and will reach out within one
            business day with next steps and a deck tailored to your
            company&apos;s focus areas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-0 shadow-xl'>
      <CardContent className='p-7 lg:p-9'>
        <form onSubmit={submit} className='grid md:grid-cols-2 gap-5'>
          <div className='md:col-span-2'>
            <Label htmlFor='company'>Company name *</Label>
            <Input
              id='company'
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className='mt-1.5'
            />
          </div>
          <div>
            <Label htmlFor='cn'>Your name *</Label>
            <Input
              id='cn'
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='mt-1.5'
            />
          </div>
          <div>
            <Label htmlFor='des'>Designation</Label>
            <Input
              id='des'
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              className='mt-1.5'
              placeholder='e.g. Head of CSR'
            />
          </div>
          <div>
            <Label htmlFor='em'>Work email *</Label>
            <Input
              id='em'
              type='email'
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className='mt-1.5'
            />
          </div>
          <div>
            <Label htmlFor='ph'>Phone</Label>
            <Input
              id='ph'
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className='mt-1.5'
            />
          </div>
          <div className='md:col-span-2'>
            <Label>Type of partnership</Label>
            <div className='flex flex-wrap gap-2 mt-1.5'>
              {INTERESTS.map((it) => (
                <button
                  type='button'
                  key={it}
                  onClick={() => setForm({ ...form, interest: it })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${form.interest === it ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"}`}
                >
                  {it}
                </button>
              ))}
            </div>
          </div>
          <div className='md:col-span-2'>
            <Label htmlFor='bd'>Approx. budget / scale (optional)</Label>
            <Input
              id='bd'
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className='mt-1.5'
              placeholder='e.g. ₹20–50L for FY26'
            />
          </div>
          <div className='md:col-span-2'>
            <Label htmlFor='ms'>Your enquiry *</Label>
            <Textarea
              id='ms'
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className='mt-1.5'
              placeholder='Tell us about the focus area, geographies, timelines and any specific outcomes you’re tracking.'
            />
          </div>
          <div className='md:col-span-2'>
            <Button
              type='submit'
              disabled={loading}
              className='gradient-trust text-white h-11 font-semibold w-full sm:w-auto px-8'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Sending…
                </>
              ) : (
                <>
                  <Send className='w-4 h-4 mr-2' /> Send CSR enquiry
                </>
              )}
            </Button>
            <p className='text-xs text-slate-500 mt-3'>
              Our CSR Lead Smt. Lata Mishra responds within one business day. We
              respect your inbox — no marketing.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
