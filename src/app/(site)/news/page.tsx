import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/site/news/news-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { SiteSearchInput } from "@/components/site/shared/components/site-search-input";
import { getCategories, getPublicNews } from "@/shared/services/news-api";
import type { NewsArticle } from "@/lib/news/types";

async function fetchArticles(page: number, category?: string, search?: string): Promise<NewsArticle[]> {
  try {
    const data = await getPublicNews({ page, limit: 12, categoryId: category, search });
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
    return [];
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
  const searchStr = searchParams.search;
  const search = typeof searchStr === "string" ? searchStr.trim() : undefined;

  const [bgSettings, categories] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getCategories().catch(() => []),
  ]);
  const activeCategory = categories.find((item) => item.slug === category);
  const articles = await fetchArticles(page, activeCategory?._id, search);

  const buildCategoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  };

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
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex justify-center">
            <SiteSearchInput
              placeholder="Tìm kiếm bài viết, tin tức, thông báo…"
              className="max-w-lg"
            />
          </div>

          <nav
            aria-label="Danh mục tin tức"
            className="mb-10 flex flex-wrap justify-center gap-3 md:mb-12"
          >
            <Link
              href={buildCategoryHref(undefined)}
              scroll={false}
              aria-current={!activeCategory ? "page" : undefined}
              className={
                !activeCategory
                  ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-xs"
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
                  href={buildCategoryHref(item.slug)}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-xs"
                      : "rounded-full border border-border bg-card px-5 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {articles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-lg text-foreground">
                {search
                  ? `Không tìm thấy tin tức nào phù hợp với từ khóa “${search}”.`
                  : "Chưa có tin tức nào được đăng."}
              </p>
              {search ? (
                <Link
                  href={category ? `/news?category=${encodeURIComponent(category)}` : "/news"}
                  scroll={false}
                  className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:underline"
                >
                  Xóa từ khóa tìm kiếm
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 xl:grid-cols-3">
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
