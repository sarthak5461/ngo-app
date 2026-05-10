"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HandHeart, ShieldCheck, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

function AdminLoginContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, bounce to admin
  useEffect(() => {
    fetch("/api/admin/me").then((r) => {
      if (r.ok) router.push(params.get("next") || "/admin");
    });
  }, [router, params]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const d = await r.json();

      if (!r.ok) throw new Error(d.error);

      toast.success(`Welcome, ${d.name}`);

      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-5'>
      <Card className='border-0 shadow-2xl w-full max-w-md overflow-hidden'>
        <div className='gradient-trust text-white p-7'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center'>
              <HandHeart className='w-5 h-5 text-white' />
            </div>

            <div>
              <div className='font-bold'>MKDS Admin</div>
              <div className='text-[11px] text-white/70'>
                Sangh Trust internal dashboard
              </div>
            </div>
          </div>

          <h1 className='font-[Playfair_Display] text-2xl font-bold mb-1'>
            Sign in
          </h1>

          <p className='text-sm text-white/80'>Authorised personnel only.</p>
        </div>

        <CardContent className='p-7'>
          <form onSubmit={submit} className='space-y-4'>
            <div>
              <Label htmlFor='pw'>Admin password</Label>

              <div className='relative mt-1.5'>
                <Lock className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />

                <Input
                  id='pw'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-9'
                  placeholder='••••••••'
                  autoFocus
                />
              </div>

              <p className='text-[11px] text-slate-500 mt-1.5'>
                Default development password:{" "}
                <code className='bg-slate-100 px-1.5 py-0.5 rounded'>
                  admin123
                </code>{" "}
                (change in <code>.env</code> for production)
              </p>
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full gradient-trust text-white h-11 font-semibold'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Signing in…
                </>
              ) : (
                <>
                  <ShieldCheck className='w-4 h-4 mr-2' />
                  Sign in
                </>
              )}
            </Button>
          </form>

          <div className='mt-5 pt-5 border-t text-[11px] text-slate-500 leading-relaxed'>
            <strong className='text-slate-700'>Auth placeholder:</strong>{" "}
            cookie-based session with 7-day expiry. Production swap-in: JWT
            verification, OTP-based login, or SSO. RBAC roles already defined in{" "}
            <code>lib/auth/rbac.js</code>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className='p-6'>Loading...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
