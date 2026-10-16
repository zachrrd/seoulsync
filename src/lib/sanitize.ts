import sanitizeHtml from "sanitize-html";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "b",
    "i",
    "strong",
    "em",
    "u",
    "s",
    "strike",
    "sub",
    "sup",
    "br",
    "hr",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "pre",
    "code",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "align", "scope"],
    td: ["colspan", "rowspan", "align", "scope"],
    p: ["style"],
    span: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
    h5: ["style"],
    h6: ["style"],
    div: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto"],
    img: ["http", "https"],
  },
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || "";
      const isExternal =
        href.startsWith("http://") || href.startsWith("https://");
      return {
        tagName: "a",
        attribs: {
          ...attribs,
          ...(isExternal
            ? {
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {}),
        },
      };
    },
    img: (tagName, attribs) => {
      return {
        tagName: "img",
        attribs: {
          ...attribs,
          loading: "lazy",
        },
      };
    },
  },
};

export function sanitizeArticleContent(content?: string | null): string {
  if (!content) {
    return "";
  }
  return sanitizeHtml(content, sanitizeOptions);
}

