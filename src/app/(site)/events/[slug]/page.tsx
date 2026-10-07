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
import {
  getEventCategoryLabel,
  getEventSectionBySlug,
  getEventSectionHref,
} from "@/lib/events/categories";
import { DEFAULT_COVER_ALT } from "@/lib/image-constants";
import type { ParishEvent } from "@/lib/events/types";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";
import { resolveApiUrl } from "@/lib/utils";

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

    const description = `${formatEventDateTime(event)} — ${event.location}`;
    // Page-level openGraph replaces the root one, so the fallback image is repeated here.
    const image = event.image ? resolveApiUrl(event.image) : "/images/default-cover.jpg";

    return {
      title: event.name,
      description,
      openGraph: {
        type: "article",
        locale: "vi_VN",
        siteName: "Giáo xứ Sa Nam",
        url: `/events/${event.slug ?? decoded}`,
        title: event.name,
        description,
        images: [{ url: image, alt: event.name }],
      },
      twitter: {
        card: "summary_large_image",
        title: event.name,
        description,
        images: [image],
      },
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
  const categoryLabel = getEventCategoryLabel(event.categorySlug) ?? event.categoryLabel;
  const categoryHref = getEventSectionBySlug(event.categorySlug)
    ? getEventSectionHref(event.categorySlug!)
    : "/events";

  return (
    <>
      <PageHeader
        title={event.name}
        backgroundImage={bgSettings?.eventsBg}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Sự kiện", href: "/events" },
          ...(categoryLabel
            ? [{ label: categoryLabel, href: categoryHref }]
            : []),
          { label: "Chi tiết" },
        ]}
        meta={
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-lg text-white">
            <li className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              <span>{formatEventDateTime(event)}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span>{event.location}</span>
            </li>
          </ul>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1100px]">
          {event.image ? (
            <figure className="mb-8 overflow-hidden rounded-2xl bg-muted/30">
              <Image
                src={event.image}
                alt={event.name || DEFAULT_COVER_ALT}
                width={1100}
                height={619}
                unoptimized
                priority
                className="h-auto w-full object-contain"
              />
            </figure>
          ) : null}

          <div className="border-b border-border pb-8">
            <h2 className="mb-6 font-display text-3xl font-bold leading-tight text-primary md:mb-8 md:text-4xl">
              {event.name}
            </h2>

            {categoryLabel ? (
              <div className="mb-8">
                <span className="rounded-[10px] bg-accent px-3 py-1.5 font-sans text-sm font-medium text-white">
                  {categoryLabel}
                </span>
              </div>
            ) : null}

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
              href={categoryHref}
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

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/** Bỏ tiêu đề trùng ở đầu content nếu admin copy-paste tên vào nội dung. */
function getEventBody(event: ParishEvent): string {
  const content = event.content.trim();
  const name = event.name.trim();
  if (!content || !name) {
    return content;
  }

  const treatAsHtml = event.contentFormat === "html"

  if (treatAsHtml) {
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
