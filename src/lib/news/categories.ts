import type { NewsArticle, NewsCategory } from "@/lib/news/types";

export const NEWS_SECTIONS: NewsCategory[] = [
  { id: "thong-bao", label: "Thông Báo", sortOrder: 1 },
  { id: "giao-hoi-viet-nam", label: "Giáo Hội Việt Nam", sortOrder: 2 },
  { id: "tin-tuc-giao-hat", label: "Tin tức Giáo Hạt", sortOrder: 3 },
  { id: "tin-tuc-giao-phan", label: "Tin tức Giáo Phận", sortOrder: 4 },
  { id: "hoat-dong-giao-xu", label: "Hoạt động giáo xứ", sortOrder: 5 },
];

export function getNewsSectionHref(slug: string): string {
  return `/news/category/${slug}`;
}

export function getNewsSectionBySlug(slug?: string): NewsCategory | undefined {
  if (!slug) return undefined;
  return NEWS_SECTIONS.find((section) => section.id === slug);
}

export function isCanonicalNewsSectionSlug(slug?: string): boolean {
  return Boolean(getNewsSectionBySlug(slug));
}

export function getVisibleNewsCategories(): NewsCategory[] {
  return [...NEWS_SECTIONS].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

export function getNewsCategoryById(
  categoryId?: string,
): NewsCategory | undefined {
  return getNewsSectionBySlug(categoryId);
}

export function getNewsCategoryLabel(categoryId?: string): string | undefined {
  return getNewsCategoryById(categoryId)?.label;
}

export function sortNewsCategoriesBySection<T extends { slug: string }>(
  categories: T[],
): T[] {
  const order = new Map(
    NEWS_SECTIONS.map((section, index) => [section.id, index]),
  );
  return [...categories].sort((a, b) => {
    const aOrder = order.get(a.slug) ?? NEWS_SECTIONS.length;
    const bOrder = order.get(b.slug) ?? NEWS_SECTIONS.length;
    return aOrder - bOrder || a.slug.localeCompare(b.slug);
  });
}

export type NewsCategoryCount = NewsCategory & { count: number };

export function getNewsCategoriesWithCounts(
  articles: NewsArticle[],
): NewsCategoryCount[] {
  const counts = new Map<string, number>();
  for (const article of articles) {
    if (!article.categoryId) continue;
    counts.set(article.categoryId, (counts.get(article.categoryId) ?? 0) + 1);
  }

  return getVisibleNewsCategories().map((category) => ({
    ...category,
    count: counts.get(category.id) ?? 0,
  }));
}
