import type { LiveSettings, Video, VideoCategory } from "./types";
import {
  defaultLiveSettings,
  defaultMockVideos,
  extractYoutubeId,
  getStoredLiveSettings,
  saveStoredLiveSettings,
  saveStoredVideos,
} from "./mock-videos";

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

export type WorshipAdminState = {
  categories: WorshipVideoCategory[];
  videos: WorshipVideoItem[];
  live: LiveSettings;
};

const STORAGE_KEYS = {
  CATEGORIES: "sanam_worship_categories",
  VIDEOS: "sanam_worship_admin_videos",
  LIVE: "sanam_worship_live",
} as const;

export const defaultWorshipCategories: WorshipVideoCategory[] = [
  {
    id: "cat-mass",
    name: "Thánh lễ & Sự kiện",
    slug: "mass-event",
    description: "Các buổi Thánh lễ và sự kiện phụng vụ đã ghi hình.",
    sortOrder: 1,
  },
  {
    id: "cat-hymn",
    name: "Thánh ca tâm tình",
    slug: "hymn",
    description: "Thánh ca, bài hát tâm tình của giáo xứ.",
    sortOrder: 2,
  },
];

function mapMockVideoToAdminItem(video: Video): WorshipVideoItem {
  const categoryId =
    video.category === "hymn" ? "cat-hymn" : "cat-mass";

  return {
    id: video.id,
    categoryId,
    title: video.title,
    sourceType: "youtube",
    youtubeId: video.youtubeId,
    youtubeUrl: video.youtubeUrl,
    thumbnail: video.thumbnail,
    duration: video.duration,
    publishedAt: video.publishedAt,
    description: video.description,
    speaker: video.speaker,
    views: video.views,
  };
}

export const defaultWorshipVideos: WorshipVideoItem[] =
  defaultMockVideos.map(mapMockVideoToAdminItem);

export function createEmptyCategory(): WorshipVideoCategory {
  return {
    id: `cat-${crypto.randomUUID()}`,
    name: "",
    slug: "",
    description: "",
    sortOrder: defaultWorshipCategories.length + 1,
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

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWorshipAdminState(): WorshipAdminState {
  const categories = readJson(STORAGE_KEYS.CATEGORIES, defaultWorshipCategories);
  const videos = readJson(STORAGE_KEYS.VIDEOS, defaultWorshipVideos);
  const live = getStoredLiveSettings();

  return {
    categories: [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    videos,
    live,
  };
}

function mapAdminVideoToLegacy(
  video: WorshipVideoItem,
  categories: WorshipVideoCategory[],
): Video | null {
  if (video.sourceType === "youtube" && video.youtubeId) {
    const category = categories.find((item) => item.id === video.categoryId);
    const legacyCategory: VideoCategory =
      category?.slug === "hymn" ? "hymn" : "mass-event";

    return {
      id: video.id,
      title: video.title,
      youtubeId: video.youtubeId,
      youtubeUrl:
        video.youtubeUrl ||
        `https://www.youtube.com/watch?v=${video.youtubeId}`,
      publishedAt: video.publishedAt,
      duration: video.duration || "00:00",
      thumbnail:
        video.thumbnail ||
        `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
      category: legacyCategory,
      description: video.description,
      views: video.views,
      speaker: video.speaker,
    };
  }

  return null;
}

function syncLegacyVideosForSite(
  videos: WorshipVideoItem[],
  categories: WorshipVideoCategory[],
) {
  const legacyVideos = videos
    .map((video) => mapAdminVideoToLegacy(video, categories))
    .filter((video): video is Video => video !== null);

  if (legacyVideos.length > 0) {
    saveStoredVideos(legacyVideos);
  }
}

export function saveWorshipAdminState(state: WorshipAdminState) {
  writeJson(STORAGE_KEYS.CATEGORIES, state.categories);
  writeJson(STORAGE_KEYS.VIDEOS, state.videos);
  saveStoredLiveSettings(state.live);
  syncLegacyVideosForSite(state.videos, state.categories);
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
  return { ...defaultLiveSettings };
}
