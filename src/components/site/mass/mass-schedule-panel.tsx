"use client";

import type { MassEntry, MassScheduleGroup } from "@/lib/mass/mock-mass";
import { isTodayGroup } from "@/lib/mass/mock-mass";
import { cn } from "@/lib/utils";

type MassWeekScheduleProps = {
  groups: MassScheduleGroup[];
  className?: string;
};

type MassDayCardProps = {
  group: MassScheduleGroup;
  isToday: boolean;
};

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getUpcomingTime(entries: MassEntry[], now = new Date()): string | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const sorted = [...entries].sort(
    (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time),
  );

  for (const entry of sorted) {
    const entryMinutes = parseTimeToMinutes(entry.time);
    const diff = entryMinutes - nowMinutes;
    if (diff > 0 && diff <= 90) {
      return entry.time;
    }
  }

  return null;
}

function formatEntry(entry: MassEntry): string {
  return entry.title ? `${entry.time}(${entry.title})` : entry.time;
}

function MassDayCard({ group, isToday }: MassDayCardProps) {
  const upcomingTime = isToday ? getUpcomingTime(group.entries) : null;

  return (
    <section
      className={cn(
        "rounded-[20px] border px-4 py-4 transition-colors md:px-5 md:py-5",
        isToday
          ? "border-accent/60 bg-accent/5 shadow-[0_8px_30px_rgba(176,6,31,0.08)]"
          : "border-border/50 bg-card",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-base font-semibold text-primary md:text-lg">
          {group.label}
        </h3>

        {isToday ? (
          <span className="inline-flex rounded-full bg-accent px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-secondary">
            Hôm nay
          </span>
        ) : null}

        {upcomingTime ? (
          <span className="inline-flex rounded-full bg-primary px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-secondary">
            Sắp diễn ra · {upcomingTime}
          </span>
        ) : null}
      </div>

      {group.entries.length > 0 ? (
        <p className="mt-3 font-sans text-sm leading-relaxed text-foreground md:text-base">
          {group.entries.map(formatEntry).join(", ")}
        </p>
      ) : (
        <p className="mt-3 font-sans text-sm text-foreground/70">
          Không có lịch lễ.
        </p>
      )}
    </section>
  );
}

export function MassWeekSchedule({ groups, className }: MassWeekScheduleProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {groups.map((group) => (
        <MassDayCard
          key={group.id}
          group={group}
          isToday={isTodayGroup(group.id)}
        />
      ))}
    </div>
  );
}
