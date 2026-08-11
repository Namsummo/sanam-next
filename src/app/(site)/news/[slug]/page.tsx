import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getNewsCategoryLabel } from "@/lib/news/categories";
import { formatNewsDate } from "@/lib/format";
import { getPublicNewsBySlug, getPublicNews } from "@/shared/services/news-api";
import type { NewsArticle } from "@/lib/news/types";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { DEFAULT_COVER_ALT } from "@/lib/image-constants";
import { resolveApiUrl } from "@/lib/utils";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function fetchArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  try {
    const data = await getPublicNewsBySlug(slug);
    return {
      id: data._id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      contentFormat: data.contentFormat,
      categoryId: data.categoryId?.slug,
      coverImage: data.coverImage ?? undefined,
      publishedAt: data.publishedAt,
      isFeatured: data.isFeatured,
      isVisible: data.isVisible,
    };
  } catch {
    const { getNewsBySlug, getNewsById } = await import("@/lib/news/mock-news");
    const article = getNewsBySlug(slug);
    if (!article || !article.isVisible) {
      const byId = getNewsById(slug);
      return byId?.isVisible ? byId : undefined;
    }
    return article;
  }
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const data = await getPublicNews({ page: 1, limit: 100 });
    return data.articles
      .filter((a) => a.isVisible && a.slug)
      .map((a) => ({ slug: a.slug }));
  } catch {
    const { getVisibleNews } = await import("@/lib/news/mock-news");
    return getVisibleNews()
      .filter((a) => !!a.slug)
      .map((a) => ({ slug: a.slug! }));
  }
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const article = await fetchArticleBySlug(decoded);

  if (!article) {
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

  const [article, bgSettings] = await Promise.all([
    fetchArticleBySlug(decoded),
    getBackgroundSettings().catch(() => null),
  ]);

  if (!article) {
    const { getNewsById } = await import("@/lib/news/mock-news");
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
        backgroundImage={bgSettings?.newsBg}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/news" },
          { label: "Chi tiết" },
        ]}
        meta={
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-lg text-white">
            <li className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              <time dateTime={article.publishedAt}>
                {formatNewsDate(article.publishedAt)}
              </time>
            </li>
          </ul>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          {article.coverImage ? (
            <figure className="mb-8 overflow-hidden rounded-2xl">
              <Image
                src={resolveApiUrl(article.coverImage)}
                alt={article.title || DEFAULT_COVER_ALT}
                width={1100}
                height={688}
                unoptimized
                priority
                className="aspect-16/10 w-full object-contain"
              />
            </figure>
          ) : null}

          <div className="mb-8 flex flex-wrap items-center gap-2">
            {categoryLabel ? (
              <span className="rounded-[10px] bg-accent px-3 py-1.5 font-sans text-sm font-medium text-white">
                {categoryLabel}
              </span>
            ) : null}
          </div>

          <div className="w-full">
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
        </div>
      </article>
    </>
  );
}
