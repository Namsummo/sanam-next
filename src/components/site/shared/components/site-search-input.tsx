"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState, useTransition } from "react";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteSearchInputProps = {
  placeholder?: string;
  className?: string;
};

export function SiteSearchInput({
  placeholder = "Tìm kiếm…",
  className,
}: SiteSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";

  const [value, setValue] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  // Sync value if searchParams changes from outside (e.g. navigation or category reset)
  useEffect(() => {
    setValue(currentSearch);
  }, [currentSearch]);

  function executeSearch(query: string) {
    const trimmed = query.trim();
    if (trimmed === currentSearch.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    // Reset page to 1 when search changes
    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    executeSearch(value);
  }

  function handleClear() {
    setValue("");
    executeSearch("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "group relative flex w-full items-center rounded-full border border-border bg-card/90 p-1 pl-4 shadow-xs backdrop-blur-xs transition-all duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 hover:border-accent/50",
        className,
      )}
    >
      <div className="pointer-events-none text-foreground/45 transition-colors group-focus-within:text-accent">
        <Search className="size-4" aria-hidden />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent px-3 py-1.5 font-sans text-sm text-primary placeholder:text-foreground/45 focus:outline-none md:text-base"
        aria-label={placeholder}
      />

      {value ? (
        <button
          type="button"
          onClick={handleClear}
          title="Xóa tìm kiếm"
          aria-label="Xóa tìm kiếm"
          className="flex size-7 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        >
          <X className="size-3.5" />
        </button>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        title="Tìm kiếm"
        aria-label="Tìm kiếm"
        className="ml-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2 font-sans text-xs font-semibold text-white shadow-xs transition-all hover:bg-accent/90 active:scale-95 disabled:pointer-events-none disabled:opacity-60 md:px-5 md:py-2 md:text-sm"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Search className="size-3.5 md:hidden" />
        )}
        <span className="hidden md:inline">Tìm kiếm</span>
      </button>
    </form>
  );
}

