const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type UserRole = "admin" | "editor" | "viewer";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getMeApi(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to get user");
  }

  return data;
}
