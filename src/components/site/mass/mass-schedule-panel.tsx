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

function MassDayCard({ group, isToday }: MassDayCardProps) {
  const upcomingTime = isToday ? getUpcomingTime(group.entries) : null;

  return (
    <section
      className={cn(
        "rounded-[20px] border px-4 py-4 transition-all duration-300 md:px-5 md:py-5",
        isToday
          ? "border-accent bg-accent/[0.03] ring-1 ring-accent/30 shadow-[0_8px_30px_rgba(176,6,31,0.08)]"
          : "border-border/60 bg-card hover:border-border hover:shadow-sm",
        group.id === "sunday" && "md:col-span-2 lg:col-span-3"
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
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {group.entries.map((entry, idx) => (
            <div
              key={idx}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border transition-all duration-300",
                isToday
                  ? "bg-accent/10 border-accent/20 text-accent font-semibold"
                  : "bg-muted/50 border-border text-foreground hover:bg-muted"
              )}
            >
              <span className="font-mono text-sm">{entry.time}</span>
              {entry.title ? (
                <span className={cn(
                  "text-[10px] uppercase tracking-wide font-bold px-1.5 py-0.5 rounded",
                  isToday ? "bg-accent text-white" : "bg-primary/10 text-primary"
                )}>
                  {entry.title}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3.5 font-sans text-sm text-foreground/50 italic">
          Không có lịch lễ.
        </p>
      )}
    </section>
  );
}

export function MassWeekSchedule({ groups, className }: MassWeekScheduleProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", className)}>
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
