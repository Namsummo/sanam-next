import { getFeastRankLabel } from "@/lib/liturgy/helpers";
import type { LiturgyFeast } from "@/lib/liturgy/types";
import { formatIsoDateToVi } from "@/lib/format";
import { cn } from "@/lib/utils";

type FeastCardProps = {
  feast: LiturgyFeast;
  className?: string;
};

export function FeastCard({ feast, className }: FeastCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-accent">
        {getFeastRankLabel(feast)}
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold text-primary">
        {feast.name}
      </h3>
      <p className="mt-2 font-sans text-sm text-foreground/70">
        {formatIsoDateToVi(feast.date)}
      </p>
    </article>
  );
}
