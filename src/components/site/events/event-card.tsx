import Image from "next/image";
import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { NewsReadMoreLink } from "@/components/site/news/news-read-more-link";
import { getEventCategoryLabel } from "@/lib/events/categories";
import { formatEventDateTime } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: ParishEvent;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  const href = `/events/${event.slug ?? event.id}`;
  const categoryLabel = getEventCategoryLabel(event.categoryId);
  const imageSrc = event.image ?? DEFAULT_COVER;

  return (
    <article
      className={cn(
        "mb-[30px] flex h-[calc(100%-30px)] flex-col",
        className,
      )}
    >
      <div className="mb-5 overflow-hidden rounded-[20px]">
        <Link href={href} className="block">
          <figure className="overflow-hidden rounded-[20px]">
            <Image
              src={imageSrc}
              alt={event.name || DEFAULT_COVER_ALT}
              width={640}
              height={556}
              unoptimized={!!event.image}
              className="aspect-[1/0.87] w-full object-cover transition-transform duration-600 ease-in-out hover:scale-[1.06]"
            />
          </figure>
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-[15px]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {event.isFeatured ? (
            <span className="rounded-[10px] bg-primary px-3 py-1.5 font-sans text-sm font-medium text-white">
              Nổi bật
            </span>
          ) : null}
          {categoryLabel ? (
            <span className="rounded-[10px] bg-accent px-3 py-1.5 font-sans text-sm font-medium text-white">
              {categoryLabel}
            </span>
          ) : null}
        </div>

        <div className="flex-1">
          <h2 className="font-display text-xl leading-[1.4] text-primary">
            <Link
              href={href}
              className="text-inherit transition-colors hover:text-accent"
            >
              {event.name}
            </Link>
          </h2>

          <ul className="mt-3 space-y-2 font-sans text-sm text-foreground md:text-base">
            <li className="flex items-start gap-2">

              <CalendarClock className="mt-1 shrink-0 size-4 text-accent" />
              <span>{formatEventDateTime(event)}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-accent"
                aria-hidden
              />
              <span>{event.location}</span>
            </li>
          </ul>
        </div>

        <div className="mt-5 border-t border-border pt-5">
          <NewsReadMoreLink href={href} />
        </div>
      </div>
    </article>
  );
}
