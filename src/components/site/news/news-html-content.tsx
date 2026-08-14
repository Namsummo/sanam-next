import { cn } from "@/lib/utils";

type NewsHtmlContentProps = {
  html: string;
  className?: string;
};

/**
 * Renders trusted CMS HTML for news detail body.
 * Wrap at spaces (Vietnamese-safe); only break ultra-long tokens (URLs) if needed.
 */
function preventDashWrapping(html: string): string {
  if (!html) return "";
  
  // Cleanse invisible line-breaking characters (soft hyphens, zero-width spaces, etc.)
  let cleansed = html
    .replace(/\u00AD/g, "")
    .replace(/&shy;/g, "")
    .replace(/\u200B/g, "")
    .replace(/&#8203;/g, "")
    .replace(/\u200C/g, "")
    .replace(/\u200D/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ");

  // Matches HTML tags or digit-dash-digit sequences (supporting hyphen, en-dash, em-dash)
  return cleansed.replace(
    /(<[^>]+>)|((\d+)(–|-|—)(\d+))/g,
    (match, tag) => {
      if (tag) return tag;
      return `<span style="white-space: nowrap;">${match}</span>`;
    }
  );
}

export function NewsHtmlContent({ html, className }: NewsHtmlContentProps) {
  // Normalize to NFC to combine any decomposed Vietnamese characters, preventing split diacritics
  const normalizedHtml = (html || "").normalize("NFC");
  const processedHtml = preventDashWrapping(normalizedHtml);

  console.log("FRONTEND [NewsHtmlContent] ORIGINAL HTML JSON:", JSON.stringify(html));
  console.log("FRONTEND [NewsHtmlContent] PROCESSED HTML JSON:", JSON.stringify(processedHtml));

  return (
    <div
      className={cn(
        "news-entry w-full overflow-x-hidden border-b border-border pb-8 font-sans text-lg leading-relaxed text-foreground [overflow-wrap:break-word] [word-break:keep-all]",
        "[&_*]:[word-break:keep-all] [&_*]:[overflow-wrap:break-word]",
        "[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_blockquote]:mb-8 [&_blockquote]:rounded-[20px] [&_blockquote]:bg-muted [&_blockquote]:p-8",
        "[&_blockquote_p]:m-0 [&_blockquote_p]:font-display [&_blockquote_p]:text-xl [&_blockquote_p]:font-semibold [&_blockquote_p]:leading-snug [&_blockquote_p]:text-primary",
        "[&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:text-primary md:[&_h2]:text-4xl",
        "[&_iframe]:max-w-full",
        "[&_img]:mx-auto [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[12px]",
        "[&_li]:mb-4 [&_li]:text-lg [&_li]:leading-relaxed",
        "[&_ol]:mb-8 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_p]:mb-5 [&_p:last-child]:mb-0",
        "[&_pre]:max-w-full [&_pre]:whitespace-pre-wrap",
        "[&_table]:block [&_table]:max-w-full",
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
