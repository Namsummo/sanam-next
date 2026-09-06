import Image from "next/image";
import Link from "next/link";
import { LiturgySeasonsSection } from "@/components/site/liturgy/liturgy-seasons-section";
import type {
  LiturgyGospel,
  LiturgyReflection,
  SeasonWithFeasts,
} from "@/lib/liturgy/types";
import { formatIsoDateToVi, formatWeekdayVi } from "@/lib/format";
import { DEFAULT_COVER, DEFAULT_COVER_ALT } from "@/lib/image-constants";
import { cn, resolveApiUrl } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type LiturgyPageProps = {
  seasons: SeasonWithFeasts[];
  gospels: LiturgyGospel[];
  reflections: LiturgyReflection[];
};

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-6 md:mb-8">
      <p className="font-sans text-sm font-medium uppercase tracking-wide text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function CoverImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const imageSrc = resolveApiUrl(src) || DEFAULT_COVER;
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={imageSrc}
        alt={alt || DEFAULT_COVER_ALT}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}

// Lời chúa hàng ngày
function GospelSection({ gospels }: { gospels: LiturgyGospel[] }) {
  const featured = gospels.find((item) => item.today) ?? gospels[0] ?? null;
  if (!featured) return null;

  const others = gospels.filter((item) => item.id !== featured.id);
  const featuredTitle = featured.liturgicalDayName;

  return (
    <section>
      <SectionTitle eyebrow="Lời Chúa" title="Lời Chúa hàng ngày" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)]">
        <Link
          href={`/worship/loi-chua/${featured.id}`}
          className="group overflow-hidden rounded-[20px] border border-border bg-card transition-colors hover:border-accent/40"
        >
          <CoverImage
            src={featured.coverImage}
            alt={featuredTitle}
            className="aspect-16/12 w-full"
            priority
          />
          <div className="flex flex-col gap-3 p-5 pb-7 md:p-6 md:pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-sans text-sm font-medium uppercase tracking-wide text-accent">
                {formatWeekdayVi(featured.date)}
              </p>
              {featured.today ? (
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-accent">
                  Hôm nay
                </span>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-2xl font-semibold leading-snug text-primary transition-colors group-hover:text-accent md:text-3xl">
                {featured.liturgicalDayName?.trim() || featuredTitle}
              </h3>
              <p className="font-sans text-lg font-semibold italic leading-relaxed text-foreground/70">
                &ldquo;{featured.theme}&rdquo;
              </p>
            </div>

            <p className="flex items-center gap-2 font-sans text-sm text-foreground/60">
              <CalendarIcon className="size-4 shrink-0" aria-hidden />
              <time dateTime={featured.date}>
                {formatIsoDateToVi(featured.date)}
              </time>
            </p>
          </div>
        </Link>

        <ul className="space-y-3">
          {others.map((item) => (
            <li key={item.id}>
              <Link
                href={`/worship/loi-chua/${item.id}`}
                className={cn(
                  "flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 transition-colors hover:border-accent/40",
                  item.today && "border-accent/50",
                )}
              >
                <CoverImage
                  src={item.coverImage}
                  alt={item.liturgicalDayName}
                  className="aspect-square w-20 shrink-0 rounded-xl md:w-24"
                />
                <div className="min-w-0 flex-1 self-center">
                  <p className="font-display text-base font-semibold text-primary md:text-lg">
                    {item.liturgicalDayName}
                  </p>
                  <p className="mt-1 font-sans text-sm text-foreground/65">
                    {formatWeekdayVi(item.date)} - {formatIsoDateToVi(item.date)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Suy niệm Lời Chúa
function ReflectionsSection({
  reflections,
}: {
  reflections: LiturgyReflection[];
}) {
  if (reflections.length === 0) return null;

  return (
    <section>
      <SectionTitle eyebrow="Suy niệm" title="Suy niệm Lời Chúa" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reflections.map((item) => (
          <li key={item.id}>
            <Link
              href={`/worship/suy-niem/${item.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-colors hover:border-accent/40"
            >
              <CoverImage
                src={item.coverImage}
                alt={item.title}
                className="aspect-16/10 w-full"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-xl font-semibold text-primary transition-colors group-hover:text-accent">
                  {item.title}
                </h3>
                {item.keyPoint ? (
                  <p className="font-sans text-sm font-semibold italic leading-relaxed text-foreground/70">
                    “{item.keyPoint}”
                  </p>
                ) : null}
                <span className="mt-auto flex items-center gap-2 pt-2 font-sans text-sm text-foreground/60">
                  <CalendarIcon className="size-4" aria-hidden />{" "}
                  {formatIsoDateToVi(item.date)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LiturgyPage({
  seasons,
  gospels,
  reflections,
}: LiturgyPageProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
      <LiturgySeasonsSection seasons={seasons} />
      <GospelSection gospels={gospels} />
      <ReflectionsSection reflections={reflections} />
    </div>
  );
}
