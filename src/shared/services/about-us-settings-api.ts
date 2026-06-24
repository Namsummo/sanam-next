const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export interface AboutUsMissionItemData {
  iconUrl: string;
  iconUploadUrl?: string;
  title: string;
  description: string;
}

export interface AboutUsVisibilityData {
  mainImage: boolean;
  video: boolean;
  subtitle: boolean;
  title: boolean;
  description: boolean;
  missionItems: boolean;
  button: boolean;
  author: boolean;
}

export interface AboutUsSettingsData {
  _id?: string;
  mainImageUrl: string;
  mainImageUploadUrl?: string;
  videoThumbnailUrl: string;
  videoThumbnailUploadUrl?: string;
  videoUrl: string;
  videoTitle: string;
  subtitle: string;
  title: string;
  description: string;
  missionItems: AboutUsMissionItemData[];
  buttonText: string;
  buttonLink: string;
  authorImageUrl: string;
  authorImageUploadUrl?: string;
  authorName: string;
  authorTitle: string;
  visibility: AboutUsVisibilityData;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_ABOUT_US_SETTINGS: AboutUsSettingsData = {
  mainImageUrl: "/images/about-us-image-1.jpg",
  mainImageUploadUrl: "",
  videoThumbnailUrl: "/images/about-us-video-image.jpg",
  videoThumbnailUploadUrl: "",
  videoUrl: "https://www.youtube.com/watch?v=Y-x0efG1seA",
  videoTitle: "Watch Our Video",
  subtitle: "About Us",
  title: "Our Story Faith Mission and Vision Together",
  description:
    "Our story is rooted in a deep commitment to sharing God&apos;s love and guiding people toward a meaningful relationship with Christ.",
  missionItems: [
    {
      iconUrl: "/images/icon-about-us-item-1.svg",
      iconUploadUrl: "",
      title: "Our Mission",
      description: "Our mission is to share God&apos;s love, guide people in faith.",
    },
    {
      iconUrl: "/images/icon-about-us-item-2.svg",
      iconUploadUrl: "",
      title: "Our Vision",
      description: "Our mission is to share God&apos;s love, guide people in faith.",
    },
  ],
  buttonText: "Learn More About",
  buttonLink: "/introduce",
  authorImageUrl: "/images/author-1.jpg",
  authorImageUploadUrl: "",
  authorName: "Cody Fisher",
  authorTitle: "CEO & Lead Pastor",
  visibility: {
    mainImage: true,
    video: true,
    subtitle: true,
    title: true,
    description: true,
    missionItems: true,
    button: true,
    author: true,
  },
};

export async function getAboutUsSettings(): Promise<AboutUsSettingsData> {
  const res = await fetch(`${API_BASE}/api/about-us-settings`);
  if (!res.ok) throw new Error("Failed to fetch about-us settings");
  return res.json();
}

export async function updateAboutUsSettings(
  token: string,
  data: Partial<AboutUsSettingsData>,
): Promise<AboutUsSettingsData> {
  const res = await fetch(`${API_BASE}/api/about-us-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Failed to update about-us settings" }));
    throw new Error(err.message);
  }
  return res.json();
}
