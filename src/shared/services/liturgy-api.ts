import {
  MOCK_GOSPELS,
  seedFeasts,
  seedReflections,
  seedSeasons,
} from "@/lib/liturgy/mock-seed";
import type {
  LiturgyGospel,
  LiturgyReflection,
  SeasonWithFeasts,
} from "@/lib/liturgy/types";

/** Lời Chúa đã xuất bản (mới nhất trước). Sau này đổi sang fetch API. */
export async function getPublishedGospels(): Promise<LiturgyGospel[]> {
  return MOCK_GOSPELS.filter((item) => item.status === "published").sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export async function getGospelById(
  id: string,
): Promise<LiturgyGospel | null> {
  return (
    MOCK_GOSPELS.find(
      (item) => item.id === id && item.status === "published",
    ) ?? null
  );
}

/** Suy niệm đã xuất bản (mới nhất trước). */
export async function getPublishedReflections(): Promise<LiturgyReflection[]> {
  return seedReflections()
    .filter((item) => item.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getReflectionById(
  id: string,
): Promise<LiturgyReflection | null> {
  return (
    seedReflections().find(
      (item) => item.id === id && item.status === "published",
    ) ?? null
  );
}

/** Mùa + ngày lễ published, gắn theo seasonId. */
export async function getSeasonsWithFeasts(): Promise<SeasonWithFeasts[]> {
  const seasons = seedSeasons();
  const feasts = seedFeasts().filter((item) => item.status === "published");

  return seasons
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((season) => ({
      ...season,
      feasts: feasts
        .filter((feast) => feast.seasonId === season.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    }));
}
