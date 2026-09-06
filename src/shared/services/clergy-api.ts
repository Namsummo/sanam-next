import type { ClergyMember } from "@/lib/clergy/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ApiClergyResponse {
  _id: string;
  type: 1 | 2;
  fullName: string;
  position: string;
  motto?: string | null;
  description?: string | null;
  birthday?: string | null;
  sortOrder?: number | null;
  isVisible: boolean;
  showOnHomepage?: boolean;
  image?: string | null;
  ordinationDate?: string | null;
  patronSaint?: string | null;
  patronDate?: string | null;
  hometown?: string | null;
  termId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedClergyResponse {
  members: ApiClergyResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function toClergyMember(data: ApiClergyResponse): ClergyMember {
  return {
    id: data._id,
    type: data.type,
    fullName: data.fullName,
    position: data.position,
    motto: data.motto || undefined,
    description: data.description || undefined,
    birthday: data.birthday || undefined,
    sortOrder: data.sortOrder ?? undefined,
    isVisible: data.isVisible,
    showOnHomepage: data.showOnHomepage ?? false,
    image: data.image || undefined,
    ordinationDate: data.ordinationDate || undefined,
    patronSaint: data.patronSaint || undefined,
    patronDate: data.patronDate || undefined,
    hometown: data.hometown || undefined,
    termId: data.termId || undefined,
  };
}

export interface CreateClergyData {
  type: 1 | 2;
  fullName: string;
  position: string;
  motto?: string;
  description?: string;
  birthday?: string;
  sortOrder?: number;
  isVisible?: boolean;
  showOnHomepage?: boolean;
  image?: string;
  ordinationDate?: string;
  patronSaint?: string;
  patronDate?: string;
  hometown?: string;
  termId?: string;
}

export async function getPublicClergy(params?: {
  type?: "priest" | "council";
  termId?: string;
}): Promise<{ members: ApiClergyResponse[] }> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);
  if (params?.termId) searchParams.set("termId", params.termId);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/api/clergy${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch clergy members");
  return res.json();
}

export async function getPublicClergyTerms(): Promise<
  Array<{ id: string; startYear: number; endYear: number }>
> {
  const res = await fetch(`${API_BASE}/api/clergy/terms`);
  if (!res.ok) throw new Error("Failed to fetch clergy terms");
  return res.json();
}

export async function getAllClergy(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    type?: "priest" | "council";
    visibility?: "visible" | "hidden";
    termId?: string;
    search?: string;
  },
): Promise<PaginatedClergyResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.type) searchParams.set("type", params.type);
  if (params?.visibility) searchParams.set("visibility", params.visibility);
  if (params?.termId) searchParams.set("termId", params.termId);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(
    `${API_BASE}/api/admin/clergy${query ? `?${query}` : ""}`,
    { headers: authHeaders(token) },
  );
  if (!res.ok) throw new Error("Failed to fetch clergy members");
  return res.json();
}

export async function getClergyById(
  token: string,
  id: string,
): Promise<ApiClergyResponse> {
  const res = await fetch(`${API_BASE}/api/admin/clergy/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Clergy member not found");
  return res.json();
}

export async function createClergy(
  token: string,
  data: CreateClergyData,
): Promise<ApiClergyResponse> {
  const res = await fetch(`${API_BASE}/api/admin/clergy`, {
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
      .catch(() => ({ message: "Failed to create clergy member" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateClergy(
  token: string,
  id: string,
  data: Partial<CreateClergyData>,
): Promise<ApiClergyResponse> {
  const res = await fetch(`${API_BASE}/api/admin/clergy/${id}`, {
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
      .catch(() => ({ message: "Failed to update clergy member" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteClergy(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/clergy/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete clergy member");
}

export async function toggleClergyVisibility(
  token: string,
  id: string,
): Promise<{ isVisible: boolean }> {
  const res = await fetch(`${API_BASE}/api/admin/clergy/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
}

export async function toggleClergyHomepageVisibility(
  token: string,
  id: string,
): Promise<{ showOnHomepage: boolean }> {
  const res = await fetch(
    `${API_BASE}/api/admin/clergy/${id}/homepage-visibility`,
    {
      method: "PATCH",
      headers: authHeaders(token),
    },
  );
  if (!res.ok) throw new Error("Failed to toggle homepage visibility");
  return res.json();
}
