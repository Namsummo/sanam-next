import type { Family, FamilyMember, FamilyMemberRole, FamilyStatus } from "@/lib/family-registry/types";

export type MemberEntry = {
  tempId: string;
  personId: string;
  role: FamilyMemberRole;
  birthOrder: number | null;
  existingId?: string;
};

export type FamilyFormValues = {
  id: string;
  name: string;
  headPersonId: string;
  status: FamilyStatus;
  statusNote: string;
  notes: string;
  members: MemberEntry[];
};

export function createEmptyFamilyFormValues(): FamilyFormValues {
  return {
    id: "",
    name: "",
    headPersonId: "",
    status: "active",
    statusNote: "",
    notes: "",
    members: [],
  };
}

export function mapFamilyToFormValues(
  family: Family,
  familyMembers: FamilyMember[],
): FamilyFormValues {
  return {
    id: family.id,
    name: family.name,
    headPersonId: family.headPersonId,
    status: family.status,
    statusNote: family.statusNote ?? "",
    notes: family.notes ?? "",
    members: familyMembers.map((m) => ({
      tempId: m.id,
      personId: m.personId,
      role: m.role,
      birthOrder: m.birthOrder,
      existingId: m.id,
    })),
  };
}
