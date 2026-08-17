"use client";

import { useEffect, useState } from "react";
import { ROLES, ROLE_LABELS } from "@/lib/auth/rbac";
import { isValidEmail } from "@/lib/utils/validation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function UserDialog({
  open,
  onClose,
  onSave,
  initialData = null,
  isEditingSelf = false,
}) {
  // console.log(initialData);
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.ADMIN,
    status: "active",
  });

  useEffect(() => {
    setShowPassword(false);
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || ROLES.ADMIN,
        status: initialData.status || "active",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role: ROLES.ADMIN,
        status: "active",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-2xl w-full max-w-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='border-b px-6 py-4'>
          <h2 className='text-xl font-semibold'>
            {initialData ? "Edit User" : "Create User"}
          </h2>
        </div>

        <div className='space-y-5 p-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Full Name</label>

            <input
              className='w-full border rounded-lg px-3 py-2'
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>

            <input
              type='email'
              className={`w-full rounded-lg px-3 py-2 border ${
                emailError
                  ? "border-red-500 focus:border-red-500"
                  : "border-slate-300"
              }`}
              value={form.email}
              onChange={(e) => {
                const email = e.target.value;

                setForm({
                  ...form,
                  email,
                });

                if (!email) {
                  setEmailError("");
                } else if (!isValidEmail(email)) {
                  setEmailError("Please enter a valid email address.");
                } else {
                  setEmailError("");
                }
              }}
            />
            {emailError && (
              <p className='mt-1 text-sm text-red-600'>{emailError}</p>
            )}
          </div>

          {!initialData && (
            <div>
              <label className='block text-sm font-medium mb-2'>Password</label>

              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  className='w-full border rounded-lg px-3 py-2 pr-11'
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />

                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Role</label>

              <select
                className='w-full border rounded-lg px-3 py-2'
                value={form.role}
                disabled={isEditingSelf}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Status</label>

              <select
                className='w-full border rounded-lg px-3 py-2'
                value={form.status}
                disabled={isEditingSelf}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
          </div>
          {isEditingSelf && (
            <p className='mt-2 text-xs text-amber-600'>
              For security reasons, you cannot change your own role or account
              status.
            </p>
          )}
        </div>

        <div className='border-t px-6 py-4 flex justify-end gap-3'>
          <button onClick={onClose} className='px-4 py-2 border rounded-lg'>
            Cancel
          </button>

          <button
            onClick={() => {
              if (!isValidEmail(form.email)) {
                toast.error("Please enter a valid email address.");
                return;
              }
              onSave(form, initialData);
            }}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white'
          >
            {initialData ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
