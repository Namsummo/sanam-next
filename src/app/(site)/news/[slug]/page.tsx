import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getNewsCategoryLabel } from "@/lib/news/categories";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import { formatNewsDate } from "@/lib/format";
import { getNewsById, getNewsBySlug, getVisibleNews } from "@/lib/news/mock-news";
import type { NewsArticle } from "@/lib/news/types";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getVisibleArticleBySlug(slug: string): NewsArticle | undefined {
  const article = getNewsBySlug(slug);
  if (!article || !article.isVisible) {
    return undefined;
  }
  return article;
}

export function generateStaticParams() {
  return getVisibleNews()
    .filter((article) => !!article.slug)
    .map((article) => ({
      slug: article.slug!,
    }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const article = getVisibleArticleBySlug(decoded);

  // Back-compat: old links might still point to id in this route.
  if (!article) {
    const byId = getNewsById(decoded);
    if (byId?.isVisible && byId.slug) {
      redirect(`/news/${byId.slug}`);
    }
    return { title: "Không tìm thấy" };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailBySlugPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const article = getVisibleArticleBySlug(decoded);

  // Back-compat: if someone hits /news/{id} but route is slug-based
  if (!article) {
    const byId = getNewsById(decoded);
    if (byId?.isVisible && byId.slug) {
      redirect(`/news/${byId.slug}`);
    }
    notFound();
  }

  const categoryLabel = getNewsCategoryLabel(article.categoryId);

  return (
    <>
      <PageHeader
        title={article.title}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/news" },
          { label: "Chi tiết" },
        ]}
        meta={
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-lg text-white">
            <li className="flex items-center gap-1.5">
              <Clock className="size-[18px] shrink-0" aria-hidden />
              <time dateTime={article.publishedAt}>
                {formatNewsDate(article.publishedAt)}
              </time>
            </li>
          </ul>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {categoryLabel ? (
              <span className="rounded-[10px] bg-accent px-3 py-1.5 font-sans text-sm font-medium text-white">
                {categoryLabel}
              </span>
            ) : null}
          </div>

          <div className="mb-8 overflow-hidden rounded-[20px]">
            <figure className="block overflow-hidden rounded-[20px]">
              <Image
                src={DEFAULT_COVER}
                alt={article.title || DEFAULT_COVER_ALT}
                width={1100}
                height={550}
                priority
                className="aspect-1/0.5 w-full object-cover"
              />
            </figure>
          </div>

          {article.contentFormat === "html" ? (
            <NewsHtmlContent html={article.content} />
          ) : (
            <div className="border-b border-border pb-8">
              <p className="font-sans text-lg leading-relaxed text-foreground whitespace-pre-line">
                {article.content}
              </p>
            </div>
          )}

          <div className="mt-10 border-border pt-8">
            <Link
              href="/news"
              className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
            >
              ← Quay lại tin tức
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

