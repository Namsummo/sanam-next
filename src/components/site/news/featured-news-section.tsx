import { NewsCard } from "@/components/site/news/news-card";
import { Button } from "@/components/site/shared/ui/button/button";
import { getFeaturedNews } from "@/lib/news/mock-news";
import { cn } from "@/lib/utils";

type FeaturedNewsSectionProps = {
  className?: string;
};

export function FeaturedNewsSection({ className }: FeaturedNewsSectionProps) {
  const articles = getFeaturedNews(3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full px-6 py-16 md:px-10 md:py-[120px] md:pb-[90px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="section-title section-title-center mb-10 text-center md:mb-12">
          <span
            className={cn(
              "relative mb-[15px] inline-block rounded-full py-2 pl-8 pr-4",
              "font-sans text-sm font-medium uppercase leading-none text-foreground",
              "bg-muted",
              "before:absolute before:left-4 before:top-1/2 before:size-1.5",
              "before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
            )}
          >
            Tin tức nổi bật
          </span>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
            Cập nhật từ Giáo xứ
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <Button variant="primary" href="/news">
            Xem tất cả
          </Button>
        </div>
      </div>
    </section>
  );
}
