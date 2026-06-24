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

function sortEventsForDisplay(events: ParishEvent[]): ParishEvent[] {
  return [...events].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }

    if (a.isFeatured && b.isFeatured) {
      const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
    }

    return getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime();
  });
}

export async function EventsHomeSection() {
  const res = await getPublicEvents({ limit: 50 });
  const events = res.events.map(toParishEvent);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = events.filter((event) => {
    const endDate = event.endDate ?? event.startDate;
    return parseDateOnly(endDate).getTime() >= now.getTime();
  });

  const displayPool =
    upcoming.length > 0
      ? upcoming
      : [...events].sort(
        (a, b) => getEventStartDateTime(b).getTime() - getEventStartDateTime(a).getTime(),
      );

  const displayEvents = sortEventsForDisplay(displayPool).slice(0, 4);

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
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-4 md:gap-3 px-12">
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
