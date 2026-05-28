import { existsSync } from "node:fs";
import path from "node:path";
import {
  DEFAULT_NEWS_COVER,
  DEFAULT_NEWS_COVER_ALT,
} from "@/lib/news/cover-image-constants";

export {
  DEFAULT_NEWS_COVER,
  DEFAULT_NEWS_COVER_ALT,
} from "@/lib/news/cover-image-constants";

function resolvePublicPath(src: string): string {
  const relative = src.startsWith("/") ? src.slice(1) : src;
  return path.join(process.cwd(), "public", relative);
}

export function getNewsImageSrc(image?: string): string {
  const trimmed = image?.trim();
  if (!trimmed) {
    return DEFAULT_NEWS_COVER;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (!existsSync(resolvePublicPath(normalized))) {
    return DEFAULT_NEWS_COVER;
  }

  return normalized;
}

export function getNewsImageAlt(imageAlt?: string): string {
  return imageAlt?.trim() || DEFAULT_NEWS_COVER_ALT;
}
