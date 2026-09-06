export type PublishStatus = "draft" | "published";

// Mùa phụng vụ

export type LiturgySeason = {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  isCurrentSeason?: boolean;
};

export type SeasonWithFeasts = LiturgySeason & {
  feasts: LiturgyFeast[];
};

// Cấp độ lễ
export type LiturgyFeastRank = {
  id: string;
  slug: string;
  label: string;
  sortOrder: number;
};

// Ngày lễ
export type LiturgyFeast = {
  id: string;
  date: string;
  name: string;
  rankId: string;
  rankLabel?: string;
  seasonId: string;
  status: PublishStatus;
};

// Lời Chúa
export type LiturgyGospel = {
  id: string;
  date: string;
  today?: boolean;
  liturgicalDayName: string;
  theme: string;
  coverImage?: string;
  firstReadingTitle: string;
  firstReadingContent: string;
  secondReadingTitle?: string;
  secondReadingContent?: string;
  gospelTitle: string;
  gospelContent: string;
  prayerContent?: string;
  seasonId?: string;
  status: PublishStatus;
};

// Suy niệm
export type LiturgyReflection = {
  id: string;
  date: string;
  title: string;
  coverImage?: string;
  content: string;
  author?: string;
  keyPoint?: string;
  status: PublishStatus;
};

// Form mùa phụng vụ
export type SeasonPayload = {
  name: string;
  slug?: string;
  startDate: string;
  endDate: string;
  isCurrentSeason: boolean;
};

// Form ngày lễ
export type FeastPayload = {
  date: string;
  name: string;
  rankId: string;
  seasonId: string;
  status: PublishStatus;
};

// Form cấp lễ
export type FeastRankPayload = {
  label: string;
  slug?: string;
  sortOrder?: number;
};

// Form lời Chúa
export type GospelPayload = {
  date: string;
  today?: boolean;
  liturgicalDayName: string;
  theme: string;
  coverImage?: string | null;
  firstReadingTitle: string;
  firstReadingContent: string;
  secondReadingTitle?: string;
  secondReadingContent?: string;
  gospelTitle: string;
  gospelContent: string;
  prayerContent?: string;
  seasonId?: string | null;
  status: PublishStatus;
};

// Form suy niệm
export type ReflectionPayload = {
  date: string;
  title: string;
  coverImage?: string | null;
  content: string;
  author?: string;
  keyPoint?: string;
  status: PublishStatus;
};

// Tab module trên admin phụng vụ
export type LiturgyModuleKind =
  | "seasons"
  | "feasts"
  | "gospels"
  | "reflections";
