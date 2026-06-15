"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CouncilMemberCard } from "@/components/site/clergy/council-member-card";
import {
  formatCouncilTermLabel,
  getDefaultCouncilTermId,
  getTermsFromCouncilMembers,
} from "@/lib/clergy/council-terms";
import type { ClergyMember } from "@/lib/clergy/types";
import { cn } from "@/lib/utils";

type CouncilMembersPanelProps = {
  members: ClergyMember[];
  onMemberClick?: (member: ClergyMember) => void;
  className?: string;
};

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function memberMatchesSearch(member: ClergyMember, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearchText(
    [member.fullName, member.position, member.patronSaint, member.hometown]
      .filter(Boolean)
      .join(" "),
  );
  return haystack.includes(query);
}

export function CouncilMembersPanel({
  members,
  onMemberClick,
  className,
}: CouncilMembersPanelProps) {
  const terms = useMemo(() => getTermsFromCouncilMembers(members), [members]);
  const defaultTermId = getDefaultCouncilTermId(members);

  const [selectedTermId, setSelectedTermId] = useState(defaultTermId ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeTermId = selectedTermId || defaultTermId || "";
  const normalizedQuery = normalizeSearchText(searchQuery);

  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => m.termId === activeTermId)
      .filter((m) => memberMatchesSearch(m, normalizedQuery));
  }, [members, activeTermId, normalizedQuery]);

  const activeTerm = terms.find((t) => t.id === activeTermId);

  if (terms.length === 0) {
    return (
      <p className="text-center font-sans text-lg text-foreground">
        Chưa có dữ liệu Ban Hành Giáo.
      </p>
    );
  }

  return (
    <div className={cn("space-y-12 md:space-y-16", className)}>
      <div className="flex flex-col gap-4 rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-5 md:flex-row md:items-end md:gap-6 md:p-6">
        <div className="flex-1">
          <label
            htmlFor="council-member-search"
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
              id="council-member-search"
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
            htmlFor="council-term-filter"
            className="mb-2 block font-sans text-sm font-semibold text-primary"
          >
            Khóa (3 năm)
          </label>
          <select
            id="council-term-filter"
            value={activeTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-[12px] border border-border bg-white px-4 py-3.5 font-sans text-base text-primary outline-none transition-colors focus:border-accent"
          >
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {formatCouncilTermLabel(term)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <div className="mb-8 text-center md:mb-10">
          <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
            Ban Hành Giáo
          </h3>
          {activeTerm ? (
            <p className="mt-2 font-sans text-sm text-foreground/80">
              {formatCouncilTermLabel(activeTerm)}
              {normalizedQuery ? "" : ` · ${filteredMembers.length} người`}
            </p>
          ) : null}
        </div>

        {filteredMembers.length === 0 ? (
          <p className="text-center font-sans text-base text-foreground/80">
            Không có kết quả phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
          <ul className="flex list-none gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 md:gap-6 lg:gap-8">
            {filteredMembers.map((member) => (
              <li
                key={member.id}
                className="min-w-[42vw] shrink-0 sm:min-w-[28vw] md:min-w-0"
              >
                <CouncilMemberCard
                  member={member}
                  onClick={onMemberClick ? () => onMemberClick(member) : undefined}
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
