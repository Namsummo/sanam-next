import type { OrganizationMember, OrganizationTerm } from "@/lib/organization/types";

export function formatOrganizationTermLabel(term: OrganizationTerm): string {
  return `Khóa ${term.startYear} – ${term.endYear}`;
}

export function parseTermId(termId: string): OrganizationTerm | null {
  const match = /^(\d{4})-(\d{4})$/.exec(termId);
  if (!match) {
    return null;
  }

  const startYear = Number(match[1]);
  const endYear = Number(match[2]);

  if (!Number.isFinite(startYear) || !Number.isFinite(endYear) || endYear <= startYear) {
    return null;
  }

  return { id: termId, startYear, endYear };
}

/** Mới nhất trước, cũ nhất sau. */
export function compareTermsNewestFirst(
  a: OrganizationTerm,
  b: OrganizationTerm,
): number {
  return b.startYear - a.startYear;
}

export function sortTermsNewestFirst(terms: OrganizationTerm[]): OrganizationTerm[] {
  return [...terms].sort(compareTermsNewestFirst);
}

export function getTermsFromMembers(members: OrganizationMember[]): OrganizationTerm[] {
  const termMap = new Map<string, OrganizationTerm>();

  for (const member of members) {
    const term = parseTermId(member.termId);
    if (term) {
      termMap.set(term.id, term);
    }
  }

  return sortTermsNewestFirst([...termMap.values()]);
}

export function getDefaultTermId(terms: OrganizationTerm[]): string | undefined {
  return sortTermsNewestFirst(terms)[0]?.id;
}
