const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type UserRole = "admin" | "editor" | "viewer";

export interface ApiUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersListResponse {
  users: ApiUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminUsers(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<UsersListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  query.append("_t", String(Date.now()));

  const res = await fetch(`${API_BASE}/api/admin/users?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load users");
  }
  return data;
}

export async function createUser(
  token: string,
  data: Omit<ApiUser, "_id"> & { password?: string },
): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || "Failed to create user");
  }
  return responseData;
}

export async function updateUser(
  token: string,
  id: string,
  data: Partial<ApiUser> & { password?: string },
): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || "Failed to update user");
  }
  return responseData;
}

export async function deleteUser(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete user");
  }
  return data;
}
