import Link from "next/link";
import Image from "next/image";
import { CalendarClock, MapPin } from "lucide-react";
import { formatEventDateTime } from "@/lib/format";
import type { ParishEvent } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type EventWeekListProps = {
  events: ParishEvent[];
  className?: string;
};

export function EventWeekList({ events, className }: EventWeekListProps) {
  if (events.length === 0) {
    return (
      <p className={cn("font-sans text-base text-foreground/70", className)}>
        Tuần này chưa có sự kiện nào được lên lịch.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {events.map((event) => {
        const href = `/events/${event.slug ?? event.id}`;

        return (
          <li key={event.id}>
            <Link
              href={href}
              className={cn(
                "group flex gap-4 rounded-[20px] border border-border/50 bg-card px-4 py-4",
                "transition-colors hover:border-accent/40 hover:bg-accent/5",
              )}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <CalendarClock className="shrink-0 size-6 text-accent" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold text-primary transition-colors group-hover:text-accent md:text-lg">
                  {event.name}
                </h3>
                <p className="mt-1 font-sans text-sm text-foreground md:text-base">
                  {formatEventDateTime(event)}
                </p>
                <p className="mt-1 flex items-start gap-1.5 font-sans text-sm text-foreground/80">
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span>{event.location}</span>
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
