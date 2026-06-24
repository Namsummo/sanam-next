"use client";

import { Search, X } from "lucide-react";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { vocationFilterOptions } from "@/lib/vocation/labels";
import type { VocationType } from "@/lib/vocation/types";

const ALL_FILTER_VALUE = "Tất cả";

export type AdminVocationFruitFilterState = {
  searchQuery: string;
  typeFilter: "all" | VocationType;
};

export function hasActiveVocationFruitFilters({
  searchQuery,
  typeFilter,
}: AdminVocationFruitFilterState): boolean {
  return searchQuery.trim() !== "" || typeFilter !== "all";
}

type AdminVocationFruitFiltersProps = AdminVocationFruitFilterState & {
  onSearchQueryChange: (value: string) => void;
  onTypeFilterChange: (value: "all" | VocationType) => void;
  onClear: () => void;
};

export function AdminVocationFruitFilters({
  searchQuery,
  typeFilter,
  onSearchQueryChange,
  onTypeFilterChange,
  onClear,
}: AdminVocationFruitFiltersProps) {
  const showClear = hasActiveVocationFruitFilters({ searchQuery, typeFilter });
  const selectedTypeLabel =
    vocationFilterOptions.find((option) => option.id === typeFilter)?.label ??
    ALL_FILTER_VALUE;

  return (
    <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-card-foreground">Bộ lọc</span>
        {showClear ? (
          <AdminOutlineButton
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <X className="size-4" aria-hidden />
            Xóa bộ lọc
          </AdminOutlineButton>
        ) : null}
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
              placeholder="Tên, dòng tu, nơi phục vụ, giáo họ..."
              className="pl-10"
            />
          </div>
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Nhóm
          </span>
          <Select
            value={selectedTypeLabel}
            onValueChange={(value) => {
              if (!value || value === ALL_FILTER_VALUE) {
                onTypeFilterChange("all");
                return;
              }

              const option = vocationFilterOptions.find((item) => item.label === value);
              if (option && option.id !== "all") {
                onTypeFilterChange(option.id);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={ALL_FILTER_VALUE} />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
              {vocationFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
