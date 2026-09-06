import type {
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgyGospel,
  LiturgyReflection,
  LiturgySeason,
} from "@/lib/liturgy/types";

export const STATUS_LABELS: Record<"draft" | "published", string> = {
  draft: "Nháp",
  published: "Đã xuất bản",
};

export function getCurrentSeason(
  seasons: LiturgySeason[],
): LiturgySeason | null {
  return seasons.find((season) => season.isCurrentSeason) ?? null;
}

export function getFeastRankLabel(
  feast: Pick<LiturgyFeast, "rankId" | "rankLabel">,
  ranks: LiturgyFeastRank[] = [],
): string {
  if (feast.rankLabel?.trim()) return feast.rankLabel;
  const found = ranks.find(
    (rank) => rank.id === feast.rankId || rank.slug === feast.rankId,
  );
  return found?.label ?? (feast.rankId || "—");
}

export function createEmptyGospel(): LiturgyGospel {
  return {
    id: "",
    date: "",
    today: false,
    liturgicalDayName: "",
    theme: "",
    coverImage: undefined,
    firstReadingTitle: "",
    firstReadingContent: "",
    secondReadingTitle: undefined,
    secondReadingContent: undefined,
    gospelTitle: "",
    gospelContent: "",
    prayerContent: undefined,
    status: "draft",
  };
}

export function createEmptyReflection(): LiturgyReflection {
  return {
    id: "",
    date: "",
    title: "",
    coverImage: undefined,
    content: "",
    author: "",
    keyPoint: "",
    status: "draft",
  };
}

export function gospelToFormState(gospel: LiturgyGospel) {
  return {
    date: gospel.date,
    today: Boolean(gospel.today),
    liturgicalDayName: gospel.liturgicalDayName ?? "",
    theme: gospel.theme ?? "",
    coverImage: gospel.coverImage ?? null,
    firstReadingTitle: gospel.firstReadingTitle,
    firstReadingContent: gospel.firstReadingContent,
    secondReadingTitle: gospel.secondReadingTitle ?? "",
    secondReadingContent: gospel.secondReadingContent ?? "",
    gospelTitle: gospel.gospelTitle,
    gospelContent: gospel.gospelContent,
    prayerContent: gospel.prayerContent ?? "",
    status: gospel.status,
  };
}

export function reflectionToFormState(reflection: LiturgyReflection) {
  return {
    date: reflection.date,
    title: reflection.title,
    coverImage: reflection.coverImage ?? null,
    content: reflection.content,
    author: reflection.author ?? "",
    keyPoint: reflection.keyPoint ?? "",
    status: reflection.status,
  };
}
