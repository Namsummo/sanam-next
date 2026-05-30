"use client";

import { useState } from "react";
import { DonationOptionPanel } from "@/components/site/contact/donation-option-panel";
import type { DonationOption } from "@/lib/contact/site-donations";
import { cn } from "@/lib/utils";

type DonationTabsProps = {
  options: DonationOption[];
  defaultTabId?: DonationOption["id"];
};

export function DonationTabs({
  options,
  defaultTabId = "parish",
}: DonationTabsProps) {
  const [activeTabId, setActiveTabId] = useState<DonationOption["id"]>(
    defaultTabId,
  );

  const activeOption =
    options.find((option) => option.id === activeTabId) ?? options[0];

  if (!activeOption) {
    return null;
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Loại quyên góp"
        className="mx-auto mb-8 flex max-w-[640px] flex-wrap justify-center gap-2 rounded-full bg-secondary p-1.5 shadow-sm md:mb-10"
      >
        {options.map((option) => {
          const isActive = option.id === activeTabId;
          const tabClassName = cn(
            "min-w-[140px] flex-1 rounded-full px-5 py-3 font-display text-sm font-semibold uppercase leading-none tracking-wide transition-all duration-400 md:min-w-[220px] md:px-8 md:py-3.5 md:text-base",
            isActive
              ? "bg-accent text-white shadow-sm"
              : "text-foreground hover:text-primary",
          );

          if (isActive) {
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                id={`donation-tab-${option.id}`}
                aria-selected="true"
                aria-controls={`donation-panel-${option.id}`}
                tabIndex={0}
                onClick={() => setActiveTabId(option.id)}
                className={tabClassName}
              >
                {option.tabLabel}
              </button>
            );
          }

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              id={`donation-tab-${option.id}`}
              aria-selected="false"
              aria-controls={`donation-panel-${option.id}`}
              tabIndex={-1}
              onClick={() => setActiveTabId(option.id)}
              className={tabClassName}
            >
              {option.tabLabel}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`donation-panel-${activeOption.id}`}
        aria-labelledby={`donation-tab-${activeOption.id}`}
      >
        <DonationOptionPanel option={activeOption} fullWidth />
      </div>
    </div>
  );
}
