"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DeleteUserDialog({
  open,
  user,
  onClose,
  onDelete,
  loading = false,
}) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (open) {
      setConfirmText("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-md'>
        <div className='border-b px-6 py-4 flex items-center gap-3'>
          <AlertTriangle className='w-6 h-6 text-red-600' />

          <div>
            <h2 className='text-lg font-semibold'>Delete User</h2>

            <p className='text-sm text-slate-500'>
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className='p-6 space-y-5'>
          <div className='rounded-lg bg-red-50 border border-red-200 p-4'>
            <div className='font-semibold text-red-700'>{user?.name}</div>

            <div className='text-sm text-slate-600'>{user?.email}</div>
          </div>

          <p className='text-sm text-slate-600'>
            Type <strong>DELETE</strong> below to permanently remove this user.
          </p>

          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className='w-full border rounded-lg px-3 py-2'
            placeholder='Type DELETE'
          />
        </div>

        <div className='border-t px-6 py-4 flex justify-end gap-3'>
          <button
            onClick={onClose}
            disabled={loading}
            className='px-4 py-2 border rounded-lg'
          >
            Cancel
          </button>

          <button
            disabled={confirmText !== "DELETE" || loading}
            onClick={() => onDelete(user)}
            className='px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700'
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
