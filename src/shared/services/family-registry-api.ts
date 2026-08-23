import type { Family, FamilyMember, Person } from "@/lib/family-registry/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface PublicRegistryDataResponse {
  families: Family[];
  members: FamilyMember[];
  persons: Person[];
}

// ─── PUBLIC API ────────────────────────────────────────────────────────────

export async function getPublicFamilyRegistryData(): Promise<PublicRegistryDataResponse> {
  const res = await fetch(`${API_BASE}/api/family-registry/public-data`);
  if (!res.ok) throw new Error("Failed to fetch public family registry data");
  return res.json();
}

// ─── ADMIN PERSONS API ──────────────────────────────────────────────────────

export async function getAllPersons(token: string): Promise<Person[]> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/persons`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch persons");
  return res.json();
}

export async function createPerson(token: string, data: Omit<Person, "id" | "createdAt" | "updatedAt">): Promise<Person> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/persons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create person" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updatePerson(
  token: string,
  id: string,
  data: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>,
): Promise<Person> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/persons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update person" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deletePerson(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/persons/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete person");
}

// ─── ADMIN FAMILIES API ─────────────────────────────────────────────────────

export async function getAllFamilies(token: string): Promise<Family[]> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/families`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch families");
  return res.json();
}

export interface CreateFamilyPayload {
  name: string;
  headPersonId: string;
  status: string;
  statusNote?: string | null;
  notes?: string | null;
  members: Array<{
    personId: string;
    role: string;
    birthOrder: number | null;
    existingId?: string;
  }>;
}

export interface FamilyCreateUpdateResponse {
  family: Family;
  members: FamilyMember[];
}

export async function createFamily(token: string, data: CreateFamilyPayload): Promise<FamilyCreateUpdateResponse> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/families`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create family" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateFamily(
  token: string,
  id: string,
  data: Partial<CreateFamilyPayload>,
): Promise<FamilyCreateUpdateResponse> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/families/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update family" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteFamily(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/families/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete family");
}

export async function getAllMembers(token: string): Promise<FamilyMember[]> {
  const res = await fetch(`${API_BASE}/api/admin/family-registry/members`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch family members");
  return res.json();
}
