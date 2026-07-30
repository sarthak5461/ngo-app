"use client";

export default function LinkDialog({
  open,
  url,
  setUrl,
  newTab,
  setNewTab,
  onCancel,
  onSave,
  onRemove,
}) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='w-[420px] rounded-xl bg-white shadow-2xl'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-lg font-semibold'>Insert Link</h2>
        </div>

        <div className='space-y-5 p-6'>
          <div>
            <label className='mb-2 block text-sm font-medium'>URL</label>

            <input
              autoFocus
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://example.com'
              className='w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500'
            />
          </div>

          <label className='flex items-center gap-2 text-sm'>
            <input
              type='checkbox'
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
            />
            Open in new tab
          </label>
        </div>

        <div className='flex justify-between border-t p-4'>
          <button
            onClick={onRemove}
            className='text-red-600 hover:text-red-700'
          >
            Remove Link
          </button>

          <div className='flex gap-2'>
            <button onClick={onCancel} className='rounded-lg border px-4 py-2'>
              Cancel
            </button>

            <button
              onClick={onSave}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white'
            >
              Apply Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
