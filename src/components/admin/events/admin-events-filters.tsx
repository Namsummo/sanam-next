"use client";

import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import {
  EVENT_STATUS_OPTIONS,
  getEventStatusByLabel,
  getEventStatusLabel,
} from "@/components/admin/events/admin-event-form";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import type { EventStatus } from "@/lib/events/types";
import type { ApiEventCategory } from "@/shared/services/events-api";

const ALL_FILTER_VALUE = "Tất cả";

export type AdminEventsFilterState = {
  searchQuery: string;
  statusFilter: "all" | EventStatus;
  categoryFilter: "all" | string;
};

export function hasActiveEventFilters({
  searchQuery,
  statusFilter,
  categoryFilter,
}: AdminEventsFilterState): boolean {
  return (
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all"
  );
}

type AdminEventsFiltersProps = AdminEventsFilterState & {
  categories: ApiEventCategory[];
  onSearchQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | EventStatus) => void;
  onCategoryFilterChange: (value: "all" | string) => void;
  onClear: () => void;
  onDeleteCategory?: (id: string) => void;
};

export function AdminEventsFilters({
  searchQuery,
  statusFilter,
  categoryFilter,
  categories,
  onSearchQueryChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onClear,
  onDeleteCategory,
}: AdminEventsFiltersProps) {
  const categoryLabelById = new Map(
    categories.map((category) => [category._id, category.label]),
  );
  const showClear = hasActiveEventFilters({ searchQuery, statusFilter, categoryFilter });

  const categoryOptions = useMemo(() => {
    const opts = categories.map((cat) => ({
      value: cat._id,
      label: cat.label,
      showDelete: cat.eventCount === 0,
    }));
    return [{ value: "all", label: ALL_FILTER_VALUE }, ...opts];
  }, [categories]);

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

      <div className="grid gap-3 md:grid-cols-3">
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
              placeholder="Tên, địa điểm, slug..."
              className="pl-10"
            />
          </div>
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Trạng thái
          </span>
          <Select
            value={statusFilter === "all" ? ALL_FILTER_VALUE : getEventStatusLabel(statusFilter)}
            onValueChange={(value) => {
              if (!value || value === ALL_FILTER_VALUE) {
                onStatusFilterChange("all");
                return;
              }

              const status = getEventStatusByLabel(value);
              if (status) {
                onStatusFilterChange(status);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={ALL_FILTER_VALUE} />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
              <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
              {EVENT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Danh mục
          </span>
          <AdminSelect
            value={categoryFilter}
            onChange={(value) => {
              onCategoryFilterChange(value || "all");
            }}
            options={categoryOptions}
            placeholder={ALL_FILTER_VALUE}
            searchable={categoryOptions.length > 5}
            onDeleteOption={onDeleteCategory}
          />
        </div>
      </div>
    </section>
  );
}
