import type {
  FeastPayload,
  FeastRankPayload,
  GospelPayload,
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgyGospel,
  LiturgyReflection,
  LiturgySeason,
  ReflectionPayload,
  SeasonPayload,
  SeasonWithFeasts,
} from "@/lib/liturgy/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ApiSeasonResponse {
  _id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  isCurrentSeason?: boolean;
  feasts?: ApiFeastResponse[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiFeastRankResponse {
  _id: string;
  label: string;
  slug: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiFeastResponse {
  _id: string;
  name: string;
  date: string;
  seasonId: string | { _id: string; name: string; slug: string };
  rankId: string | { _id: string; label: string; slug: string; sortOrder?: number };
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiGospelResponse {
  _id: string;
  date: string;
  liturgicalDayName: string;
  theme: string;
  coverImage?: string | null;
  firstReadingTitle: string;
  firstReadingContent: string;
  secondReadingTitle?: string | null;
  secondReadingContent?: string | null;
  gospelTitle: string;
  gospelContent: string;
  prayerContent?: string | null;
  seasonId?: string | { _id: string; name: string; slug: string } | null;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiReflectionResponse {
  _id: string;
  date: string;
  title: string;
  coverImage?: string | null;
  content: string;
  author?: string | null;
  keyPoint?: string | null;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// Data Transformers
// ==========================================

export function toLiturgySeason(data: ApiSeasonResponse): LiturgySeason {
  return {
    id: data._id,
    name: data.name,
    slug: data.slug,
    startDate: data.startDate,
    endDate: data.endDate,
    isCurrentSeason: Boolean(data.isCurrentSeason),
  };
}

export function toLiturgyFeastRank(data: ApiFeastRankResponse): LiturgyFeastRank {
  return {
    id: data._id,
    slug: data.slug,
    label: data.label,
    sortOrder: data.sortOrder ?? 0,
  };
}

export function toLiturgyFeast(data: ApiFeastResponse): LiturgyFeast {
  const seasonId =
    typeof data.seasonId === "object" && data.seasonId !== null
      ? data.seasonId._id
      : data.seasonId;

  const rankObj =
    typeof data.rankId === "object" && data.rankId !== null ? data.rankId : null;
  const rankId = rankObj ? rankObj._id : (data.rankId as string);
  const rankLabel = rankObj ? rankObj.label : undefined;

  return {
    id: data._id,
    name: data.name,
    date: data.date,
    seasonId,
    rankId,
    rankLabel,
    status: data.status,
  };
}

export function toLiturgyGospel(data: ApiGospelResponse): LiturgyGospel {
  const seasonId =
    typeof data.seasonId === "object" && data.seasonId !== null
      ? data.seasonId._id
      : (data.seasonId as string | undefined);

  return {
    id: data._id,
    date: data.date,
    liturgicalDayName: data.liturgicalDayName,
    theme: data.theme,
    coverImage: data.coverImage || undefined,
    firstReadingTitle: data.firstReadingTitle,
    firstReadingContent: data.firstReadingContent,
    secondReadingTitle: data.secondReadingTitle || undefined,
    secondReadingContent: data.secondReadingContent || undefined,
    gospelTitle: data.gospelTitle,
    gospelContent: data.gospelContent,
    prayerContent: data.prayerContent || undefined,
    seasonId: seasonId || undefined,
    status: data.status,
  };
}

export function toLiturgyReflection(data: ApiReflectionResponse): LiturgyReflection {
  return {
    id: data._id,
    date: data.date,
    title: data.title,
    coverImage: data.coverImage || undefined,
    content: data.content,
    author: data.author || undefined,
    keyPoint: data.keyPoint || undefined,
    status: data.status,
  };
}

// ==========================================
// Public APIs
// ==========================================

export async function getPublishedGospels(): Promise<LiturgyGospel[]> {
  try {
    const res = await fetch(`${API_BASE}/api/liturgy/gospels`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch published gospels");
    return res.json();
  } catch (err) {
    console.error("getPublishedGospels error:", err);
    return [];
  }
}

export async function getGospelById(id: string): Promise<LiturgyGospel | null> {
  try {
    const res = await fetch(`${API_BASE}/api/liturgy/gospels/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch gospel");
    }
    return res.json();
  } catch (err) {
    console.error("getGospelById error:", err);
    return null;
  }
}

export async function getPublishedReflections(): Promise<LiturgyReflection[]> {
  try {
    const res = await fetch(`${API_BASE}/api/liturgy/reflections`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch published reflections");
    return res.json();
  } catch (err) {
    console.error("getPublishedReflections error:", err);
    return [];
  }
}

export async function getReflectionById(id: string): Promise<LiturgyReflection | null> {
  try {
    const res = await fetch(`${API_BASE}/api/liturgy/reflections/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch reflection");
    }
    return res.json();
  } catch (err) {
    console.error("getReflectionById error:", err);
    return null;
  }
}

export async function getSeasonsWithFeasts(): Promise<SeasonWithFeasts[]> {
  try {
    const res = await fetch(`${API_BASE}/api/liturgy/seasons`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch seasons");
    return res.json();
  } catch (err) {
    console.error("getSeasonsWithFeasts error:", err);
    return [];
  }
}

// ==========================================
// Admin APIs
// ==========================================

// Upload Image
export async function uploadLiturgyImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to upload image" }));
    throw new Error(err.message || "Failed to upload image");
  }

  const data = await res.json();
  return data.url;
}

// 1. Seasons
export async function getAdminSeasons(
  token: string,
): Promise<{ seasons: ApiSeasonResponse[] }> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/seasons`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch admin seasons");
  return res.json();
}

export async function createAdminSeason(
  token: string,
  payload: SeasonPayload,
): Promise<ApiSeasonResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/seasons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create season" }));
    throw new Error(err.message || "Failed to create season");
  }
  return res.json();
}

export async function updateAdminSeason(
  token: string,
  id: string,
  payload: Partial<SeasonPayload>,
): Promise<ApiSeasonResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/seasons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update season" }));
    throw new Error(err.message || "Failed to update season");
  }
  return res.json();
}

export async function deleteAdminSeason(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/seasons/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to delete season" }));
    throw new Error(err.message || "Failed to delete season");
  }
}

// 2. Feast Ranks
export async function getAdminFeastRanks(
  token: string,
): Promise<{ ranks: ApiFeastRankResponse[] }> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feast-ranks`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch feast ranks");
  return res.json();
}

export async function createAdminFeastRank(
  token: string,
  payload: FeastRankPayload,
): Promise<ApiFeastRankResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feast-ranks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create feast rank" }));
    throw new Error(err.message || "Failed to create feast rank");
  }
  return res.json();
}

export async function updateAdminFeastRank(
  token: string,
  id: string,
  payload: Partial<FeastRankPayload>,
): Promise<ApiFeastRankResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feast-ranks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update feast rank" }));
    throw new Error(err.message || "Failed to update feast rank");
  }
  return res.json();
}

export async function deleteAdminFeastRank(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feast-ranks/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to delete feast rank" }));
    throw new Error(err.message || "Failed to delete feast rank");
  }
}

// 3. Feasts
export async function getAdminFeasts(
  token: string,
  params?: { seasonId?: string; status?: string },
): Promise<{ feasts: ApiFeastResponse[] }> {
  const query = new URLSearchParams();
  if (params?.seasonId) query.set("seasonId", params.seasonId);
  if (params?.status) query.set("status", params.status);

  const qs = query.toString();
  const url = `${API_BASE}/api/admin/liturgy/feasts${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch feasts");
  return res.json();
}

export async function createAdminFeast(
  token: string,
  payload: FeastPayload,
): Promise<ApiFeastResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feasts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create feast" }));
    throw new Error(err.message || "Failed to create feast");
  }
  return res.json();
}

export async function updateAdminFeast(
  token: string,
  id: string,
  payload: Partial<FeastPayload>,
): Promise<ApiFeastResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feasts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update feast" }));
    throw new Error(err.message || "Failed to update feast");
  }
  return res.json();
}

export async function deleteAdminFeast(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/feasts/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to delete feast" }));
    throw new Error(err.message || "Failed to delete feast");
  }
}

// 4. Gospels
export async function getAdminGospels(
  token: string,
  params?: { search?: string; status?: string; from?: string; to?: string },
): Promise<{ gospels: ApiGospelResponse[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const qs = query.toString();
  const url = `${API_BASE}/api/admin/liturgy/gospels${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch gospels");
  return res.json();
}

export async function createAdminGospel(
  token: string,
  payload: GospelPayload,
): Promise<ApiGospelResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/gospels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create gospel" }));
    throw new Error(err.message || "Failed to create gospel");
  }
  return res.json();
}

export async function updateAdminGospel(
  token: string,
  id: string,
  payload: Partial<GospelPayload>,
): Promise<ApiGospelResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/gospels/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update gospel" }));
    throw new Error(err.message || "Failed to update gospel");
  }
  return res.json();
}

export async function deleteAdminGospel(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/gospels/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to delete gospel" }));
    throw new Error(err.message || "Failed to delete gospel");
  }
}

// 5. Reflections
export async function getAdminReflections(
  token: string,
  params?: { search?: string; status?: string; from?: string; to?: string },
): Promise<{ reflections: ApiReflectionResponse[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const qs = query.toString();
  const url = `${API_BASE}/api/admin/liturgy/reflections${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch reflections");
  return res.json();
}

export async function createAdminReflection(
  token: string,
  payload: ReflectionPayload,
): Promise<ApiReflectionResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/reflections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create reflection" }));
    throw new Error(err.message || "Failed to create reflection");
  }
  return res.json();
}

export async function updateAdminReflection(
  token: string,
  id: string,
  payload: Partial<ReflectionPayload>,
): Promise<ApiReflectionResponse> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/reflections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update reflection" }));
    throw new Error(err.message || "Failed to update reflection");
  }
  return res.json();
}

export async function deleteAdminReflection(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/liturgy/reflections/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to delete reflection" }));
    throw new Error(err.message || "Failed to delete reflection");
  }
}
