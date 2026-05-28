import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageHeaderBreadcrumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs: PageHeaderBreadcrumb[];
  meta?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  breadcrumbs,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "dark-section relative z-0 mx-[15px] mt-[15px] overflow-hidden rounded-[20px] bg-primary",
        "px-6 pb-20 pt-32 md:pb-[175px] md:pt-[220px] lg:pt-[280px]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(1,1,1,0.35)_100%)]"
        aria-hidden
      />

      <div className="relative z-1 mx-auto max-w-[1300px] text-center">
        <h1 className="mb-2.5 inline-block font-display text-4xl font-semibold uppercase leading-none text-white md:text-5xl lg:text-[65px]">
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
