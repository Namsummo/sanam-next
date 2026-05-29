import { getMemberPersonById } from "@/lib/organization/mock-member-persons";
import type {
  OrganizationMember,
  OrganizationMemberDisplay,
} from "@/lib/organization/types";

export function resolveOrganizationMember(
  member: OrganizationMember,
): OrganizationMemberDisplay {
  const person = getMemberPersonById(member.personId);

  return {
    ...member,
    saintName: person?.saintName ?? "",
    realName: person?.realName ?? "",
  };
}

export function resolveOrganizationMembers(
  members: OrganizationMember[],
): OrganizationMemberDisplay[] {
  return members.map(resolveOrganizationMember);
}
