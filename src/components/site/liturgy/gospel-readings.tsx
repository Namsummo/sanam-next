import type { LiturgyGospel } from "@/lib/liturgy/types";
import { cn } from "@/lib/utils";
import { LiturgyCoverHeader } from "@/components/site/liturgy/liturgy-cover-header";
import { NewsHtmlContent } from "../news/news-html-content";

type GospelReadingsProps = {
  gospel: LiturgyGospel | null;
  className?: string;
};

function ReadingBlock({
  label,
  title,
  content,
  className,
  contentClassName,
}: {
  label: string;
  title: string;
  content: string;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-5 md:p-6",
        className,
      )}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-accent">
        {label}
      </p>

      {title ? (
        <h3 className="mt-2 font-display text-lg font-semibold text-primary md:text-xl">
          {title}
        </h3>
      ) : null}

      <div
        className={cn(
          "whitespace-pre-wrap font-sans leading-relaxed text-foreground ",
          title ? "mt-4" : "mt-2",
          contentClassName,
        )}
      >
        <NewsHtmlContent html={content} className="text-sm md:text-base leading-relaxed text-foreground" />
      </div>
    </article>
  );
}
export function GospelReadings({ gospel, className }: GospelReadingsProps) {

  if (!gospel) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-border bg-muted/40 px-5 py-8 text-center", className)}>
        <p className="font-sans text-base text-foreground/70">Chưa cập nhật</p>
      </div>
    );
  }
  const showCoverHeader = Boolean(gospel.coverImage || gospel.theme || gospel.liturgicalDayName);

  return (
    <div className={cn("space-y-4", className)}>
      {showCoverHeader ? (
        <LiturgyCoverHeader
          title={gospel.liturgicalDayName || ""}
          coverImage={gospel.coverImage}
          subtitle={gospel.theme || ""}
          date={gospel.date}
        />
      ) : null}
      <ReadingBlock
        label="Bài đọc I"
        title={gospel.firstReadingTitle}
        content={gospel.firstReadingContent}
      />
      {gospel.secondReadingTitle && gospel.secondReadingContent ? (
        <ReadingBlock
          label="Bài đọc II"
          title={gospel.secondReadingTitle}
          content={gospel.secondReadingContent}
        />
      ) : null}
      <ReadingBlock
        label="Phúc Âm"
        title={gospel.gospelTitle}
        content={gospel.gospelContent}
      />
      {gospel.prayerContent ? (
        <ReadingBlock
          label="Lời nguyện"
          title=""
          content={gospel.prayerContent}
          className="border-l-4 border-r-0 border-t-0 border-b-0 border-accent"
          contentClassName="italic"
        />
      ) : null}
    </div>
  );
}
