"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { VocationFruitCard } from "@/components/site/vocation/vocation-fruit-card";
import {
  vocationFilterOptions,
  vocationTypeSectionTitles,
  type VocationFilterId,
} from "@/lib/vocation/labels";
import {
  VOCATION_TYPE_BROTHER,
  VOCATION_TYPE_PRIEST,
  VOCATION_TYPE_SISTER,
  type VocationFruit,
  type VocationType,
} from "@/lib/vocation/types";
import { cn } from "@/lib/utils";

type VocationFruitPanelProps = {
  fruits: VocationFruit[];
  className?: string;
};

const sectionOrder: VocationType[] = [
  VOCATION_TYPE_PRIEST,
  VOCATION_TYPE_BROTHER,
  VOCATION_TYPE_SISTER,
];

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function fruitMatchesSearch(fruit: VocationFruit, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearchText(
    [
      fruit.fullName,
      fruit.religiousOrder,
      fruit.currentAssignment,
      fruit.hometown,
      fruit.patronSaint,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return haystack.includes(query);
}

export function VocationFruitPanel({ fruits, className }: VocationFruitPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<VocationFilterId>("all");

  const normalizedQuery = normalizeSearchText(searchQuery);

  const filteredFruits = useMemo(
    () => fruits.filter((fruit) => fruitMatchesSearch(fruit, normalizedQuery)),
    [fruits, normalizedQuery],
  );

  const sections = useMemo(() => {
    const types =
      filter === "all" ? sectionOrder : sectionOrder.filter((type) => type === filter);

    return types
      .map((type) => ({
        type,
        title: vocationTypeSectionTitles[type],
        items: filteredFruits.filter((fruit) => fruit.vocationType === type),
      }))
      .filter((section) => section.items.length > 0);
  }, [filter, filteredFruits]);

  if (fruits.length === 0) {
    return (
      <p className="text-center font-sans text-lg text-foreground">
        Chưa có dữ liệu Hoa trái ơn gọi.
      </p>
    );
  }

  return (
    <div className={cn("space-y-12 md:space-y-16", className)}>
      <div className="flex flex-col gap-4 rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-5 md:flex-row md:items-end md:gap-6 md:p-6">
        <div className="flex-1">
          <label
            htmlFor="vocation-fruit-search"
            className="mb-2 block font-sans text-sm font-semibold text-primary"
          >
            Tìm kiếm
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/50"
              aria-hidden
            />
            <input
              id="vocation-fruit-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tên, dòng tu, nơi phục vụ hoặc giáo họ..."
              className="w-full rounded-[12px] border border-border bg-white py-3.5 pl-11 pr-4 font-sans text-base text-primary outline-none transition-colors placeholder:text-foreground/50 focus:border-accent"
            />
          </div>
        </div>

        <div className="md:w-[220px]">
          <label
            htmlFor="vocation-fruit-filter"
            className="mb-2 block font-sans text-sm font-semibold text-primary"
          >
            Nhóm
          </label>
          <select
            id="vocation-fruit-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as VocationFilterId)}
            className="w-full cursor-pointer appearance-none rounded-[12px] border border-border bg-white px-4 py-3.5 font-sans text-base text-primary outline-none transition-colors focus:border-accent"
          >
            {vocationFilterOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="text-center font-sans text-base text-foreground/80">
          Không có kết quả phù hợp với bộ lọc hiện tại.
        </p>
      ) : (
        sections.map((section) => (
          <section key={section.type}>
            <div className="mb-8 text-center md:mb-10">
              <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
                {section.title}
              </h2>
            </div>

            <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.items.map((fruit) => (
                <li key={fruit.id}>
                  <VocationFruitCard fruit={fruit} className="h-full" />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
