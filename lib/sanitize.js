import sanitizeHtml from "sanitize-html";

export function cleanHTML(html = "") {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "b",
      "strong",
      "i",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "br",
    ],

    allowedAttributes: {
      a: ["href", "target"],
    },

    allowedSchemes: ["http", "https", "mailto"],
  });
}
