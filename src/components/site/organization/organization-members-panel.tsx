"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { OrganizationMemberCard } from "./organization-member-card";
import type { ExecutiveTerm, ExecutiveMember } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

type OrganizationMembersPanelProps = {
  terms: ExecutiveTerm[];
  className?: string;
};

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function memberMatchesSearch(member: ExecutiveMember, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearchText(
    [member.fullName, member.position, member.patronSaint, member.parish]
      .filter(Boolean)
      .join(" "),
  );
  return haystack.includes(query);
}

export function OrganizationMembersPanel({
  terms,
  className,
}: OrganizationMembersPanelProps) {
  const currentTerm = terms.find(t => t.isCurrent);
  const defaultTermId = currentTerm ? currentTerm._id || currentTerm.name : (terms[0]?._id || terms[0]?.name);

  const [selectedTermId, setSelectedTermId] = useState<string>(defaultTermId || "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeTerm = terms.find(t => (t._id || t.name) === selectedTermId);
  const normalizedQuery = normalizeSearchText(searchQuery);

  const filteredMembers = useMemo(() => {
    if (!activeTerm) return [];
    return activeTerm.members.filter((m) => memberMatchesSearch(m, normalizedQuery));
  }, [activeTerm, normalizedQuery]);

  if (terms.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-12 md:space-y-16", className)}>
      <div className="flex flex-col gap-4 rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-5 md:flex-row md:items-end md:gap-6 md:p-6">
        <div className="flex-1">
          <label
            htmlFor="org-member-search"
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
              id="org-member-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tên, chức vụ hoặc giáo họ..."
              className="w-full rounded-[12px] border border-border bg-white py-3.5 pl-11 pr-4 font-sans text-base text-primary outline-none transition-colors placeholder:text-foreground/50 focus:border-accent"
            />
          </div>
        </div>

        <div className="md:w-[280px]">
          <label
            htmlFor="org-term-filter"
            className="mb-2 block font-sans text-sm font-semibold text-primary"
          >
            Khóa
          </label>
          <select
            id="org-term-filter"
            value={selectedTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-[12px] border border-border bg-white px-4 py-3.5 font-sans text-base text-primary outline-none transition-colors focus:border-accent"
          >
            {terms.map((term) => (
              <option key={term._id || term.name} value={term._id || term.name}>
                {term.name} {term.isCurrent ? "(Hiện tại)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <div className="mb-8 text-center md:mb-10">
          <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
            Ban Điều Hành
          </h3>
          {activeTerm ? (
            <p className="mt-2 font-sans text-sm text-foreground/80">
              {activeTerm.name}
              {normalizedQuery ? "" : ` · ${filteredMembers.length} thành viên`}
            </p>
          ) : null}
        </div>

        {filteredMembers.length === 0 ? (
          <p className="text-center font-sans text-base text-foreground/80">
            Không có kết quả phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
          <ul className="flex list-none gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-4 lg:grid-cols-5 md:overflow-visible md:pb-0 md:gap-6 lg:gap-8">
            {filteredMembers.map((member, idx) => (
              <li
                key={member._id || idx}
                className="min-w-[50vw] shrink-0 sm:min-w-[35vw] md:min-w-0"
              >
                <OrganizationMemberCard
                  member={member}
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
