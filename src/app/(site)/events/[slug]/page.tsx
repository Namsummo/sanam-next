import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getEventCategoryLabel } from "@/lib/events/categories";
import {
  getPublicEventBySlug,
  getPublicEvents,
  toParishEvent,
} from "@/shared/services/events-api";
import { formatEventDateTime } from "@/lib/format";
import { DEFAULT_COVER } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const res = await getPublicEvents({ limit: 100 });
    return res.events
      .filter((event) => !!event.slug)
      .map((event) => ({
        slug: event.slug,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decoded = decodeURIComponent(slug);
    const data = await getPublicEventBySlug(decoded);
    const event = toParishEvent(data);

    return {
      title: event.name,
      description: `${formatEventDateTime(event)} — ${event.location}`,
    };
  } catch {
    return { title: "Không tìm thấy" };
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  let event: ParishEvent;
  let bgSettings = null;

  try {
    const [data, bg] = await Promise.all([
      getPublicEventBySlug(decoded),
      getBackgroundSettings().catch(() => null),
    ]);
    event = toParishEvent(data);
    bgSettings = bg;
  } catch {
    notFound();
  }

  const categoryLabel = getEventCategoryLabel(event.categoryId);

  return (
    <>
      <PageHeader
        title={event.name}
        backgroundImage={event.image || bgSettings?.eventsBg || DEFAULT_COVER}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện", href: "/events" },
          { label: event.name },
        ]}
        meta={
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-lg text-white">
            <li className="flex items-center gap-1.5">
              <Clock className="size-[18px] shrink-0" aria-hidden />
              <span>{formatEventDateTime(event)}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="size-[18px] shrink-0" aria-hidden />
              <span>{event.location}</span>
            </li>
          </ul>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-4 flex flex-wrap items-center gap-2">
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

          {event.contentFormat === "html" ? (
            <NewsHtmlContent html={event.content} />
          ) : (
            <div className="border-b border-border pb-8">
              <p className="whitespace-pre-line font-sans text-lg leading-relaxed text-foreground">
                {event.content}
              </p>
            </div>
          )}

          <div className="mt-10 border-border pt-8">
            <Link
              href="/events"
              className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
            >
              ← Quay lại sự kiện
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
