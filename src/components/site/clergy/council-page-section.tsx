import { CouncilPageSectionClient } from "@/components/site/clergy/council-page-section-client";
import { getVisibleCouncilMembers } from "@/lib/clergy/helpers";
import type { ClergyMember } from "@/lib/clergy/types";
import { getPublicClergy, toClergyMember } from "@/shared/services/clergy-api";

export async function CouncilPageSection() {
  let members: ClergyMember[] = [];

  try {
    const res = await getPublicClergy({ type: "council" });
    members = getVisibleCouncilMembers(res.members.map(toClergyMember));
  } catch {
    members = [];
  }

  return <CouncilPageSectionClient members={members} />;
}
