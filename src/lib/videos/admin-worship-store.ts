import type { LiveSettings } from "./types";

export type WorshipVideoSource = "youtube" | "upload";

export type WorshipVideoCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
};

export type WorshipVideoItem = {
  id: string;
  categoryId: string;
  title: string;
  sourceType: WorshipVideoSource;
  youtubeId?: string;
  youtubeUrl?: string;
  uploadUrl?: string;
  thumbnail?: string;
  duration?: string;
  publishedAt: string;
  description?: string;
  speaker?: string;
  views?: number;
};

export function createEmptyCategory(): WorshipVideoCategory {
  return {
    id: `cat-${crypto.randomUUID()}`,
    name: "",
    slug: "",
    description: "",
    sortOrder: 1,
  };
}

export function createEmptyVideo(categoryId: string): WorshipVideoItem {
  return {
    id: `vid-${crypto.randomUUID()}`,
    categoryId,
    title: "",
    sourceType: "youtube",
    youtubeUrl: "",
    youtubeId: "",
    publishedAt: new Date().toISOString().split("T")[0],
    duration: "",
    description: "",
    speaker: "",
  };
}

export function slugifyCategoryName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractYoutubeId(urlOrId: string): string {
  const clean = urlOrId.trim();
  if (clean.length === 11) return clean;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = clean.match(regExp);

  return match && match[2].length === 11 ? match[2] : clean;
}

export function parseYoutubeInput(value: string) {
  const youtubeId = extractYoutubeId(value);
  const youtubeUrl = youtubeId
    ? value.includes("http")
      ? value.trim()
      : `https://www.youtube.com/watch?v=${youtubeId}`
    : "";

  return { youtubeId, youtubeUrl };
}

export function getDefaultLiveSettings(): LiveSettings {
  return {
    isLive: false,
    youtubeId: "",
    youtubeUrl: "",
  };
}
