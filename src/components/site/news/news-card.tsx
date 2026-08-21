import Image from "next/image";
import Link from "next/link";
import { NewsReadMoreLink } from "@/components/site/news/news-read-more-link";
import { getNewsCategoryLabel } from "@/lib/news/categories";
import { formatNewsDate } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { NewsArticle } from "@/lib/news/types";
import { cn, resolveApiUrl } from "@/lib/utils";

type NewsCardProps = {
  article: NewsArticle;
  className?: string;
};

const CARD_STYLES = {
  container:
    "flex h-full flex-col overflow-hidden rounded-[20px] border border-border/40 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]",
  image: "w-full object-contain transition-transform duration-500 hover:scale-105",
  category:
    "rounded-sm bg-accent px-2.5 py-1 font-sans text-sm font-medium text-white",
  date: "font-sans text-sm font-medium text-foreground/85",
  title:
    "font-display text-xl leading-snug text-primary md:text-lg line-clamp-2 text-inherit no-underline transition-colors hover:text-accent",
  excerpt:
    "line-clamp-3 font-sans text-sm leading-relaxed text-foreground/85",
};

export function NewsCard({ article, className }: NewsCardProps) {
  const href = `/news/${article.slug ?? article.id}`;
  const categoryLabel = getNewsCategoryLabel(article.categoryId);
  const imageUrl = resolveApiUrl(article.coverImage) || DEFAULT_COVER;

  return (
    <article className={cn(CARD_STYLES.container, className)}>
      {/* Image Section */}
      <Link href={href} className="block overflow-hidden bg-muted">
        <figure className="relative w-full">
          <Image
            src={imageUrl}
            alt={article.title || DEFAULT_COVER_ALT}
            width={640}
            height={360}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            className={CARD_STYLES.image}
          />
        </figure>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-5 md:gap-2.5 md:px-6 md:py-4">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel && (
            <span className={CARD_STYLES.category}>{categoryLabel}</span>
          )}
          <time dateTime={article.publishedAt} className={CARD_STYLES.date}>
            {formatNewsDate(article.publishedAt)}
          </time>
        </div>

        {/* Title & Excerpt */}
        <div className="flex flex-1 flex-col gap-2.5 md:gap-2">
          <h2 className="font-display text-xl leading-snug text-primary md:min-h-10 md:text-lg">
            <Link href={href} title={article.title} className={CARD_STYLES.title}>
              {article.title}
            </Link>
          </h2>
          {article.excerpt && (
            <p className={CARD_STYLES.excerpt} title={article.excerpt}>
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="mt-auto border-t border-border pt-4 md:pt-3.5">
          <NewsReadMoreLink href={href} />
        </div>
      </div>
    </article>
  );
}