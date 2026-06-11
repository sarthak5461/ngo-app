"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent, extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MediaPicker from "./media-picker";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),

      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: true,
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"], // can be any direction or diagonal combination
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: true,
        },
        allowBase64: true,
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [showHtmlEditor, setShowHtmlEditor] = useState(false);

  const [htmlDraft, setHtmlDraft] = useState("");
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL or Email", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    let href = url.trim();

    // Email
    if (href.includes("@") && !href.startsWith("mailto:")) {
      href = `mailto:${href}`;
    }

    editor.chain().focus().setLink({ href }).run();
  };

  return (
    <div className='ProseMirror border rounded-xl overflow-hidden bg-white'>
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
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
          className='px-2 py-1 border rounded'
        >
          H1
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className='px-2 py-1 border rounded'
        >
          List
        </button>

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className='px-2 py-1 border rounded'
        >
          Numbered
        </button>
        <button
          type='button'
          onClick={setLink}
          className='px-2 py-1 border rounded'
        >
          Link
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className='px-2 py-1 border rounded'
        >
          Quote
        </button>
        <button type='button' onClick={() => setMediaPickerOpen(true)}>
          Image
        </button>

        <button
          type='button'
          onClick={() => {
            setHtmlDraft(editor?.getHTML() || "");

            setShowHtmlEditor(true);
          }}
          className='px-2 py-1 border rounded'
        >
          HTML
        </button>
        <MediaPicker
          open={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onChange={(imageUrl) => {
            editor
              ?.chain()
              .focus()
              .setImage({
                src: imageUrl,
              })
              .run();
          }}
        />
      </div>
      <div className='min-h-[500px]'>
        <EditorContent editor={editor} className='prose max-w-none p-3' />
        {showHtmlEditor && (
          <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center'>
            <div className='bg-white rounded-xl w-[90vw] max-w-5xl h-[80vh] shadow-2xl flex flex-col'>
              <div className='border-b px-6 py-4 flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>HTML Source Editor</h3>

                <button onClick={() => setShowHtmlEditor(false)}>✕</button>
              </div>

              <div className='flex-1 p-4'>
                <textarea
                  value={htmlDraft}
                  onChange={(e) => setHtmlDraft(e.target.value)}
                  className='w-full h-full border rounded-lg p-4 font-mono text-sm'
                />
              </div>

              <div className='border-t p-4 flex justify-end gap-3'>
                <button
                  className='px-4 py-2 border rounded'
                  onClick={() => setShowHtmlEditor(false)}
                >
                  Cancel
                </button>

                <button
                  className='px-4 py-2 bg-blue-600 text-white rounded'
                  onClick={() => {
                    editor?.chain().focus().setContent(htmlDraft).run();

                    setShowHtmlEditor(false);
                  }}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
