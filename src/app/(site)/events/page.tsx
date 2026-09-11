import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/site/events/event-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { SiteSearchInput } from "@/components/site/shared/components/site-search-input";
import {
  getEventCategories,
  getPublicEvents,
  toParishEvent,
} from "@/shared/services/events-api";
import type { ParishEvent } from "@/lib/events/types";

export const metadata: Metadata = {
  title: "Sự kiện",
  description: "Lịch sự kiện và hoạt động của Giáo xứ Sa Nam",
};

function eventSortKey(event: { startDate: string; startTime?: string }): string {
  return `${event.startDate}T${event.startTime ?? "00:00"}`;
}

async function fetchEvents(categoryId?: string, search?: string): Promise<ParishEvent[]> {
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

export default async function EventsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryStr = searchParams.category;
  const category = typeof categoryStr === "string" ? categoryStr : undefined;
  const searchStr = searchParams.search;
  const search = typeof searchStr === "string" ? searchStr.trim() : undefined;

  const [bgSettings, categories] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getEventCategories().catch(() => []),
  ]);

  const activeCategory = categories.find((item) => item.slug === category);
  const events = await fetchEvents(activeCategory?._id, search);

  const buildCategoryHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search) params.set("search", search);
    const qs = params.toString();
    return `/events${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Sự kiện"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện giáo xứ" },
        ]}
        backgroundImage={bgSettings?.eventsBg}
      />
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex justify-center">
            <SiteSearchInput
              placeholder="Tìm kiếm sự kiện theo tên, địa điểm, nội dung…"
              className="max-w-lg"
            />
          </div>

          <nav
            aria-label="Danh mục sự kiện"
            className="mb-10 flex flex-wrap justify-center gap-3 md:mb-12"
          >
            <Link
              href={buildCategoryHref(undefined)}
              scroll={false}
              aria-current={!activeCategory ? "page" : undefined}
              className={
                !activeCategory
                  ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-xs"
                  : "rounded-full border border-border bg-card px-5 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
              }
            >
              Tất cả
            </Link>
            {categories.map((item) => {
              const isActive = item._id === activeCategory?._id;
              return (
                <Link
                  key={item._id}
                  href={buildCategoryHref(item.slug)}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "rounded-full bg-accent px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-xs"
                      : "rounded-full border border-border bg-card px-5 py-2.5 font-sans text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {events.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-lg text-foreground">
                {search
                  ? `Không tìm thấy sự kiện nào phù hợp với từ khóa “${search}”.`
                  : "Hiện chưa có sự kiện nào được đăng."}
              </p>
              {search ? (
                <Link
                  href={category ? `/events?category=${encodeURIComponent(category)}` : "/events"}
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
