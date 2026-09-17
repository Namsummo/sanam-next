import type { Person } from "@/lib/family-registry/types";
import type { VocationFruit, VocationType } from "@/lib/vocation/types";
import { getPublicFamilyRegistryData } from "@/shared/services/family-registry-api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ApiVocationFruitResponse {
  _id: string;
  personId: string;
  person?: Person;
  fullName: string;
  vocationType: VocationType;
  religiousOrder?: string | null;
  currentAssignment?: string | null;
  hometown?: string | null;
  patronSaint?: string | null;
  vocationYear?: number | null;
  image?: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

async function getPublicPersonMap(): Promise<Map<string, Person>> {
  try {
    const { persons } = await getPublicFamilyRegistryData();
    return new Map(
      persons.flatMap((person) => {
        const id = person.id || (person as Person & { _id?: string })._id;
        return id ? [[id, person] as const] : [];
      }),
    );
  } catch {
    return new Map();
  }
}

export interface PaginatedVocationFruitsResponse {
  fruits: ApiVocationFruitResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function toVocationFruit(data: ApiVocationFruitResponse): VocationFruit {
  return {
    id: data._id,
    personId: data.personId,
    person: data.person || undefined,
    fullName: data.fullName,
    vocationType: data.vocationType,
    religiousOrder: data.religiousOrder || undefined,
    currentAssignment: data.currentAssignment || undefined,
    hometown: data.hometown || undefined,
    saintName: data.patronSaint || undefined,
    patronSaint: data.patronSaint || undefined,
    vocationYear: data.vocationYear ?? undefined,
    image: data.image || undefined,
  };
}

export interface CreateVocationFruitData {
  personId: string;
  vocationType: VocationType;
  religiousOrder?: string | null;
  currentAssignment?: string | null;
  vocationYear?: number | null;
  isVisible?: boolean;
}

export async function getPublicVocationFruits(params?: {
  type?: VocationType;
}): Promise<{ fruits: ApiVocationFruitResponse[] }> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set("type", params.type);

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/api/vocation-fruits${query ? `?${query}` : ""}`, {
    cache: "no-store", // Ensure server components get fresh data
  });
  if (!res.ok) throw new Error("Failed to fetch vocation fruits");

  const data = (await res.json()) as { fruits: ApiVocationFruitResponse[] };

  // Public vocation fruits do not populate `person` like /api/admin/vocation-fruits.
  const personsById = await getPublicPersonMap();
  return {
    fruits: data.fruits.map((fruit) => ({
      ...fruit,
      person: fruit.person ?? personsById.get(fruit.personId),
    })),
  };
}

export async function getAllVocationFruits(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    type?: VocationType | "all";
    visibility?: "visible" | "hidden";
    search?: string;
  },
): Promise<PaginatedVocationFruitsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.type) searchParams.set("type", params.type);
  if (params?.visibility) searchParams.set("visibility", params.visibility);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  const res = await fetch(
    `${API_BASE}/api/admin/vocation-fruits${query ? `?${query}` : ""}`,
    { headers: authHeaders(token) },
  );
  if (!res.ok) throw new Error("Failed to fetch vocation fruits");
  return res.json();
}

export async function getVocationFruitById(
  token: string,
  id: string,
): Promise<ApiVocationFruitResponse> {
  const res = await fetch(`${API_BASE}/api/admin/vocation-fruits/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Vocation fruit not found");
  return res.json();
}

export async function createVocationFruit(
  token: string,
  data: CreateVocationFruitData,
): Promise<ApiVocationFruitResponse> {
  const res = await fetch(`${API_BASE}/api/admin/vocation-fruits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create vocation fruit" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateVocationFruit(
  token: string,
  id: string,
  data: Partial<CreateVocationFruitData>,
): Promise<ApiVocationFruitResponse> {
  const res = await fetch(`${API_BASE}/api/admin/vocation-fruits/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update vocation fruit" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteVocationFruit(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/vocation-fruits/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete vocation fruit");
}

export async function toggleVocationFruitVisibility(
  token: string,
  id: string,
): Promise<{ isVisible: boolean }> {
  const res = await fetch(`${API_BASE}/api/admin/vocation-fruits/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
}
