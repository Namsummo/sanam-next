const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface ApiMassEntry {
  _id: string;
  dayType: "weekday" | "saturday" | "sunday";
  time: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MassScheduleGrouped {
  weekday: ApiMassEntry[];
  saturday: ApiMassEntry[];
  sunday: ApiMassEntry[];
}

export async function getPublicMassSchedule(): Promise<MassScheduleGrouped> {
  const res = await fetch(`${API_BASE}/api/mass-schedule`);
  if (!res.ok) throw new Error("Failed to fetch mass schedule");
  return res.json();
}

export async function getAdminMassSchedule(
  token: string,
): Promise<MassScheduleGrouped> {
  const res = await fetch(`${API_BASE}/api/admin/mass-schedule`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch mass schedule");
  return res.json();
}

export async function createMassEntry(
  token: string,
  data: {
    dayType: "weekday" | "saturday" | "sunday";
    time: string;
    title?: string;
  },
): Promise<ApiMassEntry> {
  const res = await fetch(`${API_BASE}/api/admin/mass-schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({
      message: "Failed to create mass entry",
    }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function updateMassEntry(
  token: string,
  id: string,
  data: Partial<{
    dayType: "weekday" | "saturday" | "sunday";
    time: string;
    title: string;
    sortOrder: number;
    isActive: boolean;
  }>,
): Promise<ApiMassEntry> {
  const res = await fetch(`${API_BASE}/api/admin/mass-schedule/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({
      message: "Failed to update mass entry",
    }));
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteMassEntry(
  token: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/mass-schedule/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete mass entry");
}
