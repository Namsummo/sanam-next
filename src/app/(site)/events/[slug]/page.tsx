import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getEventCategoryLabel } from "@/lib/events/categories";
import {
  getEventById,
  getVisibleEventBySlug,
  getVisibleEvents,
} from "@/lib/events/mock-events";
import { formatEventDateTime } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getVisibleEvents()
    .filter((event) => !!event.slug)
    .map((event) => ({
      slug: event.slug!,
    }));
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const event = getVisibleEventBySlug(decoded);

  if (!event) {
    const byId = getEventById(decoded);
    if (byId?.status === "published" && byId.slug) {
      redirect(`/events/${byId.slug}`);
    }
    return { title: "Không tìm thấy" };
  }

  return {
    title: event.name,
    description: `${formatEventDateTime(event)} — ${event.location}`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const event: ParishEvent | undefined = getVisibleEventBySlug(decoded);

  if (!event) {
    const byId = getEventById(decoded);
    if (byId?.status === "published" && byId.slug) {
      redirect(`/events/${byId.slug}`);
    }
    notFound();
  }

  const categoryLabel = getEventCategoryLabel(event.categoryId);
  const imageSrc = event.image ?? DEFAULT_COVER;

  return (
    <>
      <PageHeader
        title={event.name}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện", href: "/events" },
          { label: "Chi tiết" },
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

          <div className="mb-8 overflow-hidden rounded-[20px]">
            <figure className="block overflow-hidden rounded-[20px]">
              <Image
                src={imageSrc}
                alt={event.name || DEFAULT_COVER_ALT}
                width={1100}
                height={550}
                priority
                className="aspect-1/0.5 w-full object-cover"
              />
            </figure>
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
