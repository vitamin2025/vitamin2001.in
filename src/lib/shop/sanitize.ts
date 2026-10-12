import sanitizeHtml from "sanitize-html";

/**
 * Product and collection descriptions are HTML that sellers write in the shop admin. Keep the
 * formatting and drop anything that could run code on the storefront's origin.
 */
export function sanitizeDescription(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "small", "sub", "sup", "mark",
      "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "hr", "a", "img",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "http"] },
    transformTags: {
      // Seller headings sit under the product's own h1.
      h1: "h2",
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }),
    },
  });
}

/** Plain text for meta descriptions. */
export function descriptionText(html: string | null | undefined, max = 160): string {
  const text = sanitizeHtml(html ?? "", { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
