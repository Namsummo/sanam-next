"use client";

import { useMemo } from "react";
import { MassWeekSchedule } from "@/components/site/mass/mass-schedule-panel";
import { getMassScheduleGroups } from "@/lib/mass/mock-mass";
import { cn } from "@/lib/utils";

type MassHomeSectionProps = {
  className?: string;
};

export function MassHomeSection({ className }: MassHomeSectionProps) {
  const groups = useMemo(() => getMassScheduleGroups(), []);

  if (groups.every((group) => group.entries.length === 0)) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full bg-muted/30 px-6 py-16 md:px-10 md:py-[120px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[900px]">
        <div className="mb-10 text-center md:mb-12">
          <span
            className={cn(
              "relative mb-[15px] inline-block rounded-full py-2 pl-8 pr-4",
              "font-sans text-sm font-medium uppercase leading-none text-foreground",
              "bg-muted",
              "before:absolute before:left-4 before:top-1/2 before:size-1.5",
              "before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
            )}
          >
            Phụng vụ
          </span>
          <h2 className="font-display text-3xl font-semibold uppercase leading-tight text-primary md:text-4xl lg:text-5xl">
            Lịch Thánh Lễ
          </h2>
          <p className="mt-4 font-sans text-base text-foreground/80 md:text-lg">
            Lịch lễ trong tuần tại Giáo xứ Sa Nam.
          </p>
        </div>

        <MassWeekSchedule groups={groups} />
      </div>
    </section>
  );
}
