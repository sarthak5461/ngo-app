"use client";

import { NodeViewWrapper } from "@tiptap/react";

export default function CustomImageView({ node, selected, updateAttributes }) {
  return (
    <NodeViewWrapper className='relative my-6' data-drag-handle>
      {selected && (
        <div
          className='
      absolute
      -top-14
      left-1/2
      -translate-x-1/2
      z-50
      flex
      items-center
      gap-2
      rounded-xl
      border
      bg-white
      px-3
      py-2
      shadow-xl
    '
        >
          <button
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
            onClick={() =>
              updateAttributes({
                width: 300,
                height: null,
                size: "small",
              })
            }
          >
            Small
          </button>

          <button
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
            onClick={() =>
              updateAttributes({
                width: 600,
                height: null,
                size: "medium",
              })
            }
          >
            Medium
          </button>

          <button
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
            onClick={() =>
              updateAttributes({
                width: 900,
                height: null,
                size: "large",
              })
            }
          >
            Large
          </button>

          <button
            className='rounded px-2 py-1 text-sm hover:bg-gray-100'
            onClick={() =>
              updateAttributes({
                width: null,
                height: null,
                size: "full",
              })
            }
          >
            Full
          </button>
        </div>
      )}

      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        width={node.attrs.width || undefined}
        height={node.attrs.height || undefined}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : "100%",
          height: node.attrs.height ? `${node.attrs.height}px` : "auto",
          display: "block",
          margin: "0 auto",
        }}
        className={`rounded-lg border transition-all ${
          selected ? "ring-4 ring-blue-500 shadow-xl" : ""
        }`}
      />
    </NodeViewWrapper>
  );
}
