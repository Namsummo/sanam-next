import type {
  Family,
  FamilyMember,
  FamilyMemberDisplay,
  FamilyDetail,
  Person,
  FamilyMemberRole,
} from "./types";

export function resolveFamilyMembers(
  members: FamilyMember[],
  persons: Person[],
): FamilyMemberDisplay[] {
  const personMap = new Map(persons.map((p) => [p.id, p]));

  return members
    .map((m) => {
      const person = personMap.get(m.personId);
      if (!person) return null;
      return { ...m, person };
    })
    .filter((m): m is FamilyMemberDisplay => m !== null);
}

export function resolveFamilyDetail(
  family: Family,
  members: FamilyMember[],
  persons: Person[],
): FamilyDetail | null {
  const headPerson = persons.find((p) => p.id === family.headPersonId);
  if (!headPerson) return null;

  const familyMembers = members.filter((m) => m.familyId === family.id);
  const displayMembers = resolveFamilyMembers(familyMembers, persons);

  return { ...family, headPerson, members: displayMembers };
}

const ROLE_ORDER: Record<FamilyMemberRole, number> = {
  husband: 0,
  wife: 1,
  child: 2,
  other: 3,
};

export function sortFamilyMembers<T extends FamilyMember>(members: T[]): T[] {
  return [...members].sort((a, b) => {
    const roleA = ROLE_ORDER[a.role] ?? 99;
    const roleB = ROLE_ORDER[b.role] ?? 99;
    if (roleA !== roleB) return roleA - roleB;
    if (a.role === "child" && b.role === "child") {
      return (a.birthOrder ?? 999) - (b.birthOrder ?? 999);
    }
    return 0;
  });
}

export function canAddRole(
  existingMembers: FamilyMember[],
  role: FamilyMemberRole,
): boolean {
  if (role === "husband" || role === "wife") {
    return !existingMembers.some((m) => m.role === role);
  }
  return true;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPersonDisplayName(
  person: Pick<Person, "saintName" | "fullName">,
): string {
  if (person.saintName?.trim()) {
    return `${person.saintName.trim()} ${person.fullName}`;
  }
  return person.fullName;
}

const STATUS_BADGE_BASE =
  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium";

export function getPersonStatusBadgeClassName(
  status: Person["status"],
): string {
  switch (status) {
    case "active":
      return `${STATUS_BADGE_BASE} bg-emerald-100 text-emerald-700`;
    case "away":
      return `${STATUS_BADGE_BASE} bg-amber-100 text-amber-700`;
    case "transferred":
      return `${STATUS_BADGE_BASE} bg-blue-100 text-blue-700`;
    case "deceased":
      return `${STATUS_BADGE_BASE} bg-slate-100 text-slate-600`;
    case "inactive":
      return `${STATUS_BADGE_BASE} bg-slate-100 text-slate-500`;
    default:
      return `${STATUS_BADGE_BASE} bg-slate-100 text-slate-600`;
  }
}

export function getFamilyStatusBadgeClassName(
  status: Family["status"],
): string {
  switch (status) {
    case "active":
      return `${STATUS_BADGE_BASE} bg-emerald-100 text-emerald-700`;
    case "away":
      return `${STATUS_BADGE_BASE} bg-amber-100 text-amber-700`;
    case "transferred":
      return `${STATUS_BADGE_BASE} bg-blue-100 text-blue-700`;
    case "inactive":
      return `${STATUS_BADGE_BASE} bg-slate-100 text-slate-500`;
    default:
      return `${STATUS_BADGE_BASE} bg-slate-100 text-slate-600`;
  }
}
