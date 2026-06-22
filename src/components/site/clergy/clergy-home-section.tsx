import { ClergyHomeSectionClient } from "@/components/site/clergy/clergy-home-section-client";
import {
  getCurrentCouncilMembers,
  getVisiblePriests,
} from "@/lib/clergy/helpers";
import type { ClergyMember } from "@/lib/clergy/types";
import { getPublicClergy, toClergyMember } from "@/shared/services/clergy-api";

type ClergyHomeSectionProps = {
  className?: string;
};

export async function ClergyHomeSection({ className }: ClergyHomeSectionProps) {
  let members: ClergyMember[];

  try {
    const res = await getPublicClergy();
    members = res.members.map(toClergyMember);
  } catch {
    return null;
  }

  const priests = getVisiblePriests(members);
  const council = getCurrentCouncilMembers(members);

  if (priests.length === 0 && council.length === 0) {
    return null;
  }

  return (
    <ClergyHomeSectionClient
      className={className}
      priests={priests}
      council={council}
    />
  );
}
