import type { Metadata } from "next";
import { NewsCard } from "@/components/site/news/news-card";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getVisibleNews } from "@/lib/news/mock-news";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, thông báo và hoạt động của Giáo xứ Sa Nam",
};

export default function NewsPage() {
  const articles = getVisibleNews();

  return (
    <>
      <PageHeader
        title="Tin tức"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức" },
        ]}
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
