import { getDefaultCouncilTermId } from "@/lib/clergy/council-terms";
import {
  CLERGY_TYPE_COUNCIL,
  CLERGY_TYPE_PRIEST,
  type ClergyMember,
} from "@/lib/clergy/types";

export function sortClergyByOrder(members: ClergyMember[]): ClergyMember[] {
  return [...members].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getVisiblePriests(members: ClergyMember[]): ClergyMember[] {
  return sortClergyByOrder(
    members.filter(
      (member) => member.isVisible !== false && member.type === CLERGY_TYPE_PRIEST,
    ),
  );
}

export function getVisibleCouncilMembers(members: ClergyMember[]): ClergyMember[] {
  return sortClergyByOrder(
    members.filter(
      (member) => member.isVisible !== false && member.type === CLERGY_TYPE_COUNCIL,
    ),
  );
}

export function getCurrentCouncilMembers(members: ClergyMember[]): ClergyMember[] {
  const visible = getVisibleCouncilMembers(members);
  const currentTermId = getDefaultCouncilTermId(visible);

  if (!currentTermId) {
    return visible;
  }

  return visible.filter((member) => member.termId === currentTermId);
}
