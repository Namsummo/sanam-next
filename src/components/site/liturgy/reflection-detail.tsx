import Link from "next/link";
import { LiturgyCoverHeader } from "@/components/site/liturgy/liturgy-cover-header";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import type { LiturgyReflection } from "@/lib/liturgy/types";
import { cn } from "@/lib/utils";

type ReflectionDetailProps = {
  reflection: LiturgyReflection;
  className?: string;
};

export function ReflectionDetail({
  reflection,
  className,
}: ReflectionDetailProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <LiturgyCoverHeader
        title={reflection.title}
        coverImage={reflection.coverImage}
        subtitle={reflection.keyPoint || ""}
        date={reflection.date}
      />
      <article className="rounded-2xl border border-border bg-card p-5 md:p-5">
        <NewsHtmlContent html={reflection.content} className="text-sm md:text-base leading-relaxed text-black" />

        {reflection.author ? (
          <p className="mt-4 text-end text-sm md:text-base leading-relaxed text-black">
            {reflection.author}
          </p>
        ) : null}
      </article>

      <Link
        href="/worship"
        className="inline-block font-sans text-sm font-semibold text-accent hover:underline"
      >
        ← Quay lại tuần phụng vụ
      </Link>
    </div>
  );
}
