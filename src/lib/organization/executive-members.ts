import type { ExecutiveMember, ExecutiveTerm } from "@/lib/organization/types";
import { normalizeExecutiveTerm } from "@/lib/organization/executive-terms";

export function assignMemberSortOrders(
  members: ExecutiveMember[],
): ExecutiveMember[] {
  return members.map((member, index) => ({
    ...member,
    sortOrder: index + 1,
  }));
}

export function sortMembersByOrder(
  members: ExecutiveMember[],
): ExecutiveMember[] {
  return [...members].sort(
    (a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999),
  );
}

export function normalizeExecutiveMembers(
  members: ExecutiveMember[],
): ExecutiveMember[] {
  return assignMemberSortOrders(sortMembersByOrder(members));
}

export function normalizeExecutiveTerms(
  terms: ExecutiveTerm[],
): ExecutiveTerm[] {
  return terms.map((term) =>
    normalizeExecutiveTerm({
      ...term,
      members: normalizeExecutiveMembers(term.members),
    }),
  );
}

export function createEmptyExecutiveMember(sortOrder: number): ExecutiveMember {
  return {
    fullName: "",
    birthday: "",
    patronSaint: "",
    position: "Thành viên",
    parish: "",
    image: "",
    sortOrder,
  };
}

export function getMemberSortOrder(
  member: ExecutiveMember,
  fallbackIndex: number,
): number {
  return member.sortOrder ?? fallbackIndex + 1;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function memberMatchesSearch(
  member: ExecutiveMember,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return true;
  }

  const haystack = normalizeSearchText(
    [member.fullName, member.patronSaint, member.position, member.parish]
      .filter(Boolean)
      .join(" "),
  );

  return haystack.includes(normalizedQuery);
}

export type IndexedExecutiveMember = {
  member: ExecutiveMember;
  memberIndex: number;
};

export function getIndexedExecutiveMembers(
  members: ExecutiveMember[],
): IndexedExecutiveMember[] {
  return sortMembersByOrder(members).map((member) => ({
    member,
    memberIndex: members.findIndex((item) => item === member),
  }));
}

export function filterIndexedExecutiveMembers(
  members: ExecutiveMember[],
  query: string,
): IndexedExecutiveMember[] {
  return getIndexedExecutiveMembers(members).filter(({ member }) =>
    memberMatchesSearch(member, query),
  );
}

export const EXECUTIVE_MEMBERS_PAGE_SIZE = 10;

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(itemCount: number, pageSize: number): number {
  return Math.max(1, Math.ceil(itemCount / pageSize));
}
