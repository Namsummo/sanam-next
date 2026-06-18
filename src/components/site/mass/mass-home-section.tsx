"use client";

import { useEffect, useMemo, useState } from "react";
import { MassWeekSchedule } from "@/components/site/mass/mass-schedule-panel";
import type { MassScheduleGroup } from "@/lib/mass/mock-mass";
import { getMassScheduleGroups, getIsoDayOfWeek } from "@/lib/mass/mock-mass";
import {
  getPublicMassSchedule,
  type MassScheduleGrouped,
} from "@/shared/services/mass-schedule-api";
import { cn } from "@/lib/utils";

type MassHomeSectionProps = {
  className?: string;
};

function getTodayGroupIdFromApi(
  today: ReturnType<typeof getIsoDayOfWeek>,
): MassScheduleGroup["id"] {
  if (today === 7) return "sunday";
  if (today === 6) return "saturday";
  return "weekday";
}

function buildGroupsFromApi(data: MassScheduleGrouped): MassScheduleGroup[] {
  const groupDefs: { id: MassScheduleGroup["id"]; label: string }[] = [
    { id: "weekday", label: "Ngày thường" },
    { id: "saturday", label: "Thứ Bảy" },
    { id: "sunday", label: "Chủ Nhật" },
  ];

  const groups: MassScheduleGroup[] = groupDefs.map((def) => ({
    ...def,
    entries: data[def.id].map((entry) => ({
      time: entry.time,
      title: entry.title || undefined,
    })),
  }));

  const today = getIsoDayOfWeek(new Date());
  const todayGroupId = getTodayGroupIdFromApi(today);
  const todayGroup = groups.find((g) => g.id === todayGroupId);
  const otherGroups = groups.filter((g) => g.id !== todayGroupId);

  if (!todayGroup) return groups;
  return [todayGroup, ...otherGroups];
}

export function MassHomeSection({ className }: MassHomeSectionProps) {
  const [apiData, setApiData] = useState<MassScheduleGrouped | null>(null);

  useEffect(() => {
    getPublicMassSchedule()
      .then(setApiData)
      .catch(() => setApiData(null));
  }, []);

  const groups = useMemo(() => {
    if (apiData) {
      return buildGroupsFromApi(apiData);
    }
    return getMassScheduleGroups();
  }, [apiData]);

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
