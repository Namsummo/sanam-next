import type { WorshipVideoCategory, WorshipVideoItem } from "@/lib/videos/admin-worship-store";
import type { LiveSettings } from "@/lib/videos/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ApiWorshipCategoryResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiWorshipVideoResponse {
  _id: string;
  categoryId: string | { _id: string; name: string; slug: string };
  title: string;
  sourceType: "youtube" | "upload";
  youtubeId?: string | null;
  youtubeUrl?: string | null;
  uploadUrl?: string | null;
  thumbnail?: string | null;
  duration?: string | null;
  publishedAt: string;
  description?: string | null;
  speaker?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiLiveSettingResponse {
  _id: string;
  isLive: boolean;
  youtubeId: string;
  youtubeUrl: string;
  title?: string | null;
  description?: string | null;
  startedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toWorshipVideoCategory(data: ApiWorshipCategoryResponse): WorshipVideoCategory {
  return {
    id: data._id,
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    sortOrder: data.sortOrder,
  };
}

export function toWorshipVideoItem(data: ApiWorshipVideoResponse): WorshipVideoItem {
  const categoryId =
    typeof data.categoryId === "object" && data.categoryId !== null
      ? data.categoryId._id
      : data.categoryId;

  return {
    id: data._id,
    categoryId,
    title: data.title,
    sourceType: data.sourceType,
    youtubeId: data.youtubeId || undefined,
    youtubeUrl: data.youtubeUrl || undefined,
    uploadUrl: data.uploadUrl || undefined,
    thumbnail: data.thumbnail || undefined,
    duration: data.duration || undefined,
    publishedAt: data.publishedAt,
    description: data.description || undefined,
    speaker: data.speaker || undefined,
    views: data.views,
  };
}

export function toLiveSettings(data: ApiLiveSettingResponse): LiveSettings {
  return {
    isLive: data.isLive,
    youtubeId: data.youtubeId,
    youtubeUrl: data.youtubeUrl,
    title: data.title || undefined,
    description: data.description || undefined,
    startedAt: data.startedAt || undefined,
  };
}

// ==========================================
// Public APIs
// ==========================================

export async function getPublicWorshipCategories(): Promise<{
  categories: ApiWorshipCategoryResponse[];
}> {
  const res = await fetch(`${API_BASE}/api/worship/categories`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch worship categories");
  return res.json();
}

export async function getPublicWorshipVideos(categoryId?: string): Promise<{
  videos: ApiWorshipVideoResponse[];
}> {
  const url = categoryId
    ? `${API_BASE}/api/worship/videos?categoryId=${encodeURIComponent(categoryId)}`
    : `${API_BASE}/api/worship/videos`;
  const res = await fetch(url, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch worship videos");
  return res.json();
}

export async function getPublicLiveSettings(): Promise<ApiLiveSettingResponse> {
  const res = await fetch(`${API_BASE}/api/worship/live`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch live settings");
  return res.json();
}

// ==========================================
// Admin APIs
// ==========================================

export async function getAdminWorshipCategories(
  token: string,
): Promise<{ categories: ApiWorshipCategoryResponse[] }> {
  const res = await fetch(`${API_BASE}/api/admin/worship/categories`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch admin worship categories");
  return res.json();
}

export async function createAdminWorshipCategory(
  token: string,
  data: Omit<WorshipVideoCategory, "id">,
): Promise<ApiWorshipCategoryResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create category" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateAdminWorshipCategory(
  token: string,
  id: string,
  data: Partial<Omit<WorshipVideoCategory, "id">>,
): Promise<ApiWorshipCategoryResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update category" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteAdminWorshipCategory(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/worship/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete category");
}

export async function getAdminWorshipVideos(
  token: string,
): Promise<{ videos: ApiWorshipVideoResponse[] }> {
  const res = await fetch(`${API_BASE}/api/admin/worship/videos`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch admin worship videos");
  return res.json();
}

export async function createAdminWorshipVideo(
  token: string,
  data: Omit<WorshipVideoItem, "id">,
): Promise<ApiWorshipVideoResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/videos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create video" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateAdminWorshipVideo(
  token: string,
  id: string,
  data: Partial<Omit<WorshipVideoItem, "id">>,
): Promise<ApiWorshipVideoResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/videos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update video" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteAdminWorshipVideo(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/worship/videos/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete video");
}

export async function syncAdminWorshipVideoViews(token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/admin/worship/videos/sync-views`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to sync YouTube views");
  return res.json();
}

export async function getAdminLiveSettings(token: string): Promise<ApiLiveSettingResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/live`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch admin live settings");
  return res.json();
}

export async function updateAdminLiveSettings(
  token: string,
  data: Partial<LiveSettings>,
): Promise<ApiLiveSettingResponse> {
  const res = await fetch(`${API_BASE}/api/admin/worship/live`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update live settings" }));
    throw new Error(err.message);
  }
  return res.json();
}
