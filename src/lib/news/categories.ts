import type { NewsArticle, NewsCategory } from "@/lib/news/types";

export const mockNewsCategories: NewsCategory[] = [
  { id: "thong-bao", label: "Thông báo", sortOrder: 1 },
  { id: "su-kien", label: "Sự kiện", sortOrder: 2 },
  { id: "le-kinh", label: "Lễ kính", sortOrder: 3 },
  { id: "hoat-dong", label: "Hoạt động", sortOrder: 4 },
  { id: "bai-viet", label: "Bài viết", sortOrder: 5 },
  { id: "cao-pho", label: "Cáo phó", sortOrder: 6 },
];

export function getVisibleNewsCategories(): NewsCategory[] {
  return mockNewsCategories.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getNewsCategoryById(
  categoryId?: string,
): NewsCategory | undefined {
  if (!categoryId) return undefined;
  return mockNewsCategories.find((c) => c.id === categoryId);
}

export function getNewsCategoryLabel(categoryId?: string): string | undefined {
  return getNewsCategoryById(categoryId)?.label;
}

export type NewsCategoryCount = NewsCategory & { count: number };

export function getNewsCategoriesWithCounts(
  articles: NewsArticle[],
): NewsCategoryCount[] {
  const counts = new Map<string, number>();
  for (const a of articles) {
    if (!a.categoryId) continue;
    counts.set(a.categoryId, (counts.get(a.categoryId) ?? 0) + 1);
  }

  return getVisibleNewsCategories().map((c) => ({
    ...c,
    count: counts.get(c.id) ?? 0,
  }));
}
