"use client";

import { useMemo, useState } from "react";
import { FeastCard } from "@/components/site/liturgy/feast-card";
import {
  getCurrentSeason,
} from "@/lib/liturgy/helpers";
import type { SeasonWithFeasts } from "@/lib/liturgy/types";
import { cn } from "@/lib/utils";

type LiturgySeasonsSectionProps = {
  seasons: SeasonWithFeasts[];
};

function formatShortIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatSeasonDateRange(startDate: string, endDate: string): string {
  return `${formatShortIsoDate(startDate)} - ${formatShortIsoDate(endDate)}`;
}

export function LiturgySeasonsSection({ seasons }: LiturgySeasonsSectionProps) {
  const initialId = useMemo(() => {
    return getCurrentSeason(seasons)?.id ?? seasons[0]?.id ?? "";
  }, [seasons]);

  const [activeId, setActiveId] = useState(initialId);
  const active =
    seasons.find((season) => season.id === activeId) ?? seasons[0] ?? null;

  if (!active) return null;

  return (
    <section>
      <div className="mb-6 md:mb-8">
        <p className="font-sans text-sm font-medium uppercase tracking-wide text-accent text-center md:text-left">
          CÁC MÙA PHỤNG VỤ TRONG NĂM
        </p>
        <div className=" flex flex-col md:flex-row justify-between mt-1 font-display items-center text-center font-semibold text-primary">
          <span className="text-3xl">
            {active.name}
          </span>
          <span className="text-sm md:text-base">
            {formatSeasonDateRange(active.startDate, active.endDate)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {seasons.map((season) => {
          const isActive = activeId === season.id;

          return (
            <button
              key={season.id}
              type="button"
              role="tab"
              id={`season-tab-${season.id}`}
              aria-selected={isActive}
              aria-controls={`season-panel-${season.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(season.id)}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 uppercase text-sm font-semibold transition-colors",
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground/70 hover:border-accent/40 hover:text-primary",
              )}
            >
              {season.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`season-panel-${active.id}`}
        aria-labelledby={`season-tab-${active.id}`}
        className="mt-6 md:mt-8"
      >
        {active.feasts.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.feasts.map((feast) => (
              <li key={feast.id}>
                <FeastCard
                  feast={feast}
                  className="h-full transition-colors group-hover:border-accent/40"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-border bg-card px-5 py-8 text-center font-sans text-sm text-foreground/60">
            Chưa có ngày lễ nổi bật trong mùa này.
          </p>
        )}
      </div>
    </section>
  );
}
