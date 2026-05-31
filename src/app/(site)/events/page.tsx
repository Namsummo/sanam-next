import type { Metadata } from "next";
import { EventCard } from "@/components/site/events/event-card";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getVisibleEvents } from "@/lib/events/mock-events";

export const metadata: Metadata = {
  title: "Sự kiện",
  description: "Lịch sự kiện và hoạt động của Giáo xứ Sa Nam",
};

export default function EventsPage() {
  const events = getVisibleEvents();

  return (
    <>
      <PageHeader
        title="Sự kiện"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện" },
        ]}
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
