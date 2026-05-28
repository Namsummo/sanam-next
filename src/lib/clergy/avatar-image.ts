import { existsSync } from "node:fs";
import path from "node:path";

export const DEFAULT_CLERGY_AVATAR = "/images/default-cover.jpg";

export const DEFAULT_CLERGY_AVATAR_ALT = "Ảnh chân dung";

function resolvePublicPath(src: string): string {
  const relative = src.startsWith("/") ? src.slice(1) : src;
  return path.join(process.cwd(), "public", relative);
}

export function getClergyAvatarSrc(avatar?: string): string {
  const trimmed = avatar?.trim();
  if (!trimmed) {
    return DEFAULT_CLERGY_AVATAR;
  }

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (!existsSync(resolvePublicPath(normalized))) {
    return DEFAULT_CLERGY_AVATAR;
  }

  return normalized;
}
