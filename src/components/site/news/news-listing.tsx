import Link from "next/link";
import { NewsCard } from "@/components/site/news/news-card";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { SiteSearchInput } from "@/components/site/shared/components/site-search-input";
import { getNewsSectionBySlug, getNewsSectionHref } from "@/lib/news/categories";
import type { NewsArticle } from "@/lib/news/types";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { getCategories, getPublicNews } from "@/shared/services/news-api";

async function fetchArticles(
  page: number,
  categoryId?: string,
  search?: string,
): Promise<NewsArticle[]> {
  try {
    const data = await getPublicNews({ page, limit: 12, categoryId, search });
    return data.articles.map((article) => ({
      id: article._id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      contentFormat: article.contentFormat,
      categoryId: article.categoryId?.slug,
      coverImage: article.coverImage ?? undefined,
      publishedAt: article.publishedAt,
      isFeatured: article.isFeatured,
      isVisible: article.isVisible,
    }));
  } catch {
    return [];
  }
}

type NewsListingProps = {
  categorySlug?: string;
  search?: string;
  page?: number;
};

export async function NewsListing({
  categorySlug,
  search,
  page = 1,
}: NewsListingProps) {
  const section = getNewsSectionBySlug(categorySlug);
  const [bgSettings, categories] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getCategories().catch(() => []),
  ]);
  const activeCategory = section
    ? categories.find((item) => item.slug === section.id)
    : undefined;
  const articles = await fetchArticles(page, activeCategory?._id, search);
  const title = section?.label ?? "Tin tức";
  const listingHref = section ? getNewsSectionHref(section.id) : "/news";

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/news" },
          ...(section ? [{ label: section.label }] : []),
        ]}
        backgroundImage={bgSettings?.newsBg ?? undefined}
      />
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex justify-center">
            <SiteSearchInput
              placeholder="Tìm kiếm bài viết, tin tức, thông báo…"
              className="max-w-lg"
            />
          </div>

          {articles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-lg text-foreground">
                {search
                  ? `Không tìm thấy tin tức nào phù hợp với từ khóa “${search}”.`
                  : section
                    ? `Chưa có tin tức nào trong danh mục “${section.label}”.`
                    : "Chưa có tin tức nào được đăng."}
              </p>
              {search ? (
                <Link
                  href={listingHref}
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
