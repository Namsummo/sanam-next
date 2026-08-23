"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/site/shared/ui/input/input";
import { cn } from "@/lib/utils";
import type { Family, FamilyMember, Person } from "@/lib/family-registry/types";
import {
  FAMILY_MEMBER_ROLE_LABELS,
  FAMILY_STATUS_LABELS,
  PERSON_STATUS_LABELS,
} from "@/lib/family-registry/constants";
import {
  formatPersonDisplayName,
  getFamilyStatusBadgeClassName,
  getPersonStatusBadgeClassName,
  resolveFamilyMembers,
  sortFamilyMembers,
} from "@/lib/family-registry/helpers";
import { getPublicFamilyRegistryData } from "@/shared/services/family-registry-api";

type FamilyRegistryPageSectionProps = {
  families?: Family[];
  members?: FamilyMember[];
  persons?: Person[];
};

export function FamilyRegistryPageSection({
  families: initialFamilies,
  members: initialMembers,
  persons: initialPersons,
}: FamilyRegistryPageSectionProps) {
  const [families, setFamilies] = useState<Family[]>(initialFamilies || []);
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers || []);
  const [persons, setPersons] = useState<Person[]>(initialPersons || []);
  const [loading, setLoading] = useState(!initialFamilies);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFamilies && initialMembers && initialPersons) return;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getPublicFamilyRegistryData();
        setFamilies(data.families);
        setMembers(data.members);
        setPersons(data.persons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [initialFamilies, initialMembers, initialPersons]);

  const personMap = useMemo(() => new Map(persons.map((p) => [p.id, p])), [persons]);

  const q = searchQuery.toLowerCase().trim();
  const filteredFamilies = useMemo(() => {
    if (!q) return families;
    return families.filter((family) => {
      const head = personMap.get(family.headPersonId);
      const headName = head ? formatPersonDisplayName(head).toLowerCase() : "";
      return (
        family.name.toLowerCase().includes(q) ||
        family.familyCode.toLowerCase().includes(q) ||
        headName.includes(q)
      );
    });
  }, [families, personMap, q]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[#6b583c] font-medium">Đang tải dữ liệu sổ gia đình...</p>
      </div>
    );
  }


  return (
    <>
      <p className="mx-auto mb-12 max-w-3xl text-center font-sans text-lg leading-relaxed text-foreground md:mb-16">
        Sổ Gia Đình Công Giáo Giáo xứ Sa Nam — danh sách các gia đình đang sinh
        hoạt trong giáo xứ. Bạn có thể tìm kiếm theo tên gia đình, mã hoặc người
        đứng đầu.
      </p>

      <div className="relative mx-auto mb-10 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm gia đình..."
          className="rounded-full border-border/60 bg-[#eae7de]/40 pl-11"
        />
      </div>

      {filteredFamilies.length === 0 ? (
        <p className="text-center text-muted-foreground">Không tìm thấy gia đình nào.</p>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {filteredFamilies.map((family) => {
            const head = personMap.get(family.headPersonId);
            const familyMembers = sortFamilyMembers(
              resolveFamilyMembers(
                members.filter((m) => m.familyId === family.id),
                persons,
              ),
            );
            const isExpanded = expandedId === family.id;

            return (
              <article
                key={family.id}
                className="overflow-hidden rounded-[20px] border border-border/40 bg-[#eae7de]/30"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : family.id)}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-[#eae7de]/50 md:p-6"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                        {family.familyCode}
                      </span>
                      <span className={getFamilyStatusBadgeClassName(family.status)}>
                        {FAMILY_STATUS_LABELS[family.status]}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-primary">
                      {family.name}
                    </h2>
                    <p className="text-sm text-foreground/80">
                      Người đứng đầu:{" "}
                      <span className="font-medium">
                        {head ? formatPersonDisplayName(head) : "—"}
                      </span>
                      <span className="mx-2 text-border">·</span>
                      {familyMembers.length} thành viên
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border/40 px-5 pb-5 md:px-6 md:pb-6">
                    <ul className="divide-y divide-border/30">
                      {familyMembers.map((member) => (
                        <li
                          key={member.id}
                          className="flex flex-wrap items-center justify-between gap-2 py-3"
                        >
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                                member.role === "husband" && "bg-blue-100 text-blue-700",
                                member.role === "wife" && "bg-pink-100 text-pink-700",
                                member.role === "child" && "bg-amber-100 text-amber-700",
                                member.role === "other" && "bg-gray-100 text-gray-700",
                              )}
                            >
                              {FAMILY_MEMBER_ROLE_LABELS[member.role]}
                              {member.birthOrder != null ? ` (${member.birthOrder})` : ""}
                            </span>
                            <span className="font-medium text-foreground">
                              {formatPersonDisplayName(member.person)}
                            </span>
                          </div>
                          <span className={getPersonStatusBadgeClassName(member.person.status)}>
                            {PERSON_STATUS_LABELS[member.person.status]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-14 border-t border-border pt-10 md:mt-16">
        <Link
          href="/introduce"
          className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
        >
          ← Quay lại giới thiệu
        </Link>
      </div>
    </>
  );
}
