"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordDialog({ open, onClose, onSave, user }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  if (!open) return null;

  function generatePassword() {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

    let pass = "";

    for (let i = 0; i < 14; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }

    setPassword(pass);
    setConfirmPassword(pass);
  }

  function submit() {
    if (!password) {
      toast.error("Password is required.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    onSave({
      password,
      user,
    });
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-lg font-semibold'>Reset Password</h2>

          <p className='text-sm text-slate-500 mt-1'>{user?.name}</p>
        </div>

        <div className='p-6 space-y-5'>
          <div>
            <label className='block text-sm font-medium mb-2'>
              New Password
            </label>

            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full border rounded-lg px-3 py-2 pr-11'
              />

              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500'
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>
              Confirm Password
            </label>

            <div className='relative'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full border rounded-lg px-3 py-2 pr-11'
              />

              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500'
              >
                {showConfirmPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          <button
            type='button'
            onClick={generatePassword}
            className='flex items-center gap-2 text-blue-700 text-sm hover:text-blue-900'
          >
            <RefreshCw className='w-4 h-4' />
            Generate Strong Password
          </button>
        </div>

        <div className='border-t px-6 py-4 flex justify-end gap-3'>
          <button onClick={onClose} className='px-4 py-2 border rounded-lg'>
            Cancel
          </button>

          <button
            onClick={submit}
            className='px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800'
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
