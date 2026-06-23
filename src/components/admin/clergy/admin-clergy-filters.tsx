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
import { formatCouncilTermLabel } from "@/lib/clergy/council-terms";
import type { OrganizationTerm } from "@/lib/organization/types";

const ALL_FILTER_VALUE = "Tất cả";

export type AdminClergyFilterState = {
  searchQuery: string;
  typeFilter: "all" | "priest" | "council";
  termFilter: "all" | string;
};

export function hasActiveClergyFilters({
  searchQuery,
  typeFilter,
  termFilter,
}: AdminClergyFilterState): boolean {
  return (
    searchQuery.trim() !== "" ||
    typeFilter !== "all" ||
    termFilter !== "all"
  );
}

type AdminClergyFiltersProps = AdminClergyFilterState & {
  councilTerms: OrganizationTerm[];
  onSearchQueryChange: (value: string) => void;
  onTypeFilterChange: (value: "all" | "priest" | "council") => void;
  onTermFilterChange: (value: "all" | string) => void;
  onClear: () => void;
};

export function AdminClergyFilters({
  searchQuery,
  typeFilter,
  termFilter,
  councilTerms,
  onSearchQueryChange,
  onTypeFilterChange,
  onTermFilterChange,
  onClear,
}: AdminClergyFiltersProps) {
  const showClear = hasActiveClergyFilters({ searchQuery, typeFilter, termFilter });

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
              placeholder="Tên, chức vụ, quê quán..."
              className="pl-10"
            />
          </div>
        </label>

        <div className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Phân loại
          </span>
          <Select
            value={typeFilter === "all" ? ALL_FILTER_VALUE : typeFilter === "priest" ? "Linh mục" : "Ban Hành Giáo"}
            onValueChange={(value) => {
              if (!value || value === ALL_FILTER_VALUE) {
                onTypeFilterChange("all");
                return;
              }
              onTypeFilterChange(value === "Linh mục" ? "priest" : "council");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={ALL_FILTER_VALUE} />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
              <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
              <SelectItem value="Linh mục">Linh mục</SelectItem>
              <SelectItem value="Ban Hành Giáo">Ban Hành Giáo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Nhiệm kỳ (Ban Hành Giáo)
          </span>
          <Select
            value={termFilter === "all" ? ALL_FILTER_VALUE : termFilter}
            onValueChange={(value) => {
              if (!value || value === ALL_FILTER_VALUE) {
                onTermFilterChange("all");
                return;
              }
              onTermFilterChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={ALL_FILTER_VALUE}>
                {(currentValue: string | null) => {
                  if (!currentValue || currentValue === ALL_FILTER_VALUE) return ALL_FILTER_VALUE;
                  const term = councilTerms.find((t) => t.id === currentValue);
                  return term ? formatCouncilTermLabel(term) : currentValue;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
              <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
              {councilTerms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {formatCouncilTermLabel(term)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
