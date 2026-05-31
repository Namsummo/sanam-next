import type { EventCategory } from "@/lib/events/types";

export const eventCategories: EventCategory[] = [
  { id: "le-kinh", label: "Lễ kính", sortOrder: 1 },
  { id: "ruoc-kieu", label: "Rước kiệu", sortOrder: 2 },
  { id: "hoi-cho", label: "Hội chợ", sortOrder: 3 },
  { id: "giuong-trai", label: "Giữ chân", sortOrder: 4 },
  { id: "gioi-tre", label: "Giới trẻ", sortOrder: 5 },
  { id: "bac-ai", label: "Bác ái", sortOrder: 6 },
];

export function getEventCategoryLabel(categoryId?: string): string | undefined {
  if (!categoryId) {
    return undefined;
  }

  return eventCategories.find((category) => category.id === categoryId)?.label;
}
