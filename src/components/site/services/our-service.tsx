import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPublicEvents, toParishEvent } from "@/shared/services/events-api";
import { DEFAULT_COVER } from "@/lib/image-constants";
import { ScrollReveal, TextAnime } from "../shared/components/animation";

function getExcerpt(htmlOrPlain: string, maxLength: number = 90): string {
  if (!htmlOrPlain) return "";
  const clean = htmlOrPlain.replace(/<[^>]*>/g, "");
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + "...";
}

export async function OurService({ className }: { className?: string }) {
  let events: ReturnType<typeof toParishEvent>[] = [];

  try {
    const res = await getPublicEvents({ limit: 50 });
    events = res.events.map(toParishEvent);
  } catch {
    return null;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((event) => {
      const endDate = event.endDate ?? event.startDate;
      const [y, m, d] = endDate.split("-").map(Number);
      return new Date(y, m - 1, d).getTime() >= now.getTime();
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  let displayEvents = upcoming.slice(0, 4);
  if (displayEvents.length === 0) {
    displayEvents = events
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      )
      .slice(0, 4);
  }

  if (displayEvents.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "our-service bg-section px-6 py-16 md:py-[120px]",
        className,
      )}
    >
      <div className="container mx-auto max-w-[1300px]">
        <div className="mb-12 text-center md:mb-16">
          <ScrollReveal>
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
          </ScrollReveal>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none text-primary md:text-4xl lg:text-5xl">
            <TextAnime>Sự kiện giáo xứ</TextAnime>
          </h2>
          <ScrollReveal delay={0.2}>
            <p className="mt-4 font-sans text-base text-foreground/80 md:text-lg">
              Cập nhật các sự kiện nổi bật và chương trình sắp diễn ra tại Giáo xứ Sa Nam.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayEvents.map((event) => {
              const href = `/events/${event.slug ?? event.id}`;
              const imageSrc = event.image ?? DEFAULT_COVER;
              const description = getExcerpt(event.content, 90);

              return (
                <div key={event.id} className="service-item">
                  <div className="service-item-image">
                    <Link href={href} data-cursor-text="Xem">
                      <figure className="image-anime">
                        <img src={imageSrc} alt={event.name} className="w-full h-full object-cover" />
                      </figure>
                    </Link>
                  </div>
                  <div className="service-item-content">
                    <h2>
                      <Link href={href}>{event.name}</Link>
                    </h2>
                    <p>{description}</p>
                  </div>
                  <div className="service-item-btn">
                    <Link href={href} className="readmore-btn">
                      Tìm hiểu thêm
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}


