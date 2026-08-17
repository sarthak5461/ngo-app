"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

export default function ActionMenu({ children }) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className='relative inline-block' ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className='w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center'
      >
        <MoreVertical className='w-4 h-4' />
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-52 rounded-xl border bg-white shadow-lg py-2 z-50'>
          {children}
        </div>
      )}
    </div>
  );
}
