"use client";

import { useEditor, EditorContent, extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  if (!editor) return null;

  return (
    <div className='border rounded-xl overflow-hidden bg-white'>
      <div className='border-b p-2 flex gap-2 flex-wrap'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className='px-2 py-1 border rounded'
        >
          Bold
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className='px-2 py-1 border rounded'
        >
          Italic
        </button>

        <button
          type='button'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className='px-2 py-1 border rounded'
        >
          H2
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className='px-2 py-1 border rounded'
        >
          List
        </button>
      </div>
      <EditorContent editor={editor} className='p-4 min-h-[250px]' />
    </div>
  );
}
