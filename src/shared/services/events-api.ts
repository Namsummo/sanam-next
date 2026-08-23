import type { EventStatus, ParishEvent } from "@/lib/events/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function toDateString(dateStr: string | undefined | null): string | undefined {
  if (!dateStr) return undefined;
  return dateStr;
}

export interface ApiEventCategory {
  _id: string;
  slug: string;
  label: string;
  sortOrder: number;
  eventCount?: number;
}

export interface ApiEventResponse {
  _id: string;
  name: string;
  slug: string;
  startDate: string;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  allDay?: boolean;
  location: string;
  content: string;
  contentFormat: "plain" | "html";
  image?: string | null;
  categoryId?: { _id: string; slug: string; label: string } | string | null;
  isFeatured: boolean;
  featuredOrder?: number | null;
  status: "draft" | "published" | "cancelled" | "postponed";
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

export interface PaginatedEventsResponse {
  events: ApiEventResponse[];
  pagination: PaginationInfo;
}

export function toParishEvent(data: ApiEventResponse): ParishEvent {
  let categoryId: string | undefined;
  let categoryLabel: string | undefined;

  if (typeof data.categoryId === "object" && data.categoryId) {
    categoryId = data.categoryId._id;
    categoryLabel = data.categoryId.label;
  } else if (typeof data.categoryId === "string") {
    categoryId = data.categoryId;
  }

  return {
    id: data._id,
    slug: data.slug,
    name: data.name,
    startDate: toDateString(data.startDate) ?? data.startDate,
    startTime: data.startTime || undefined,
    endDate: toDateString(data.endDate),
    endTime: data.endTime || undefined,
    allDay: data.allDay,
    location: data.location,
    content: data.content,
    contentFormat: data.contentFormat,
    image: data.image || undefined,
    categoryId,
    categoryLabel,
    isFeatured: data.isFeatured,
    featuredOrder:
      data.featuredOrder != null && Number.isFinite(data.featuredOrder)
        ? data.featuredOrder
        : undefined,
    status: data.status as EventStatus,
    isVisible: data.isVisible,
  };
}

export interface CreateEventData {
  name: string;
  slug?: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
  location: string;
  content: string;
  contentFormat?: "plain" | "html";
  image?: string;
  categoryId?: string | null;
  isFeatured?: boolean;
  featuredOrder?: number | null;
  status?: string;
  isVisible?: boolean;
}

export async function getPublicEvents(params?: {
  page?: number;
  limit?: number;
  featured?: boolean;
  categoryId?: string;
}): Promise<PaginatedEventsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.featured) searchParams.set("featured", "true");
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/api/events${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getPublicEventBySlug(
  slug: string,
): Promise<ApiEventResponse> {
  const res = await fetch(`${API_BASE}/api/events/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

export async function getEventCategories(): Promise<ApiEventCategory[]> {
  const res = await fetch(`${API_BASE}/api/events/categories`);
  if (!res.ok) throw new Error("Failed to fetch event categories");
  return res.json();
}

export async function getAllEvents(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    visibility?: "visible" | "hidden";
    categoryId?: string;
    status?: string;
    search?: string;
  },
): Promise<PaginatedEventsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.visibility) searchParams.set("visibility", params.visibility);
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(
    `${API_BASE}/api/admin/events${query ? `?${query}` : ""}`,
    { headers: authHeaders(token) },
  );
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getEventById(
  token: string,
  id: string,
): Promise<ApiEventResponse> {
  const res = await fetch(`${API_BASE}/api/admin/events/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Event not found");
  return res.json();
}

export async function createEvent(
  token: string,
  data: CreateEventData,
): Promise<ApiEventResponse> {
  const res = await fetch(`${API_BASE}/api/admin/events`, {
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
      .catch(() => ({ message: "Failed to create event" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateEvent(
  token: string,
  id: string,
  data: Partial<CreateEventData>,
): Promise<ApiEventResponse> {
  const res = await fetch(`${API_BASE}/api/admin/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to update event" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteEvent(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete event");
}

export async function toggleEventVisibility(
  token: string,
  id: string,
): Promise<{ isVisible: boolean }> {
  const res = await fetch(`${API_BASE}/api/admin/events/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
}

export async function createEventCategory(
  token: string,
  data: { slug: string; label: string; sortOrder?: number },
): Promise<ApiEventCategory> {
  const res = await fetch(`${API_BASE}/api/admin/events/categories`, {
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

export async function uploadEventImage(
  token: string,
  file: File,
): Promise<string> {
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

export async function deleteEventCategory(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/events/categories/${id}`, {
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

