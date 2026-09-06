import type { LiturgyModuleKind } from "@/lib/liturgy/types";

export type LiturgyAdminTab = {
  id: string;
  name: string;
  description?: string;
  moduleKind: LiturgyModuleKind;
};

export const LITURGY_ADMIN_TABS: LiturgyAdminTab[] = [
  {
    id: "cat-seasons",
    name: "Mùa phụng vụ",
    description: "Vọng, Giáng Sinh, Chay…",
    moduleKind: "seasons",
  },
  {
    id: "cat-feasts",
    name: "Ngày lễ theo mùa",
    description: "Ngày lễ và cấp độ trong mùa",
    moduleKind: "feasts",
  },
  {
    id: "cat-gospels",
    name: "Lời Chúa",
    description: "Bài đọc hàng ngày",
    moduleKind: "gospels",
  },
  {
    id: "cat-reflections",
    name: "Suy niệm",
    description: "Bài suy niệm theo ngày",
    moduleKind: "reflections",
  },
];

const LEGACY_TAB_MAP: Record<string, string> = {
  seasons: "cat-seasons",
  feasts: "cat-feasts",
  ranks: "cat-feasts",
  gospels: "cat-gospels",
  reflections: "cat-reflections",
};

export function resolveLiturgyTabId(value: string | null): string {
  const fallback = LITURGY_ADMIN_TABS[0]?.id ?? "cat-seasons";
  if (!value) return fallback;
  if (LITURGY_ADMIN_TABS.some((tab) => tab.id === value)) return value;
  const legacy = LEGACY_TAB_MAP[value];
  if (legacy && LITURGY_ADMIN_TABS.some((tab) => tab.id === legacy)) return legacy;
  return fallback;
}

export function getLiturgyAdminTab(id: string): LiturgyAdminTab {
  return (
    LITURGY_ADMIN_TABS.find((tab) => tab.id === id) ??
    LITURGY_ADMIN_TABS[0] ?? {
      id: "cat-seasons",
      name: "Mùa phụng vụ",
      moduleKind: "seasons",
    }
  );
}
