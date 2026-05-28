export type NewsContentFormat = "plain" | "html";

export type NewsCategory = {
  id: string;
  label: string;
  sortOrder?: number;
};

export type NewsArticle = {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  contentFormat: NewsContentFormat;
  categoryId?: string;
  image?: string;
  imageAlt?: string;
  publishedAt: string; // ISO 8601
  isFeatured: boolean;
  isVisible: boolean; // Admin can turn web display on/off.
};
