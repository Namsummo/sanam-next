import Link from "next/link";
import { GospelReadings } from "@/components/site/liturgy/gospel-readings";
import type { LiturgyGospel } from "@/lib/liturgy/types";
import { cn } from "@/lib/utils";

type LiturgyDayPanelProps = {
  gospel: LiturgyGospel | null;
  className?: string;
};

export function LiturgyDayPanel({ gospel, className }: LiturgyDayPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <section>
        <GospelReadings gospel={gospel} />
      </section>
      <div className="pt-2">
        <Link
          href="/worship"
          className="font-sans text-sm font-semibold text-accent hover:underline"
        >
          ← Quay lại tuần phụng vụ
        </Link>
      </div>
    </div>
  );
}
