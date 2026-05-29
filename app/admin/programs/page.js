"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProgramsPage() {
  const [rows, setRows] = useState([]);

  async function load() {
    const res = await fetch("/api/admin/programs");

    const data = await res.json();

    setRows(data.rows || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Programs</h1>

        <button
          className='px-4 py-2 rounded bg-black text-white'
          onClick={async () => {
            await fetch("/api/admin/programs", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                title: "New Program",
                slug: `program-${Date.now()}`,
              }),
            });

            load();
          }}
        >
          Add Program
        </button>
      </div>

      <div className='space-y-3'>
        {rows.map((r) => (
          <Link key={r.id} href={`/admin/programs/${r.id}`}>
            <div className='border rounded p-4 hover:bg-slate-50 cursor-pointer'>
              <div className='font-semibold'>
                {r.hero?.title || "Untiteld Program"}
              </div>

              <div className='text-sm text-slate-500'>
                /programs/{r.pageHeader?.slug || ""}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
