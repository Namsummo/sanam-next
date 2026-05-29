import { getMemberServiceStatusLabel } from "@/lib/organization/member-service-status";
import { getOrganizationBySlug } from "@/lib/organization/mock-organizations";
import {
  formatOrganizationTermLabel,
  parseTermId,
} from "@/lib/organization/terms";
import type {
  MemberServiceRecord,
  MemberServiceStatus,
  ServiceHistoryRow,
} from "@/lib/organization/types";

/** Năm hiện tại dùng cho logic khóa và “đến nay”. */
export const ORGANIZATION_CURRENT_YEAR = 2026;

const MIN_CONTINUOUS_YEARS = 10;

type TermGroup = {
  termId: string;
  startYear: number;
  endYear: number;
  position: string;
  status: MemberServiceStatus;
};

function dedupeRecordsByTerm(records: MemberServiceRecord[]): TermGroup[] {
  const byTerm = new Map<string, TermGroup>();

  for (const record of records) {
    const term = parseTermId(record.termId);
    if (!term) {
      continue;
    }

    const existing = byTerm.get(record.termId);
    if (!existing || term.startYear >= existing.startYear) {
      byTerm.set(record.termId, {
        termId: record.termId,
        startYear: term.startYear,
        endYear: term.endYear,
        position: record.position,
        status: record.status,
      });
    }
  }

  return [...byTerm.values()].sort((a, b) => a.startYear - b.startYear);
}

function sortTermGroupsNewestFirst(terms: TermGroup[]): TermGroup[] {
  return [...terms].sort((a, b) => b.startYear - a.startYear);
}

function areTermsConsecutive(terms: TermGroup[]): boolean {
  if (terms.length <= 1) {
    return true;
  }

  for (let i = 0; i < terms.length - 1; i++) {
    if (terms[i].endYear !== terms[i + 1].startYear) {
      return false;
    }
  }

  return true;
}

function shouldCollapseToPresentSpan(terms: TermGroup[]): boolean {
  if (terms.length === 0) {
    return false;
  }

  const first = terms[0];
  const last = terms[terms.length - 1];
  const latestStatus = last.status;
  const yearsParticipating = ORGANIZATION_CURRENT_YEAR - first.startYear;

  return (
    areTermsConsecutive(terms) &&
    latestStatus === "active" &&
    yearsParticipating >= MIN_CONTINUOUS_YEARS &&
    last.endYear >= ORGANIZATION_CURRENT_YEAR
  );
}

function buildRowsForOrganization(
  organizationSlug: string,
  records: MemberServiceRecord[],
): ServiceHistoryRow[] {
  const organizationName =
    getOrganizationBySlug(organizationSlug)?.name ?? organizationSlug;
  const terms = dedupeRecordsByTerm(records);

  if (terms.length === 0) {
    return [];
  }

  if (shouldCollapseToPresentSpan(terms)) {
    const last = terms[terms.length - 1];
    return [
      {
        id: `${organizationSlug}-continuous`,
        organizationName,
        organizationSlug,
        termLabel: `${terms[0].startYear} – nay`,
        startYear: terms[0].startYear,
        position: last.position,
        status: last.status,
        statusLabel: getMemberServiceStatusLabel(last.status),
      },
    ];
  }

  return sortTermGroupsNewestFirst(terms).map((term) => ({
    id: `${organizationSlug}-${term.termId}`,
    organizationName,
    organizationSlug,
    termLabel: formatOrganizationTermLabel({
      id: term.termId,
      startYear: term.startYear,
      endYear: term.endYear,
    }),
    startYear: term.startYear,
    position: term.position,
    status: term.status,
    statusLabel: getMemberServiceStatusLabel(term.status),
  }));
}

export function buildServiceHistoryRows(
  records: MemberServiceRecord[],
): ServiceHistoryRow[] {
  const byOrg = new Map<string, MemberServiceRecord[]>();

  for (const record of records) {
    const list = byOrg.get(record.organizationSlug) ?? [];
    list.push(record);
    byOrg.set(record.organizationSlug, list);
  }

  const rows: ServiceHistoryRow[] = [];

  for (const [organizationSlug, orgRecords] of byOrg) {
    rows.push(...buildRowsForOrganization(organizationSlug, orgRecords));
  }

  return rows.sort((a, b) => {
    const nameCompare = a.organizationName.localeCompare(b.organizationName, "vi");
    if (nameCompare !== 0) {
      return nameCompare;
    }
    return b.startYear - a.startYear;
  });
}
