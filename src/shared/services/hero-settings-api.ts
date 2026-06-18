const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface HeroButtonData {
  text: string;
  link: string;
}

export interface HeroCounterData {
  value: number;
  label: string;
}

export interface HeroVisibilityData {
  subtitle: boolean;
  title: boolean;
  description: boolean;
  primaryButton: boolean;
  secondaryButton: boolean;
  counters: boolean;
}

export interface HeroSettingsData {
  _id?: string;
  backgroundVideoUrl: string;
  backgroundImageUrl: string;
  subtitle: string;
  title: string;
  description: string;
  primaryButton: HeroButtonData;
  secondaryButton: HeroButtonData;
  counters: HeroCounterData[];
  visibility: HeroVisibilityData;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_HERO_SETTINGS: HeroSettingsData = {
  backgroundVideoUrl:
    "https://demo.awaikenthemes.com/assets/videos/emanu-hero-video.mp4",
  backgroundImageUrl: "",
  subtitle: "Growing Together in Christ",
  title: "Join Our Community of Faith Today",
  description:
    "We are committed to sharing God&apos;s love through relationships, and opportunities to serve others. Whether you are new to faith or seeking a deeper connection, you will find guidance, encouragement.",
  primaryButton: { text: "Join Our Church", link: "/contact" },
  secondaryButton: { text: "Get Started", link: "/contact" },
  counters: [
    { value: 120, label: "Community Events" },
    { value: 50, label: "Volunteers Serving" },
    { value: 15, label: "Years of Ministry" },
  ],
  visibility: {
    subtitle: true,
    title: true,
    description: true,
    primaryButton: true,
    secondaryButton: true,
    counters: true,
  },
};

export async function getHeroSettings(): Promise<HeroSettingsData> {
  const res = await fetch(`${API_BASE}/api/hero-settings`);
  if (!res.ok) throw new Error("Failed to fetch hero settings");
  return res.json();
}

export async function uploadHeroFile(
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

export async function updateHeroSettings(
  token: string,
  data: Partial<HeroSettingsData>,
): Promise<HeroSettingsData> {
  const res = await fetch(`${API_BASE}/api/hero-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update hero settings" }));
    throw new Error(err.message);
  }
  return res.json();
}
