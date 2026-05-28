import { cn } from "@/lib/utils";

type NewsHtmlContentProps = {
  html: string;
  className?: string;
};

/** Renders trusted CMS/mock HTML for news detail body */
export function NewsHtmlContent({ html, className }: NewsHtmlContentProps) {
  return (
    <div
      className={cn(
        "news-entry border-b border-border pb-8 font-sans text-lg leading-relaxed text-foreground",
        "[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_blockquote]:mb-8 [&_blockquote]:rounded-[20px] [&_blockquote]:bg-muted [&_blockquote]:p-8",
        "[&_blockquote_p]:m-0 [&_blockquote_p]:font-display [&_blockquote_p]:text-xl [&_blockquote_p]:font-semibold [&_blockquote_p]:leading-snug [&_blockquote_p]:text-primary",
        "[&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:text-primary md:[&_h2]:text-4xl",
        "[&_li]:mb-4 [&_li]:text-lg [&_li]:leading-relaxed",
        "[&_ol]:mb-8 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_p]:mb-5 [&_p:last-child]:mb-0",
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
