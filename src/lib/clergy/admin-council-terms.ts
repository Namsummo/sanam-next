import type { OrganizationTerm } from "@/lib/organization/types";
import {
  parseTermId,
  sortTermsNewestFirst,
} from "@/lib/organization/terms";

const STORAGE_KEY = "sanam_admin_clergy_extra_terms";

export function buildCouncilTermId(startYear: number, endYear: number): string {
  return `${startYear}-${endYear}`;
}

export function validateCouncilTermYears(
  startYear: number,
  endYear: number,
): string | null {
  if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) {
    return "Năm phải là số nguyên.";
  }

  if (startYear < 1900 || startYear > 2100 || endYear < 1900 || endYear > 2100) {
    return "Năm phải trong khoảng 1900–2100.";
  }

  if (endYear <= startYear) {
    return "Năm kết thúc phải lớn hơn năm bắt đầu.";
  }

  return null;
}

export function loadExtraCouncilTerms(): OrganizationTerm[] {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortTermsNewestFirst(
      parsed
        .map((item) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            typeof item.id === "string"
          ) {
            return parseTermId(item.id);
          }
          return null;
        })
        .filter((term): term is OrganizationTerm => term !== null),
    );
  } catch {
    return [];
  }
}

export function saveExtraCouncilTerms(terms: OrganizationTerm[]): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}

export function mergeCouncilTerms(
  ...termLists: OrganizationTerm[][]
): OrganizationTerm[] {
  const termMap = new Map<string, OrganizationTerm>();

  for (const list of termLists) {
    for (const term of list) {
      termMap.set(term.id, term);
    }
  }

  return sortTermsNewestFirst([...termMap.values()]);
}
