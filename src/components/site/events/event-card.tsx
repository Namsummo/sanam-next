import Image from "next/image";
import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { NewsReadMoreLink } from "@/components/site/news/news-read-more-link";
import { formatEventDateTime } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";
import { cn, resolveApiUrl } from "@/lib/utils";

type EventCardProps = {
  event: ParishEvent;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  const href = `/events/${event.slug ?? event.id}`;
  const categoryLabel = event.categoryLabel;
  const imageSrc = resolveApiUrl(event.image) || DEFAULT_COVER;
  const hasBadges = event.isFeatured || Boolean(categoryLabel);

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[20px] border border-border/40 bg-card",
        "shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <Link href={href} className="block overflow-hidden">
        <figure className="overflow-hidden">
          <Image
            src={imageSrc}
            alt={event.name || DEFAULT_COVER_ALT}
            width={640}
            height={556}
            unoptimized={!!event.image}
            className="aspect-4/3 w-full object-cover transition-transform duration-600 ease-in-out hover:scale-[1.06]"
          />
        </figure>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 px-5 py-3.5 md:px-6 md:py-4">
        <div
          className={cn(
            "flex min-h-7 flex-wrap items-center gap-2",
            !hasBadges && "min-h-0",
          )}
        >
          {event.isFeatured ? (
            <span className="rounded-sm bg-primary px-2.5 py-1 font-sans text-xs font-medium text-white md:text-sm">
              Nổi bật
            </span>
          ) : null}
          {categoryLabel ? (
            <span className="rounded-sm bg-accent px-2.5 py-1 font-sans text-xs font-medium text-white md:text-sm">
              {categoryLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h2 className="min-h-10 font-display text-lg leading-snug text-primary">
            <Link
              href={href}
              title={event.name}
              className="line-clamp-2 text-inherit transition-colors hover:text-accent"
            >
              {event.name}
            </Link>
          </h2>

          <ul className="space-y-1 font-sans text-xs leading-snug text-foreground/85 md:text-sm">
            <li className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <span>{formatEventDateTime(event)}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 size-3.5 shrink-0 text-accent"
                aria-hidden
              />
              <span className="line-clamp-2" title={event.location}>
                {event.location}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-auto border-t border-border pt-3.5">
          <NewsReadMoreLink href={href} />
        </div>
      </div>
    </article>
  );
}
