import { EventCard } from "@/components/site/events/event-card";
import { Button } from "@/components/site/shared/ui/button/button";
import { ScrollReveal, TextAnime } from "@/components/site/shared/components/animation";
import { getPublicEvents, toParishEvent } from "@/shared/services/events-api";
import type { ParishEvent } from "@/lib/events/types";


function parseDateOnly(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getEventStartDateTime(event: ParishEvent): Date {
  const date = parseDateOnly(event.startDate);
  if (event.startTime) {
    const [hours, minutes] = event.startTime.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

const HOME_EVENT_COUNT = 4;

function isUpcomingEvent(event: ParishEvent, today: Date): boolean {
  const endDate = event.endDate ?? event.startDate;
  return parseDateOnly(endDate).getTime() >= today.getTime();
}

function sortFeaturedEvents(events: ParishEvent[]): ParishEvent[] {
  return [...events].sort((a, b) => {
    const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime();
  });
}

export async function EventsHomeSection() {
  const [featuredRes, publicRes] = await Promise.all([
    getPublicEvents({ featured: true, limit: 20 }),
    getPublicEvents({ limit: 50 }),
  ]);

  const featuredById = new Map<string, ParishEvent>();
  for (const event of [...featuredRes.events, ...publicRes.events].map(toParishEvent)) {
    if (event.isFeatured) featuredById.set(event.id, event);
  }
  const featured = sortFeaturedEvents([...featuredById.values()]);
  const featuredIds = new Set(featured.map((event) => event.id));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFill = publicRes.events
    .map(toParishEvent)
    .filter((event) => !featuredIds.has(event.id) && isUpcomingEvent(event, today))
    .sort(
      (a, b) => getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime(),
    );

  const displayEvents = [...featured, ...upcomingFill].slice(0, HOME_EVENT_COUNT);

  if (displayEvents.length === 0) {
    return null;
  }

  return (
    <section className="">
      <div className="section-row">
        <div className="section-title section-title-center">
          <ScrollReveal>
            <span className="section-sub-title">Sự kiện</span>
          </ScrollReveal>
          <h2 className="text-anime-style-3">
            <TextAnime>Sự kiện giáo xứ</TextAnime>
          </h2>
          <ScrollReveal delay={0.2}>
            <p>
              Cập nhật các sự kiện nổi bật và chương trình sắp diễn ra tại Giáo xứ Sa Nam.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal delay={0.3}>
        <div className="grid grid-cols-1 items-stretch gap-6 px-4 md:grid-cols-2 md:gap-3 md:px-12 xl:grid-cols-4">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </ScrollReveal>

      <div className="section-footer-text mt-12 flex justify-center md:mt-14">
        <Button variant="primary" href="/events">
          Xem tất cả sự kiện
        </Button>
      </div>
    </section>
  );
}
