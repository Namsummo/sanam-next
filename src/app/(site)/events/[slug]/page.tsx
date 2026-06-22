import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import {
  getPublicEventBySlug,
  getPublicEvents,
  toParishEvent,
} from "@/shared/services/events-api";
import { formatEventDateTime } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";

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

  const body = getEventBody(event);

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
          {event.image ? (
            <figure className="mb-8 overflow-hidden rounded-[20px]">
              <Image
                src={event.image}
                alt={event.name || DEFAULT_COVER_ALT}
                width={1100}
                height={688}
                unoptimized
                priority
                className="aspect-16/10 w-full object-cover"
              />
            </figure>
          ) : null}

          <div className="border-b border-border pb-8">
            <h2 className="mb-6 font-display text-3xl font-bold leading-tight text-primary md:mb-8 md:text-4xl">
              {event.name}
            </h2>

            {body ? (
              event.contentFormat === "html" ? (
                <NewsHtmlContent html={body} className="border-b-0 pb-0" />
              ) : (
                <p className="whitespace-pre-line font-sans text-lg leading-relaxed text-foreground">
                  {body}
                </p>
              )
            ) : null}
          </div>

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

function stripHtmlTags(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Bỏ tiêu đề trùng ở đầu content nếu admin copy-paste tên vào nội dung. */
function getEventBody(event: ParishEvent): string {
  const content = event.content.trim();
  const name = event.name.trim();
  if (!content || !name) {
    return content;
  }

  if (event.contentFormat === "html") {
    const headingMatch = content.match(/^<h([12])[^>]*>([\s\S]*?)<\/h\1>\s*/i);
    if (headingMatch && stripHtmlTags(headingMatch[2]) === name) {
      return content.slice(headingMatch[0].length).trim();
    }

    const paragraphMatch = content.match(/^<p[^>]*>([\s\S]*?)<\/p>\s*/i);
    if (paragraphMatch && stripHtmlTags(paragraphMatch[1]) === name) {
      return content.slice(paragraphMatch[0].length).trim();
    }

    return content;
  }

  if (content === name) {
    return "";
  }

  if (content.startsWith(`${name}\n`)) {
    return content.slice(name.length + 1).trim();
  }

  return content;
}
