"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Plus, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  showDelete?: boolean;
};

type AdminSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  footer?: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  onDeleteOption?: (value: string) => void;
};

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className,
  searchable = false,
  footer,
  onAdd,
  addLabel,
  onDeleteOption,
}: AdminSelectProps) {
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!searchable || !searchText.trim()) {
      return options;
    }

    const query = searchText.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, searchable, searchText]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearchText("");
      return;
    }

    if (searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }

  return (
    <div className={cn("flex min-w-0 flex-1 gap-2", className)}>
      <div className="min-w-0 flex-1">
      <Select
        value={value || null}
        onValueChange={(nextValue) => {
          if (nextValue != null) {
            onChange(nextValue);
          }
        }}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          className={cn(
            "rounded-[12px] py-3 transition-all duration-200",
            "data-popup-open:border-accent data-popup-open:ring-1 data-popup-open:ring-accent/20",
            !value && "text-muted-foreground",
          )}
        >
          <SelectValue placeholder={placeholder}>
            {(currentValue: string | null) => {
              if (!currentValue) {
                return placeholder;
              }

              return (
                options.find((option) => option.value === currentValue)?.label ??
                placeholder
              );
            }}
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          side="bottom"
          align="start"
          sideOffset={6}
          alignItemWithTrigger={false}
          className={cn(searchable || footer ? "p-0" : undefined)}
        >
          {searchable ? (
            <div
              className="relative top-0 z-10 border-b border-border bg-card"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm danh mục"
                className="relative w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Không tìm thấy
            </div>
          ) : (
            filtered.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="truncate">{option.label}</span>
                  {option.showDelete && onDeleteOption ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteOption(option.value);
                      }}
                      className="inline-flex size-5 items-center justify-center rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      <X className="size-3" />
                    </button>
                  ) : null}
                </div>
              </SelectItem>
            ))
          )}

          {footer ? <div className="border-t border-border">{footer}</div> : null}
        </SelectContent>
      </Select>
      </div>

      {onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          title={addLabel || "Thêm"}
          aria-label={addLabel || "Thêm"}
          className="flex shrink-0 items-center gap-1.5 rounded-[12px] border border-dashed border-border bg-card px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent"
        >
          <Plus className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
