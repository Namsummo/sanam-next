import { cn } from "@/lib/utils";

type NewsHtmlContentProps = {
  html: string;
  className?: string;
};

/**
 * Quill getSemanticHTML() converts video embeds into plain <a href="youtube..."> links.
 * Convert those back into playable iframes for public rendering.
 */
function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());

    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function youtubeIframeHtml(embedUrl: string): string {
  return `<iframe class="ql-video" src="${embedUrl}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}

function hydrateYouTubeLinks(html: string): string {
  if (!html) return "";

  // Quill semantic HTML: <a href="youtube...">youtube...</a>
  return html.replace(
    /<a\b[^>]*\bhref=(["'])(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^"']*)\1[^>]*>[\s\S]*?<\/a>/gi,
    (match, _quote: string, href: string) => {
      const embedUrl = toYouTubeEmbedUrl(href);
      return embedUrl ? youtubeIframeHtml(embedUrl) : match;
    },
  );
}

/**
 * Renders trusted CMS HTML for news detail body.
 * Wrap at spaces (Vietnamese-safe); only break ultra-long tokens (URLs) if needed.
 */
function preventDashWrapping(html: string): string {
  if (!html) return "";

  // Cleanse invisible line-breaking characters (soft hyphens, zero-width spaces, etc.)
  const cleansed = html
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
  const withVideos = hydrateYouTubeLinks(normalizedHtml);
  const processedHtml = preventDashWrapping(withVideos);

  return (
    <div
      className={cn(
        "news-entry w-full overflow-x-hidden border-b border-border pb-8 font-sans text-lg leading-relaxed text-foreground [overflow-wrap:break-word] [word-break:keep-all]",
        "[&_*]:[word-break:keep-all] [&_*]:[overflow-wrap:break-word]",
        "[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_blockquote]:mb-8 [&_blockquote]:rounded-[20px] [&_blockquote]:bg-muted [&_blockquote]:p-8",
        "[&_blockquote_p]:m-0 [&_blockquote_p]:font-display [&_blockquote_p]:text-xl [&_blockquote_p]:font-semibold [&_blockquote_p]:leading-snug [&_blockquote_p]:text-primary",
        "[&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:text-primary md:[&_h2]:text-4xl",
        "[&_iframe]:my-5 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-[12px]",
        "[&_.ql-video]:my-5 [&_.ql-video]:aspect-video [&_.ql-video]:w-full [&_.ql-video]:rounded-[12px]",
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
