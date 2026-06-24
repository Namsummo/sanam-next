const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface OurMissionItem {
  title: string;
  description: string;
}

export interface OurMissionVisibilityData {
  subtitle: boolean;
  title: boolean;
  description: boolean;
  missionItems: boolean;
  button: boolean;
  contactInfo: boolean;
  image1: boolean;
  image2: boolean;
}

export interface OurMissionSettingsData {
  _id?: string;
  subtitle: string;
  title: string;
  description: string;
  missionItems: OurMissionItem[];
  buttonText: string;
  buttonLink: string;
  contactLabel: string;
  contactPhone: string;
  image1Url: string;
  image1UploadUrl?: string;
  image2Url: string;
  image2UploadUrl?: string;
  visibility: OurMissionVisibilityData;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_OUR_MISSION_SETTINGS: OurMissionSettingsData = {
  subtitle: "Our Mission",
  title: "Our Christian Values That Lead Our Ministry",
  description:
    "Our Christian values are the foundation of everything we do as a church. Guided by faith, love, compassion, and integrity, we are committed to serving God.",
  missionItems: [
    {
      title: "Prayer Support",
      description: "Our Prayer Support you in faith during every life.",
    },
    {
      title: "Fellowship Groups",
      description: "Our Prayer Support you in faith during every life.",
    },
  ],
  buttonText: "Donate Now",
  buttonLink: "/contact",
  contactLabel: "Call Us!",
  contactPhone: "(+123) 456 789",
  image1Url: "/images/our-mission-image-1.jpg",
  image1UploadUrl: "",
  image2Url: "/images/our-mission-image-2.png",
  image2UploadUrl: "",
  visibility: {
    subtitle: true,
    title: true,
    description: true,
    missionItems: true,
    button: true,
    contactInfo: true,
    image1: true,
    image2: true,
  },
};

export async function getOurMissionSettings(): Promise<OurMissionSettingsData> {
  const res = await fetch(`${API_BASE}/api/our-mission-settings`);
  if (!res.ok) throw new Error("Failed to fetch our mission settings");
  return res.json();
}

export async function updateOurMissionSettings(
  token: string,
  data: Partial<OurMissionSettingsData>,
): Promise<OurMissionSettingsData> {
  const res = await fetch(`${API_BASE}/api/our-mission-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update our mission settings" }));
    throw new Error(err.message);
  }
  return res.json();
}
