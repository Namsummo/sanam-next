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

export function NewsCard({ article, className }: NewsCardProps) {
  const href = `/news/${article.slug ?? article.id}`;
  const categoryLabel = getNewsCategoryLabel(article.categoryId);

  return (
    <article
      className={cn(
        "flex h-full flex-col pb-8",
        className,
      )}
    >
      <div className="mb-5 overflow-hidden rounded-2xl bg-muted">
        <Link href={href} className="block">
          <figure className="aspect-4/3 overflow-hidden rounded-2xl bg-muted">
            <Image
              src={resolveApiUrl(article.coverImage) || DEFAULT_COVER}
              alt={article.title || DEFAULT_COVER_ALT}
              width={640}
              height={480}
              unoptimized={!!article.coverImage}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </figure>
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {categoryLabel ? (
            <span className="rounded-lg bg-accent px-3 py-1.5 font-sans text-sm font-medium text-white">
              {categoryLabel}
            </span>
          ) : null}
          <time
            dateTime={article.publishedAt}
            className="font-sans text-sm font-medium text-foreground"
          >
            {formatNewsDate(article.publishedAt)}
          </time>
        </div>

        <div className="flex-1">
          <h2 className="font-display text-xl leading-relaxed text-primary">
            <Link
              href={href}
              className="text-inherit transition-colors hover:text-accent"
            >
              {article.title}
            </Link>
          </h2>
          {article.excerpt ? (
            <p
              className="mt-3 line-clamp-3 font-sans text-base leading-relaxed text-foreground"
              title={article.excerpt}
            >
              {article.excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <NewsReadMoreLink href={href} />
        </div>
      </div>
    </article>
  );
}
