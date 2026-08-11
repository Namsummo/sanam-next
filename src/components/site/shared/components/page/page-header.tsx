import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, resolveApiUrl } from "@/lib/utils";

export type PageHeaderBreadcrumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs: PageHeaderBreadcrumb[];
  meta?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
};

export function PageHeader({
  title,
  breadcrumbs,
  meta,
  backgroundImage,
  className,
}: PageHeaderProps) {
  const resolvedBg = backgroundImage ? resolveApiUrl(backgroundImage) : undefined;

  return (
    <section
      className={cn(
        "page-header dark-section relative z-0 overflow-hidden",
        "mx-[15px] mt-[15px] rounded-[20px]",
        "max-[991px]:mx-0 max-[991px]:mt-0 max-[991px]:rounded-none",
        "px-6 pb-20 pt-[170px] md:pb-[175px] md:pt-[220px] lg:pt-[280px]",
        resolvedBg ? "bg-cover bg-center bg-fixed" : "bg-primary",
        className,
      )}
      style={resolvedBg ? { backgroundImage: `url(${resolvedBg})` } : undefined}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          backgroundImage
            ? "bg-gradient-to-t from-black/70 via-black/40 to-black/30"
            : "bg-[linear-gradient(180deg,transparent_40%,rgba(1,1,1,0.35)_100%)]",
        )}
        aria-hidden
      />

      <div className="relative z-1 mx-auto max-w-[1300px] text-center wow fadeInUp" data-wow-delay="0.1s">
        <h1 className="mb-2.5 inline-block font-display text-4xl font-semibold uppercase leading-[1.2] text-white md:text-5xl lg:text-[65px]">
          {title}
        </h1>

        {meta ? <div className="mt-2.5 text-white">{meta}</div> : null}

        <nav aria-label="Breadcrumb" className="mt-4">
          <ol className="flex flex-wrap items-center justify-center gap-1 font-sans text-base font-semibold capitalize text-white">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={`${item.label}-${index}`} className="flex items-center">
                  {index > 0 ? (
                    <ChevronRight
                      className="mx-1 size-4 shrink-0 opacity-80"
                      aria-hidden
                    />
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-opacity hover:opacity-80"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(isLast && "opacity-90")}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
