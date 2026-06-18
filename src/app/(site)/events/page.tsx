import type { Metadata } from "next";
import { EventCard } from "@/components/site/events/event-card";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getPublicEvents, toParishEvent } from "@/shared/services/events-api";

export const metadata: Metadata = {
  title: "Sự kiện",
  description: "Lịch sự kiện và hoạt động của Giáo xứ Sa Nam",
};

export default async function EventsPage() {
  let events: ReturnType<typeof toParishEvent>[] = [];
  const bgSettings = await getBackgroundSettings().catch(() => null);

  try {
    const res = await getPublicEvents({ limit: 100 });
    events = res.events.map(toParishEvent);
  } catch {
    // API unavailable — render empty state
  }

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
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
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
