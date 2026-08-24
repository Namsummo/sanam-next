const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface NewsArticleResponse {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: "plain" | "html";
  categoryId?: {
    _id: string;
    slug: string;
    label: string;
  } | null;
  coverImage?: string | null;
  publishedAt: string;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse {
  articles: NewsArticleResponse[];
  pagination: PaginationInfo;
}

export interface NewsCategoryResponse {
  _id: string;
  slug: string;
  label: string;
  sortOrder: number;
  articleCount?: number;
}

export interface CreateNewsData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  contentFormat?: "plain" | "html";
  categoryId?: string | null;
  coverImage?: string | null;
  publishedAt?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
}

export async function getPublicNews(params?: {
  page?: number;
  limit?: number;
  featured?: boolean;
  categoryId?: string;
}): Promise<PaginatedResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/api/news${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export async function getPublicNewsBySlug(
  slug: string,
): Promise<NewsArticleResponse> {
  const res = await fetch(`${API_BASE}/api/news/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Article not found");
  return res.json();
}

export async function getCategories(): Promise<NewsCategoryResponse[]> {
  const res = await fetch(`${API_BASE}/api/news/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getAllNews(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    visibility?: "visible" | "hidden";
    categoryId?: string;
    search?: string;
  },
): Promise<PaginatedResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.visibility) searchParams.set("visibility", params.visibility);
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(
    `${API_BASE}/api/admin/news${query ? `?${query}` : ""}`,
    { headers: authHeaders(token) },
  );
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export async function getNewsById(
  token: string,
  id: string,
): Promise<NewsArticleResponse> {
  const res = await fetch(`${API_BASE}/api/admin/news/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Article not found");
  return res.json();
}

export async function createNews(
  token: string,
  data: CreateNewsData,
): Promise<NewsArticleResponse> {
  const res = await fetch(`${API_BASE}/api/admin/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateNews(
  token: string,
  id: string,
  data: Partial<CreateNewsData>,
): Promise<NewsArticleResponse> {
  const res = await fetch(`${API_BASE}/api/admin/news/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteNews(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/news/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete");
}

export async function toggleNewsVisibility(
  token: string,
  id: string,
): Promise<{ isVisible: boolean }> {
  const res = await fetch(`${API_BASE}/api/admin/news/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
}

export async function createCategory(
  token: string,
  data: { slug: string; label: string; sortOrder?: number },
): Promise<NewsCategoryResponse> {
  const res = await fetch(`${API_BASE}/api/admin/news/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to create category" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to upload" }));
    throw new Error(err.message);
  }
  const data = await res.json();
  return `${API_BASE}${data.url}`;
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/news/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to delete category" }));
    throw new Error(err.message);
  }
}
