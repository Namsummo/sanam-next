import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getOrganizationBySlug as getMockOrganizationBySlug,
  getVisibleOrganizations as getMockOrganizations,
} from "./mock-organizations";
import type { Organization } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type AdminOrganizationsResponse = {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Admin APIs
export async function getAdminOrganizations(params?: {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: string;
}): Promise<AdminOrganizationsResponse> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.visibility && params.visibility !== "all") {
    searchParams.set("visibility", params.visibility);
  }

  const query = searchParams.toString();
  const res = await fetch(`${API_BASE}/api/admin/organizations${query ? `?${query}` : ""}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch organizations");
  return res.json();
}

export async function getAdminOrganization(id: string): Promise<Organization> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/organizations/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Organization not found");
  return res.json();
}

export async function createOrganization(data: Partial<Organization>): Promise<Organization> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create organization" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/organizations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update organization" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteOrganization(id: string): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/organizations/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete organization");
}

export async function toggleOrganizationVisibility(id: string): Promise<{ isVisible: boolean }> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/organizations/${id}/visibility`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to toggle visibility");
  return res.json();
}

// Public APIs
export async function getOrganizations(): Promise<Organization[]> {
  try {
    const res = await fetch(`${API_BASE}/api/organizations`);
    if (!res.ok) throw new Error("Failed to fetch organizations");
    return res.json();
  } catch {
    return getMockOrganizations();
  }
}

export async function getOrganizationBySlug(slug: string): Promise<Organization> {
  try {
    const res = await fetch(`${API_BASE}/api/organizations/${slug}`);
    if (!res.ok) throw new Error("Organization not found");
    return res.json();
  } catch {
    const mock = getMockOrganizationBySlug(slug);
    if (mock) return mock;
    throw new Error("Organization not found");
  }
}

// Term Management APIs
export type AdminTerm = {
  _id: string;
  name: string;
  startYear: number;
  endYear: number;
};

export async function getAdminTerms(): Promise<AdminTerm[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/terms`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch terms");
  return res.json();
}

export async function createAdminTerm(startYear: number, endYear: number): Promise<AdminTerm> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/terms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ startYear, endYear }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to create term" }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteAdminTerm(id: string): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}/api/admin/terms/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete term");
}

