"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/site/shared/ui/input/input";

export type AdminOrganizationsFilterState = {
  searchQuery: string;
};

export function hasActiveOrganizationFilters({
  searchQuery,
}: AdminOrganizationsFilterState): boolean {
  return searchQuery.trim() !== "";
}

type AdminOrganizationsFiltersProps = AdminOrganizationsFilterState & {
  onSearchQueryChange: (value: string) => void;
};

export function AdminOrganizationsFilters({
  searchQuery,
  onSearchQueryChange,
}: AdminOrganizationsFiltersProps) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
      <div className="mb-3">
        <span className="text-sm font-medium text-card-foreground">Bộ lọc</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Tìm kiếm
          </span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              value={searchQuery}
              onChange={(changeEvent) => onSearchQueryChange(changeEvent.target.value)}
              placeholder="Tên, slug đoàn thể..."
              className="pl-10"
            />
          </div>
        </label>
      </div>
    </section>
  );
}
