"use client";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/admin/data-table";

export default function ContactsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.rows || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = [
    {
      key: "name",
      label: "Contact",
      render: (r) => (
        <div>
          <div className='font-medium'>{r.name}</div>
          <div className='text-xs text-slate-500'>{r.email}</div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (r) => (
        <Badge
          variant='secondary'
          className='bg-blue-50 text-blue-800 border-blue-100'
        >
          {r.subject}
        </Badge>
      ),
    },
    {
      key: "message",
      label: "Enquiry",
      render: (r) => (
        <div className='max-w-md text-xs text-slate-600 whitespace-pre-line line-clamp-4'>
          {r.message}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Received",
      render: (r) =>
        new Date(r.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  return (
    <div className='space-y-5'>
      <div>
        <h1 className='font-[Playfair_Display] text-3xl font-bold text-slate-900'>
          Contacts Inquiries
        </h1>
        <p className='text-slate-500 mt-1'>
          General contact enquiries submitted from the website.
        </p>
      </div>
      <DataTable
        rows={rows}
        loading={loading}
        columns={columns}
        searchableKeys={["name", "email", "subject", "message"]}
        onRefresh={load}
        exportUrl={`/api/admin/contacts?kind=contact`}
      />
    </div>
  );
}
