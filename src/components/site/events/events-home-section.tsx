import { EventCard } from "@/components/site/events/event-card";
import { EventWeekList } from "@/components/site/events/event-week-list";
import { Button } from "@/components/site/shared/ui/button/button";
import {
  getEventsThisWeek,
  getFeaturedEvents,
} from "@/lib/events/mock-events";
import { cn } from "@/lib/utils";

type EventsHomeSectionProps = {
  className?: string;
};

export function EventsHomeSection({ className }: EventsHomeSectionProps) {
  const featuredEvents = getFeaturedEvents(2);
  const weekEvents = getEventsThisWeek();
  const weekEventsWithoutFeatured = weekEvents.filter(
    (event) => !featuredEvents.some((featured) => featured.id === event.id),
  );

  if (featuredEvents.length === 0 && weekEvents.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full bg-muted/30 px-6 py-16 md:px-10 md:py-[120px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 text-center md:mb-12">
          <span
            className={cn(
              "relative mb-[15px] inline-block rounded-full py-2 pl-8 pr-4",
              "font-sans text-sm font-medium uppercase leading-none text-foreground",
              "bg-muted",
              "before:absolute before:left-4 before:top-1/2 before:size-1.5",
              "before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
            )}
          >
            Sự kiện
          </span>
          <h2 className="font-display text-3xl font-semibold uppercase leading-tight text-primary md:text-4xl lg:text-5xl">
            Hoạt động Giáo xứ
          </h2>
          <p className="mt-4 font-sans text-base text-foreground/80 md:text-lg">
            Cập nhật các sự kiện nổi bật và chương trình trong tuần tại Giáo xứ
            Sa Nam.
          </p>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="mb-12">
            <h3 className="mb-6 font-display text-xl font-semibold uppercase text-primary md:text-2xl">
              Sự kiện nổi bật
            </h3>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h3 className="mb-6 font-display text-xl font-semibold uppercase text-primary md:text-2xl">
            Sự kiện tuần này
          </h3>
          <EventWeekList
            events={
              weekEventsWithoutFeatured.length > 0
                ? weekEventsWithoutFeatured
                : weekEvents
            }
          />
        </div>

        <div className="mt-12 flex justify-center md:mt-14">
          <Button variant="primary" href="/events">
            Xem tất cả sự kiện
          </Button>
        </div>
      </div>
    </section>
  );
}
