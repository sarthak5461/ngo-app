"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CustomImage from "@/lib/tiptap/extensions/CustomImage";
import MediaPicker from "./media-picker";
import LinkDialog from "@/components/editor/LinkDialog";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Quote,
  ImagePlus,
  Code2,
} from "lucide-react";

function ToolbarButton({ icon: Icon, active, onClick, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-md transition-all
      ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

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
      CustomImage.configure({
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

  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState(false);
  const [linkNewTab, setLinkNewTab] = useState(false);

  // const setLink = () => {
  //   const previousUrl = editor.getAttributes("link").href;

  //   const url = window.prompt("Enter URL or Email", previousUrl || "");

  //   if (url === null) return;

  //   if (url === "") {
  //     editor.chain().focus().unsetLink().run();
  //     return;
  //   }

  //   let href = url.trim();

  //   // Email
  //   if (href.includes("@") && !href.startsWith("mailto:")) {
  //     href = `mailto:${href}`;
  //   }

  //   editor.chain().focus().setLink({ href }).run();
  // };

  return (
    <div className="ProseMirror border rounded-xl overflow-hidden bg-white">
      <div className="border-b bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-1">
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          icon={Bold}
          title="Bold"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />

        <ToolbarButton
          icon={Italic}
          title="Italic"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={Heading1}
          title="Heading 1"
          active={editor?.isActive("heading", { level: 1 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />
        <ToolbarButton
          icon={Heading2}
          title="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          icon={Heading3}
          title="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />
        <ToolbarButton
          icon={List}
          title="Bullet List"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />

        <ToolbarButton
          icon={ListOrdered}
          title="Numbered List"
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          icon={Link2}
          title="Insert Link"
          active={editor?.isActive("link")}
          onClick={() => {
            const attrs = editor.getAttributes("link");
            setLinkUrl(attrs.href || "");
            setLinkNewTab(attrs.target === "_blank");
            setShowLinkDialog(true);
          }}
        />
        <ToolbarButton
          icon={Quote}
          title="Quote"
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          icon={ImagePlus}
          title="Insert Image"
          active={false}
          onClick={() => setMediaPickerOpen(true)}
        />

        <ToolbarButton
          icon={Code2}
          title="Edit HTML"
          active={showHtmlEditor}
          onClick={() => {
            setHtmlDraft(editor?.getHTML() || "");
            setShowHtmlEditor(true);
          }}
        />
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
      <div className="min-h-[500px]">
        <EditorContent editor={editor} className="max-w-none p-3" />
        {showHtmlEditor && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-[90vw] max-w-5xl h-[80vh] shadow-2xl flex flex-col">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <h3 className="font-semibold text-lg">HTML Source Editor</h3>

                <button onClick={() => setShowHtmlEditor(false)}>✕</button>
              </div>

              <div className="flex-1 p-4">
                <textarea
                  value={htmlDraft}
                  onChange={(e) => setHtmlDraft(e.target.value)}
                  className="w-full h-full border rounded-lg p-4 font-mono text-sm"
                />
              </div>

              <div className="border-t p-4 flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowHtmlEditor(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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
      <LinkDialog
        open={showLinkDialog}
        url={linkUrl}
        setUrl={setLinkUrl}
        newTab={linkNewTab}
        setNewTab={setLinkNewTab}
        onCancel={() => {
          setShowLinkDialog(false);
          setLinkUrl("");
          setLinkNewTab(false);
        }}
        onRemove={() => {
          editor?.chain().focus().extendMarkRange("link").unsetLink().run();

          setShowLinkDialog(false);
        }}
        onSave={() => {
          let href = linkUrl.trim();

          if (!href) return;

          // Email
          if (href.includes("@") && !href.startsWith("mailto:")) {
            href = `mailto:${href}`;
          }

          // Website
          else if (
            !href.startsWith("http://") &&
            !href.startsWith("https://") &&
            !href.startsWith("/")
          ) {
            href = `https://${href}`;
          }

          editor
            ?.chain()
            .focus()
            .extendMarkRange("link")
            .setLink({
              href,
              target: linkNewTab ? "_blank" : null,
            })
            .run();

          setShowLinkDialog(false);
        }}
      />
    </div>
  );
}
