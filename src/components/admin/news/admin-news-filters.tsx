"use client";

import { Search, X } from "lucide-react";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import type { NewsCategoryResponse } from "@/shared/services/news-api";

export type NewsVisibilityFilter = "" | "visible" | "hidden";

export type AdminNewsFilterState = {
  searchDraft: string;
  visibility: NewsVisibilityFilter;
  categoryFilter: string;
};

export function hasActiveNewsFilters({
  searchDraft,
  visibility,
  categoryFilter,
}: AdminNewsFilterState): boolean {
  return searchDraft.trim() !== "" || visibility !== "" || categoryFilter !== "";
}

type AdminNewsFiltersProps = AdminNewsFilterState & {
  categories: NewsCategoryResponse[];
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: () => void;
  onVisibilityChange: (value: NewsVisibilityFilter) => void;
  onCategoryFilterChange: (value: string) => void;
  onClear: () => void;
  onDeleteCategory: (id: string) => void;
};

export function AdminNewsFilters({
  searchDraft,
  visibility,
  categoryFilter,
  categories,
  onSearchDraftChange,
  onSearchSubmit,
  onVisibilityChange,
  onCategoryFilterChange,
  onClear,
  onDeleteCategory,
}: AdminNewsFiltersProps) {
  const showClear = hasActiveNewsFilters({
    searchDraft,
    visibility,
    categoryFilter,
  });

  return (
    <section className="mb-6 rounded-[20px] border border-border bg-card p-4 md:p-5">
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

      <div className="flex flex-wrap items-end gap-3">
        <form
          className="min-w-55 flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
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
                value={searchDraft}
                onChange={(event) => onSearchDraftChange(event.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-10"
              />
            </div>
          </label>
        </form>

        <div className="w-44">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Trạng thái
          </span>
          <AdminSelect
            value={visibility}
            onChange={(value) => onVisibilityChange(value as NewsVisibilityFilter)}
            options={[
              { value: "", label: "Tất cả" },
              { value: "visible", label: "Đang hiển thị" },
              { value: "hidden", label: "Đã ẩn" },
            ]}
            placeholder="Trạng thái"
          />
        </div>

        <div className="w-48">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Danh mục
          </span>
          <AdminSelect
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            options={[
              { value: "", label: "Tất cả danh mục" },
              ...categories.map((category) => ({
                value: category._id,
                label: category.label,
                showDelete: category.articleCount === 0,
              })),
            ]}
            placeholder="Danh mục"
            searchable={categories.length > 5}
            onDeleteOption={onDeleteCategory}
          />
        </div>
      </div>
    </section>
  );
}
