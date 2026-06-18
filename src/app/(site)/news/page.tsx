import type { Metadata } from "next";
import { NewsCard } from "@/components/site/news/news-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getPublicNews } from "@/shared/services/news-api";
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

  const bgSettings = await getBackgroundSettings().catch(() => null);
  const articles = await fetchArticles(page, category);

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
