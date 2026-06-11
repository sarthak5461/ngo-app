"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogsPage() {
  const [rows, setRows] = useState([]);

  async function load() {
    const res = await fetch("/api/admin/blogs");

    // console.log("STATUS", res.status);

    const data = await res.json();

    console.log("BODY", data);
    setRows(data.rows || []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Blogs</h1>

        <button
          className='px-4 py-2 rounded bg-black text-white'
          onClick={async () => {
            const r = await fetch("/api/admin/blogs", {
              method: "POST",
            });

            const blog = await r.json();

            window.location.href = `/admin/blogs/${blog.id}`;
            load();
          }}
        >
          New Blog
        </button>
      </div>
      <div className='space-y-3'>
        {rows.map((r) => (
          <Link key={r.id} href={`/admin/blogs/${r.id}`}>
            <div className='border rounded p-4  hover:bg-slate-50 cursor-pointer flex justify-between'>
              <div className='font-semibold'>{r.hero?.title}</div>

              <div className='text-sm text-slate-500'>{r.status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
