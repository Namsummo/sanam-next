"use client";

import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  Church,
  type LucideIcon,
} from "lucide-react";
import type { LiturgyAdminTab } from "@/lib/liturgy/admin-tabs";
import type { LiturgyModuleKind } from "@/lib/liturgy/types";
import { cn } from "@/lib/utils";

const MODULE_ICONS: Record<LiturgyModuleKind, LucideIcon> = {
  seasons: CalendarRange,
  feasts: Church,
  gospels: BookOpen,
  reflections: CalendarDays,
};

type AdminLiturgyCategoriesPanelProps = {
  tabs: LiturgyAdminTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
};

export function AdminLiturgyCategoriesPanel({
  tabs,
  activeTabId,
  onSelectTab,
}: AdminLiturgyCategoriesPanelProps) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-card-foreground">
          Danh mục
        </h2>
      </div>

      <ul className="space-y-2">
        {tabs.map((item) => {
          const Icon = MODULE_ICONS[item.moduleKind];
          const isActive = item.id === activeTabId;

          return (
            <li key={item.id}>
              <div
                className={cn(
                  "rounded-xl border transition-colors",
                  isActive
                    ? "border-accent bg-accent/5"
                    : "border-border bg-background",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className="flex w-full items-start gap-3 px-3 py-3 text-left"
                >
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isActive ? "text-accent" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {item.name}
                    </p>
                    {item.description ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
