"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Plus, Search, User, X } from "lucide-react";
import Image from "next/image";
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
  description?: string;
  image?: string | null;
  showDelete?: boolean;
};

type AdminSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  searchable?: boolean;
  footer?: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  onDeleteOption?: (value: string) => void;
};

function isRichOption(option: SelectOption): boolean {
  return option.image !== undefined || Boolean(option.description);
}

function OptionContent({
  option,
  compact = false,
}: {
  option: SelectOption;
  compact?: boolean;
}) {
  if (!isRichOption(option)) {
    return <span className="truncate">{option.label}</span>;
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-border bg-muted",
          compact ? "size-7" : "size-9",
        )}
      >
        {option.image ? (
          <Image
            src={option.image}
            alt="Image person"
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <User className={compact ? "size-3.5" : "size-4"} aria-hidden />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="truncate text-sm text-card-foreground">{option.label}</div>
        {option.description ? (
          <div className="truncate text-xs text-muted-foreground">
            {option.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className,
  contentClassName,
  searchable = false,
  footer,
  onAdd,
  addLabel,
  onDeleteOption,
}: AdminSelectProps) {
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const hasRichOptions = options.some(isRichOption);

  const filtered = useMemo(() => {
    if (!searchable || !searchText.trim()) {
      return options;
    }

    const query = searchText.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query),
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
    <div className={cn("flex min-w-0 flex-1 flex-wrap items-stretch gap-2", className)}>
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
              "rounded-xl py-3 transition-all duration-200",
              "data-popup-open:border-accent data-popup-open:ring-1 data-popup-open:ring-accent/20",
              !value && "text-muted-foreground",
              hasRichOptions && selectedOption && "h-auto min-h-11 py-1.5 whitespace-normal",
            )}
          >
            <SelectValue placeholder={placeholder}>
              {(currentValue: string | null) => {
                if (!currentValue) {
                  return placeholder;
                }

                const option = options.find((item) => item.value === currentValue);
                if (!option) {
                  return placeholder;
                }

                return <OptionContent option={option} compact />;
              }}
            </SelectValue>
          </SelectTrigger>

          <SelectContent
            side="bottom"
            align="start"
            sideOffset={6}
            alignItemWithTrigger={false}
            className={cn(
              searchable || footer ? "p-0" : undefined,
              contentClassName,
            )}
            header={
              searchable ? (
                <div
                  className="border-b border-border bg-card"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      onKeyDown={(event) => event.stopPropagation()}
                      placeholder="Tìm kiếm..."
                      aria-label="Tìm kiếm danh mục"
                      className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                </div>
              ) : undefined
            }
            footer={
              footer ? <div className="border-t border-border">{footer}</div> : undefined
            }
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy
              </div>
            ) : (
              filtered.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(isRichOption(option) && "py-1.5")}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <OptionContent option={option} />
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
          </SelectContent>
        </Select>
      </div>

      {onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-dashed border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent"
        >
          <Plus className="size-4 shrink-0" aria-hidden />
          <span className="whitespace-nowrap">{addLabel || "Thêm"}</span>
        </button>
      ) : null}
    </div>
  );
}
