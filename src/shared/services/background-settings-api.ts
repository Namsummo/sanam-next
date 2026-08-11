export type BackgroundSettingsPayload = {
  introduceBg: string;
  organizationBg: string;
  eventsBg: string;
  newsBg: string;
  worshipBg: string;
  contactBg: string;
  libraryBg: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getBackgroundSettings(): Promise<BackgroundSettingsPayload> {
  try {
    const res = await fetch(`${API_URL}/api/background-settings`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch background settings");
    }
    return await res.json();
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}

export async function updateBackgroundSettings(
  data: Partial<BackgroundSettingsPayload>,
): Promise<BackgroundSettingsPayload> {
  const res = await fetch(`${API_URL}/api/background-settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update background settings");
  }
  return res.json();
}
