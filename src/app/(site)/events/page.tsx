import type { Metadata } from "next";
import { EventCard } from "@/components/site/events/event-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getPublicEvents, toParishEvent } from "@/shared/services/events-api";

export const metadata: Metadata = {
  title: "Sự kiện",
  description: "Lịch sự kiện và hoạt động của Giáo xứ Sa Nam",
};

function eventSortKey(event: { startDate: string; startTime?: string }): string {
  return `${event.startDate}T${event.startTime ?? "00:00"}`;
}

export default async function EventsPage() {
  const res = await getPublicEvents({ limit: 100 });
  const events = res.events
    .map(toParishEvent)
    .sort((a, b) => eventSortKey(b).localeCompare(eventSortKey(a)));
  const bgSettings = await getBackgroundSettings().catch(() => null);

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
      <section className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          {events.length === 0 ? (
            <p className="text-center font-sans text-lg text-foreground">
              Hiện chưa có sự kiện nào được đăng.
            </p>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 xl:grid-cols-3">
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
