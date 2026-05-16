"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
      toast.success("Message sent — we will respond within 24 hours.");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <Card className='border-0 shadow-xl'>
        <CardContent className='p-10 text-center'>
          <div className='w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4'>
            <CheckCircle2 className='w-9 h-9 text-emerald-600' />
          </div>
          <h3 className='text-2xl font-bold text-slate-900 mb-2'>
            Message sent!
          </h3>
          <p className='text-slate-600'>
            Our team will respond within 24 hours.
          </p>
        </CardContent>
      </Card>
    );

  return (
    <Card className='border-0 shadow-xl'>
      <CardContent className='p-7'>
        <form onSubmit={submit} className='space-y-4'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='cname'>Name *</Label>
              <Input
                id='cname'
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='mt-1.5'
              />
            </div>
            <div>
              <Label htmlFor='cemail'>Email *</Label>
              <Input
                id='cemail'
                type='email'
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className='mt-1.5'
              />
            </div>
          </div>
          <div>
            <Label htmlFor='csub'>Subject</Label>
            <Input
              id='csub'
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className='mt-1.5'
            />
          </div>
          <div>
            <Label htmlFor='cmsg'>Message *</Label>
            <Textarea
              id='cmsg'
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className='mt-1.5'
            />
          </div>
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
                Send Message <ArrowRight className='w-4 h-4 ml-2' />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
