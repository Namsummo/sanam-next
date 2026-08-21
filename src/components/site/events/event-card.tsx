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

const CARD_STYLES = {
  container:
    "flex h-full flex-col overflow-hidden rounded-[20px] border border-border/40 bg-card shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]",

  image:
    "h-auto w-full transition-transform duration-500 hover:scale-105",

  badge:
    "rounded-sm px-2.5 py-1 font-sans text-sm font-medium text-white",

  title:
    "line-clamp-2 text-inherit no-underline transition-colors hover:text-accent",

  meta:
    "font-sans text-sm leading-snug text-foreground/85",

  icon:
    "mt-0.5 size-4 shrink-0 text-accent md:size-3.5",
};

export function EventCard({ event, className }: EventCardProps) {
  const href = `/events/${event.slug ?? event.id}`;
  const imageSrc = resolveApiUrl(event.image) || DEFAULT_COVER;
  const hasBadges = event.isFeatured || Boolean(event.categoryLabel);

  return (
    <article className={cn(CARD_STYLES.container, className)}>
      {/* Image */}
      <Link href={href} className="block overflow-hidden bg-muted">
        <figure>
          <Image
            src={imageSrc}
            alt={event.name || DEFAULT_COVER_ALT}
            width={640}
            height={556}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={CARD_STYLES.image}
          />
        </figure>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 px-5 py-5 md:gap-2.5 md:px-6 md:py-4">
        {/* Badges */}
        <div
          className={cn(
            "flex min-h-7 flex-wrap items-center gap-2",
            !hasBadges && "min-h-0",
          )}
        >
          {event.isFeatured && (
            <span
              className={cn(CARD_STYLES.badge, "bg-primary")}
            >
              Nổi bật
            </span>
          )}

          {event.categoryLabel && (
            <span
              className={cn(CARD_STYLES.badge, "bg-accent")}
            >
              {event.categoryLabel}
            </span>
          )}
        </div>

        {/* Title & Meta */}
        <div className="flex flex-1 flex-col gap-2.5 md:gap-2">
          <h2 className="font-display text-xl leading-snug text-primary md:min-h-10 md:text-lg">
            <Link
              href={href}
              title={event.name}
              className={CARD_STYLES.title}
            >
              {event.name}
            </Link>
          </h2>

          <ul className={cn(CARD_STYLES.meta, "space-y-1.5 md:space-y-1")}>
            <li className="flex items-start gap-2">
              <CalendarClock
                aria-hidden
                className={CARD_STYLES.icon}
              />
              <span>{formatEventDateTime(event)}</span>
            </li>

            <li className="flex items-start gap-2">
              <MapPin
                aria-hidden
                className={CARD_STYLES.icon}
              />
              <span
                className="line-clamp-2"
                title={event.location}
              >
                {event.location}
              </span>
            </li>
          </ul>
        </div>

        {/* Action */}
        <div className="mt-auto border-t border-border pt-4 md:pt-3.5">
          <NewsReadMoreLink href={href} />
        </div>
      </div>
    </article>
  );
}