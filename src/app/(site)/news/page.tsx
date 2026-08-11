import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/site/news/news-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getCategories, getPublicNews } from "@/shared/services/news-api";
import type { NewsArticle } from "@/lib/news/types";

async function fetchArticles(page: number, category?: string): Promise<NewsArticle[]> {
  try {
    const data = await getPublicNews({ page, limit: 12, categoryId: category });
    return data.articles.map((a) => ({
      id: a._id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      contentFormat: a.contentFormat,
      categoryId: a.categoryId?.slug,
      coverImage: a.coverImage ?? undefined,
      publishedAt: a.publishedAt,
      isFeatured: a.isFeatured,
      isVisible: a.isVisible,
    }));
  } catch {
    const { getVisibleNews } = await import("@/lib/news/mock-news");
    return getVisibleNews();
  }
}

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, thông báo và hoạt động của Giáo xứ Sa Nam",
};

export default async function NewsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams.page;
  const page = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1;
  const categoryStr = searchParams.category;
  const category = typeof categoryStr === "string" ? categoryStr : undefined;

  const [bgSettings, categories] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getCategories().catch(() => []),
  ]);
  const activeCategory = categories.find((item) => item.slug === category);
  const articles = await fetchArticles(page, activeCategory?._id);

  return (
    <>
      <PageHeader
        title="Tin tức"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức" },
        ]}
        backgroundImage={bgSettings?.newsBg ?? undefined}
      />
      <section className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <nav
            aria-label="Danh mục tin tức"
            className="mb-10 flex flex-wrap justify-center gap-3 md:mb-12"
          >
            <Link
              href="/news"
              aria-current={!activeCategory ? "page" : undefined}
              className={
                !activeCategory
                  ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white"
                  : "rounded-full border border-border bg-card px-5 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
              }
            >
              Tất cả
            </Link>
            {categories.map((item) => {
              const isActive = item._id === activeCategory?._id;
              return (
                <Link
                  key={item._id}
                  href={`/news?category=${encodeURIComponent(item.slug)}`}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white"
                      : "rounded-full border border-border bg-card px-5 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {articles.length === 0 ? (
            <p className="text-center font-sans text-lg text-foreground">
              Chưa có tin tức nào được đăng.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
