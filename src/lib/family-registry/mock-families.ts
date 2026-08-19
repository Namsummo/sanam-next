import type { Family, FamilyMember } from "./types";

const now = "2026-01-01T00:00:00+07:00";

export const mockFamilies: Family[] = [
  {
    id: "f-001",
    familyCode: "GD-001",
    name: "Gia đình Nguyễn Văn An",
    headPersonId: "p-001",
    status: "active",
    statusNote: null,
    createdAt: now,
    updatedAt: now,
    notes: null,
  },
  {
    id: "f-002",
    familyCode: "GD-002",
    name: "Gia đình Nguyễn Văn Cường",
    headPersonId: "p-003",
    status: "active",
    statusNote: null,
    createdAt: now,
    updatedAt: now,
    notes: "",
  },
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: "fm-001",
    familyId: "f-001",
    personId: "p-001",
    role: "husband",
    birthOrder: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-002",
    familyId: "f-001",
    personId: "p-002",
    role: "wife",
    birthOrder: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-003",
    familyId: "f-001",
    personId: "p-003",
    role: "child",
    birthOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-004",
    familyId: "f-001",
    personId: "p-004",
    role: "child",
    birthOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-005",
    familyId: "f-002",
    personId: "p-003",
    role: "husband",
    birthOrder: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-006",
    familyId: "f-002",
    personId: "p-005",
    role: "wife",
    birthOrder: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fm-007",
    familyId: "f-002",
    personId: "p-006",
    role: "child",
    birthOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export function getFamilyById(id: string): Family | undefined {
  return mockFamilies.find((f) => f.id === id);
}

export function getMembersByFamilyId(familyId: string): FamilyMember[] {
  return mockFamilyMembers.filter((m) => m.familyId === familyId);
}

export function getFamiliesByPersonId(personId: string): Family[] {
  const familyIds = mockFamilyMembers
    .filter((m) => m.personId === personId)
    .map((m) => m.familyId);
  return mockFamilies.filter((f) => familyIds.includes(f.id));
}
