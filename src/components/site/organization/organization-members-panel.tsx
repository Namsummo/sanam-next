"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { OrganizationMemberCard } from "@/components/site/organization/organization-member-card";
import {
  formatOrganizationTermLabel,
  getDefaultTermId,
  getTermsFromMembers,
} from "@/lib/organization/terms";
import type { OrganizationMemberDisplay } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

type OrganizationMembersPanelProps = {
  members: OrganizationMemberDisplay[];
  organizationSlug: string;
  className?: string;
};

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function memberMatchesSearch(member: OrganizationMemberDisplay, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearchText(
    [member.saintName, member.realName, member.position].join(" "),
  );
  return haystack.includes(query);
}

export function OrganizationMembersPanel({
  members,
  organizationSlug,
  className,
}: OrganizationMembersPanelProps) {
  const terms = useMemo(() => getTermsFromMembers(members), [members]);
  const defaultTermId = getDefaultTermId(terms);

  const [selectedTermId, setSelectedTermId] = useState(defaultTermId ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeTermId = selectedTermId || defaultTermId || "";
  const normalizedQuery = normalizeSearchText(searchQuery);

  const termMembers = useMemo(
    () => members.filter((m) => m.termId === activeTermId),
    [members, activeTermId],
  );

  const filteredMembers = useMemo(
    () => termMembers.filter((m) => memberMatchesSearch(m, normalizedQuery)),
    [termMembers, normalizedQuery],
  );

  const executives = filteredMembers.filter((m) => m.isExecutive);
  const regularMembers = filteredMembers.filter((m) => !m.isExecutive);
  const activeTerm = terms.find((t) => t.id === activeTermId);

  if (terms.length === 0) {
    return (
      <p className="text-center font-sans text-lg text-foreground">
        Chưa có dữ liệu thành viên cho hội đoàn này.
      </p>
    );
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
              placeholder="Tên thánh, tên thật hoặc vị trí..."
              className="w-full rounded-[12px] border border-border bg-white py-3.5 pl-11 pr-4 font-sans text-base text-primary outline-none transition-colors placeholder:text-foreground/50 focus:border-accent"
            />
          </div>
        </div>

        <div className="md:w-[280px]">
          <label
            htmlFor="org-term-filter"
            className="mb-2 block font-sans text-sm font-semibold text-primary"
          >
            Khóa (3 năm)
          </label>
          <select
            id="org-term-filter"
            value={activeTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-[12px] border border-border bg-white px-4 py-3.5 font-sans text-base text-primary outline-none transition-colors focus:border-accent"
          >
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {formatOrganizationTermLabel(term)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section>
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
            Ban điều hành nhiệm kỳ
          </h2>
          {activeTerm ? (
            <p className="mt-2 font-sans text-sm text-foreground/80">
              {formatOrganizationTermLabel(activeTerm)}
            </p>
          ) : null}
        </div>

        {executives.length === 0 ? (
          <p className="text-center font-sans text-base text-foreground/80">
            Không có ban điều hành phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {executives.map((member) => (
              <OrganizationMemberCard
                key={member.id}
                member={member}
                organizationSlug={organizationSlug}
                size="executive"
                className="sm:max-w-[300px]"
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
            Danh sách thành viên
          </h2>
          <p className="mt-2 font-sans text-sm text-foreground/80">
            {regularMembers.length} thành viên
            {normalizedQuery ? " (đã lọc)" : ""}
          </p>
        </div>

        {regularMembers.length === 0 ? (
          <p className="text-center font-sans text-base text-foreground/80">
            Không có thành viên phù hợp với bộ lọc hiện tại.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 md:gap-6">
            {regularMembers.map((member) => (
              <OrganizationMemberCard
                key={member.id}
                member={member}
                organizationSlug={organizationSlug}
                size="member"
                className="max-w-[240px]"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
