import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventsListing } from "@/components/site/events/events-listing";
import { getEventSectionBySlug } from "@/lib/events/categories";

type EventCategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function generateMetadata({
  params,
}: EventCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getEventSectionBySlug(slug);
  if (!section) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: section.label,
    description: `${section.label} của Giáo xứ Sa Nam`,
  };
}

export default async function EventCategoryPage({
  params,
  searchParams,
}: EventCategoryPageProps) {
  const { slug } = await params;
  const section = getEventSectionBySlug(slug);
  if (!section) {
    notFound();
  }

  const query = await searchParams;
  const search = firstSearchParam(query.search)?.trim() || undefined;

  return <EventsListing categorySlug={section.id} search={search} />;
}
