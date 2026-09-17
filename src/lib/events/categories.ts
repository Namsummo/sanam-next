import type { EventCategory } from "@/lib/events/types";

export const EVENT_SECTIONS: EventCategory[] = [
  { id: "thanh-le", label: "Thánh Lễ", sortOrder: 1 },
  { id: "su-kien-khac", label: "Sự kiện khác", sortOrder: 2 },
];

export function getEventSectionHref(slug: string): string {
  return `/events/category/${slug}`;
}

export function getEventSectionBySlug(slug?: string): EventCategory | undefined {
  if (!slug) return undefined;
  return EVENT_SECTIONS.find((section) => section.id === slug);
}

export function isCanonicalEventSectionSlug(slug?: string): boolean {
  return Boolean(getEventSectionBySlug(slug));
}

export function getEventCategoryLabel(slug?: string): string | undefined {
  return getEventSectionBySlug(slug)?.label;
}

export function sortEventCategoriesBySection<T extends { slug: string }>(
  categories: T[],
): T[] {
  const order = new Map(
    EVENT_SECTIONS.map((section, index) => [section.id, index]),
  );
  return [...categories].sort((a, b) => {
    const aOrder = order.get(a.slug) ?? EVENT_SECTIONS.length;
    const bOrder = order.get(b.slug) ?? EVENT_SECTIONS.length;
    return aOrder - bOrder || a.slug.localeCompare(b.slug);
  });
}

export function filterCanonicalEventCategories<T extends { slug: string }>(
  categories: T[],
): T[] {
  return sortEventCategoriesBySection(
    categories.filter((category) => isCanonicalEventSectionSlug(category.slug)),
  );
}
