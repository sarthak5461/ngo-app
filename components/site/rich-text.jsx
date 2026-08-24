"use client";

import parse, { domToReact } from "html-react-parser";
import { CheckCircle2, Quote as QuoteIcon } from "lucide-react";

export default function RichText({ content, html, className = "" }) {
  const source = html || content || "";
  const parsed = parse(source, {
    replace(domNode) {
      if (domNode.name === "blockquote") {
        return (
          <figure className='my-8 border-l-4 border-amber-500 bg-amber-50 px-6 py-5 rounded-r-lg'>
            <QuoteIcon className='w-7 h-7 text-amber-500 mb-2' />
            <blockquote className='text-xl italic text-slate-800 leading-relaxed'>
              {domToReact(domNode.children)}
            </blockquote>
          </figure>
          // <blockquote className='my-8 rounded-r-xl border-l-4 border-amber-500 bg-amber-50 px-6 py-4 italic text-slate-700'>
          //   {domToReact(domNode.children)}
          // </blockquote>
        );
      }
      if (domNode.name === "ul") {
        return (
          <ul className='space-y-2 my-4'>
            {domNode.children.map((child, idx) => {
              if (child.name !== "li") return null;

              const content =
                child.children?.[0]?.name === "p"
                  ? child.children[0].children
                  : child.children;

              return (
                <li key={idx} className='flex items-start gap-2 text-slate-700'>
                  <CheckCircle2 className='w-4 h-4 text-emerald-600 mt-1 shrink-0' />

                  <span>{domToReact(content)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      if (domNode.name === "img") {
        const width = domNode.attribs?.width;
        const align = domNode.attribs?.["data-align"] || "center";

        return (
          <span
            className={`my-8 flex ${
              align === "left"
                ? "justify-start"
                : align === "right"
                  ? "justify-end"
                  : "justify-center"
            }`}
          >
            <img
              src={domNode.attribs?.src}
              alt={domNode.attribs?.alt || ""}
              style={{
                width: width ? `${width}px` : "100%",
                maxWidth: "100%",
                height: "auto",
              }}
              className='rounded-xl shadow-lg'
            />
          </span>
        );
      }
    },
  });

  return <div className={`rich-content ${className}`}>{parsed}</div>;
}
