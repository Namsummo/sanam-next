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
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";

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
          <div className="relative w-full">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />

            <Input
              id="council-member-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên, chức vụ hoặc giáo họ..."
              className="h-12 w-full rounded-xl border-border pl-12 pr-4 text-base shadow-sm transition-allduration-200
      "
            />
          </div>
        </div>

        <div className="md:w-[280px]">
          <span className="mb-2 block font-sans text-sm font-semibold text-primary">
            Khóa
          </span>
          <Select
            value={activeTermId}
            onValueChange={(value) => {
              if (value) {
                setSelectedTermId(value);
              }
            }}
          >
            <SelectTrigger id="council-term-filter" className="h-auto py-3.5 text-base">
              <SelectValue placeholder="Chọn khóa" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false} >
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {formatCouncilTermLabel(term)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section>
        <div className="mb-8 text-center md:mb-10">
          <h3 className="font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
            Ban Hành Giáo
          </h3>
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
                className="min-w-[28vw] shrink-0 sm:min-w-[22vw] md:min-w-0"
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
