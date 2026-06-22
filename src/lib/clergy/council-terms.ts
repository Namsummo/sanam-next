import {
  getDefaultTermId as getDefaultOrgTermId,
  parseTermId,
  sortTermsNewestFirst,
} from "@/lib/organization/terms";
import type { OrganizationTerm } from "@/lib/organization/types";
import type { ClergyMember } from "@/lib/clergy/types";

export { formatOrganizationTermLabel as formatCouncilTermLabel } from "@/lib/organization/terms";

export function getTermsFromCouncilMembers(
  members: ClergyMember[],
): OrganizationTerm[] {
  const termMap = new Map<string, OrganizationTerm>();

  for (const member of members) {
    if (!member.termId) {
      continue;
    }

    const term = parseTermId(member.termId);
    if (term) {
      termMap.set(term.id, term);
    }
  }

  return sortTermsNewestFirst([...termMap.values()]);
}

export function getDefaultCouncilTermId(
  members: ClergyMember[],
): string | undefined {
  return getDefaultOrgTermId(getTermsFromCouncilMembers(members));
}
