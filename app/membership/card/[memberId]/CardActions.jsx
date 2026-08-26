"use client";

export default function CardActions() {
  return (
    <div className='flex justify-center gap-3 mt-8 print:hidden'>
      <button
        type='button'
        onClick={() => window.print()}
        className='px-6 py-3 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition'
      >
        Print / Save as PDF
      </button>
    </div>
  );
}
