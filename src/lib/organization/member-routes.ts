import { mockOrganizationMembers } from "@/lib/organization/mock-organization-members";

export function getOrganizationMemberDetailHref(
  organizationSlug: string,
  personId: string,
): string {
  return `/organization/${organizationSlug}/thanh-vien/${personId}`;
}

export function getOrganizationMemberDetailStaticParams(): {
  slug: string;
  personId: string;
}[] {
  const seen = new Set<string>();
  const params: { slug: string; personId: string }[] = [];

  for (const member of mockOrganizationMembers) {
    const key = `${member.organizationSlug}:${member.personId}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    params.push({
      slug: member.organizationSlug,
      personId: member.personId,
    });
  }

  return params;
}

export function isPersonInOrganization(
  organizationSlug: string,
  personId: string,
): boolean {
  return mockOrganizationMembers.some(
    (m) => m.organizationSlug === organizationSlug && m.personId === personId,
  );
}
