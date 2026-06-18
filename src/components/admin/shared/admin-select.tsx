"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type AdminSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  footer?: React.ReactNode;
  /** If true, shows a "+" add button next to the trigger */
  onAdd?: () => void;
  addLabel?: string;
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
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef("");

  const selected = options.find((o) => o.value === value);

  const [filtered, setFiltered] = useState(options);

  useEffect(() => {
    if (searchable && open) {
      setFiltered(
        options.filter((o) =>
          o.label.toLowerCase().includes(searchRef.current.toLowerCase()),
        ),
      );
    } else {
      setFiltered(options);
    }
  }, [options, open, searchable]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        searchRef.current = "";
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [open, searchable]);

  const handleSelect = useCallback(
    (optValue: string) => {
      onChange(optValue);
      setOpen(false);
      searchRef.current = "";
    },
    [onChange],
  );

  const [searchText, setSearchText] = useState("");

  function handleSearchInput(value: string) {
    searchRef.current = value;
    setSearchText(value);
    setFiltered(
      options.filter((o) =>
        o.label.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      searchRef.current = "";
      setSearchText("");
    }
    if (e.key === "Enter" && open && filtered.length > 0) {
      handleSelect(filtered[0].value);
    }
    if (e.key === " " && !open) {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-[12px] border px-4 py-3 text-sm transition-all duration-200",
            open
              ? "border-accent ring-1 ring-accent/20"
              : "border-border hover:border-accent/40",
            selected
              ? "text-card-foreground"
              : "text-muted-foreground",
            "bg-card",
          )}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            title={addLabel || "Thêm"}
            className="flex shrink-0 items-center gap-1.5 rounded-[12px] border border-dashed border-border bg-card px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent"
          >
            <Plus className="size-4" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div
          className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-[12px] border border-border bg-card shadow-lg shadow-black/5"
          style={{ animation: "selectFadeIn 0.15s ease-out" }}
        >
          {searchable ? (
            <div className="relative border-b border-border">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchText}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          ) : null}

          <div
            role="listbox"
            className="max-h-56 overflow-y-auto overscroll-contain"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors duration-150",
                      isSelected
                        ? "bg-accent/8 text-accent font-medium"
                        : "text-card-foreground hover:bg-muted",
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected ? (
                      <Check className="size-4 shrink-0 text-accent" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {footer ? (
            <div className="border-t border-border">{footer}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
