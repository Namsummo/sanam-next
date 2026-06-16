import type { EventStatus, ParishEvent } from "@/lib/events/types";

export const EVENT_STATUS_OPTIONS: Array<{ value: EventStatus; label: string }> = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã công bố" },
  { value: "postponed", label: "Hoãn" },
];

export const EMPTY_EVENT_CATEGORY_LABEL = "Chọn danh mục";

export type EventFormValues = {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  content: string;
  image: string;
  categoryId: string;
  isFeatured: boolean;
  featuredOrder: string;
  status: EventStatus;
};

export function createEmptyEventFormValues(): EventFormValues {
  return {
    id: "",
    name: "",
    slug: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    content: "",
    image: "",
    categoryId: "",
    isFeatured: false,
    featuredOrder: "",
    status: "draft",
  };
}

export function mapEventToFormValues(event: ParishEvent): EventFormValues {
  return {
    id: event.id,
    name: event.name,
    slug: event.slug ?? "",
    startDate: event.startDate,
    startTime: event.startTime ?? "",
    endDate: event.endDate ?? "",
    endTime: event.endTime ?? "",
    location: event.location,
    content: event.content,
    image: event.image ?? "",
    categoryId: event.categoryId ?? "",
    isFeatured: event.isFeatured,
    featuredOrder: event.featuredOrder ? String(event.featuredOrder) : "",
    status: event.status === "cancelled" ? "draft" : event.status,
  };
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Không đọc được file ảnh."));
    reader.readAsDataURL(file);
  });
}

function normalizeSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createEventId(): string {
  return `event-${crypto.randomUUID().slice(0, 8)}`;
}

export function getEventStatusByLabel(label: string): EventStatus | undefined {
  return EVENT_STATUS_OPTIONS.find((option) => option.label === label)?.value;
}

export function getEventStatusLabel(status: EventStatus): string {
  const known = EVENT_STATUS_OPTIONS.find((option) => option.value === status);
  if (known) {
    return known.label;
  }

  if (status === "cancelled") {
    return "Nháp";
  }

  return status;
}

export function getEventStatusBadgeClassName(status: EventStatus): string {
  if (status === "published") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "draft") {
    return "bg-slate-100 text-slate-700";
  }

  if (status === "postponed") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

function parseFeaturedOrder(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.max(1, Math.floor(parsed));
}

export function buildEventFromForm(
  values: EventFormValues,
  existing?: ParishEvent,
): ParishEvent {
  const generatedSlug = normalizeSlug(values.slug || values.name);
  const featuredOrder = values.isFeatured
    ? parseFeaturedOrder(values.featuredOrder)
    : undefined;

  return {
    id: values.id || createEventId(),
    name: values.name.trim(),
    slug: generatedSlug || undefined,
    startDate: values.startDate,
    startTime: values.startTime.trim() || undefined,
    endDate: values.endDate.trim() || undefined,
    endTime: values.endTime.trim() || undefined,
    location: values.location.trim(),
    content: values.content.trim(),
    contentFormat: existing?.contentFormat ?? "plain",
    image: values.image.trim() || undefined,
    categoryId: values.categoryId || undefined,
    isFeatured: values.isFeatured,
    featuredOrder,
    status: values.status,
    isVisible: true,
  };
}
