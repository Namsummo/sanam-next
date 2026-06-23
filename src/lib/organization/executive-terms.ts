import type { ExecutiveTerm, OrganizationTerm } from "@/lib/organization/types";
import {
  compareTermsNewestFirst,
  formatOrganizationTermLabel,
  parseTermId,
} from "@/lib/organization/terms";

function tryParseLegacyTermName(name: string): OrganizationTerm | null {
  const match = /(\d{4})\s*[-–]\s*(\d{4})/.exec(name);
  if (!match) {
    return null;
  }

  return parseTermId(`${match[1]}-${match[2]}`);
}

export function getExecutiveTermKey(term: ExecutiveTerm): string {
  return term._id || term.name;
}

export function getExecutiveTermYears(term: ExecutiveTerm): OrganizationTerm | null {
  if (term._id) {
    const parsed = parseTermId(term._id);
    if (parsed) {
      return parsed;
    }
  }

  return tryParseLegacyTermName(term.name);
}

export function normalizeExecutiveTerm(term: ExecutiveTerm): ExecutiveTerm {
  const parsed = getExecutiveTermYears(term);

  if (!parsed) {
    return term;
  }

  return {
    ...term,
    _id: parsed.id,
    name: formatOrganizationTermLabel(parsed),
  };
}

export function sortExecutiveTermsNewestFirst(terms: ExecutiveTerm[]): ExecutiveTerm[] {
  return [...terms].sort((a, b) => {
    const parsedA = getExecutiveTermYears(a);
    const parsedB = getExecutiveTermYears(b);

    if (parsedA && parsedB) {
      return compareTermsNewestFirst(parsedA, parsedB);
    }

    if (parsedA) {
      return -1;
    }

    if (parsedB) {
      return 1;
    }

    return a.name.localeCompare(b.name, "vi");
  });
}

export function createExecutiveTerm(
  term: OrganizationTerm,
  options?: { isCurrent?: boolean; members?: ExecutiveTerm["members"] },
): ExecutiveTerm {
  return {
    _id: term.id,
    name: formatOrganizationTermLabel(term),
    isCurrent: options?.isCurrent ?? false,
    members: options?.members ?? [],
  };
}

export function getExecutiveTermIds(terms: ExecutiveTerm[]): string[] {
  return terms
    .map((term) => term._id)
    .filter((id): id is string => Boolean(id));
}

export function formatExecutiveTermDisplay(term: ExecutiveTerm): string {
  return normalizeExecutiveTerm(term).name;
}
