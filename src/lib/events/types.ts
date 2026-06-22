export type EventContentFormat = "plain" | "html";

export type EventStatus = "draft" | "published";

export type ParishEvent = {
  id: string;
  slug?: string;
  name: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
  location: string;
  content: string;
  contentFormat: EventContentFormat;
  image?: string;
  categoryId?: string;
  categoryLabel?: string;
  isFeatured: boolean;
  featuredOrder?: number;
  status: EventStatus;
  isVisible: boolean;
};
