export function HtmlRenderer({ content }: { content: string }) {
  return (
    <div
      className="blog-rich-content"
      // Content is sanitized by the server before it is returned or stored.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized blog HTML is intentionally rendered
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
