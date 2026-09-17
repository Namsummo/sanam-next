import Link from "next/link";
import { EventCard } from "@/components/site/events/event-card";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { SiteSearchInput } from "@/components/site/shared/components/site-search-input";
import {
  getEventSectionBySlug,
  getEventSectionHref,
} from "@/lib/events/categories";
import type { ParishEvent } from "@/lib/events/types";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import {
  getEventCategories,
  getPublicEvents,
  toParishEvent,
} from "@/shared/services/events-api";

function eventSortKey(event: { startDate: string; startTime?: string }): string {
  return `${event.startDate}T${event.startTime ?? "00:00"}`;
}

async function fetchEvents(
  categoryId?: string,
  search?: string,
): Promise<ParishEvent[]> {
  try {
    const res = await getPublicEvents({
      limit: 100,
      categoryId,
      search,
    });
    return res.events
      .map(toParishEvent)
      .sort((a, b) => eventSortKey(b).localeCompare(eventSortKey(a)));
  } catch {
    return [];
  }
}

type EventsListingProps = {
  categorySlug?: string;
  search?: string;
};

export async function EventsListing({
  categorySlug,
  search,
}: EventsListingProps) {
  const section = getEventSectionBySlug(categorySlug);
  const [bgSettings, categories] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getEventCategories().catch(() => []),
  ]);
  const activeCategory = section
    ? categories.find((item) => item.slug === section.id)
    : undefined;
  const events = await fetchEvents(activeCategory?._id, search);
  const title = section?.label ?? "Sự kiện";
  const listingHref = section ? getEventSectionHref(section.id) : "/events";

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện", href: "/events" },
          ...(section ? [{ label: section.label }] : []),
        ]}
        backgroundImage={bgSettings?.eventsBg}
      />
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex justify-center">
            <SiteSearchInput
              placeholder="Tìm kiếm sự kiện theo tên, địa điểm, nội dung…"
              className="max-w-lg"
            />
          </div>

          {events.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-lg text-foreground">
                {search
                  ? `Không tìm thấy sự kiện nào phù hợp với từ khóa “${search}”.`
                  : section
                    ? `Chưa có sự kiện nào trong danh mục “${section.label}”.`
                    : "Hiện chưa có sự kiện nào được đăng."}
              </p>
              {search ? (
                <Link
                  href={listingHref}
                  scroll={false}
                  className="mt-4 inline-block font-sans text-sm font-semibold text-accent hover:underline"
                >
                  Xóa từ khóa tìm kiếm
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-10 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
