import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EventsListing } from "@/components/site/events/events-listing";
import {
  getEventSectionBySlug,
  getEventSectionHref,
} from "@/lib/events/categories";

export const metadata: Metadata = {
  title: "Sự kiện",
  description: "Lịch sự kiện và hoạt động của Giáo xứ Sa Nam",
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function EventsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const category = firstSearchParam(searchParams.category);
  const search = firstSearchParam(searchParams.search)?.trim() || undefined;
  const section = getEventSectionBySlug(category);

  if (section) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const qs = params.toString();
    redirect(`${getEventSectionHref(section.id)}${qs ? `?${qs}` : ""}`);
  }

  return <EventsListing search={search} />;
}
