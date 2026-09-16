import type { ClergyMember } from "@/lib/clergy/types";

export const CLERGY_TYPE_OPTIONS = [
  { value: 1, label: "Linh mục" },
  { value: 2, label: "Ban Hành Giáo" },
] as const;

export type ClergyFormValues = {
  id: string;
  personId: string;
  type: 1 | 2;
  position: string;
  motto: string;
  description: string;
  ordinationDate: string;
  termId: string;
  sortOrder: string;
  isVisible: boolean;
  showOnHomepage: boolean;
};

export function createEmptyClergyFormValues(): ClergyFormValues {
  return {
    id: "",
    personId: "",
    type: 1,
    position: "",
    motto: "",
    description: "",
    ordinationDate: "",
    termId: "",
    sortOrder: "",
    isVisible: true,
    showOnHomepage: false,
  };
}

export function mapClergyToFormValues(member: ClergyMember): ClergyFormValues {
  return {
    id: String(member.id),
    personId: member.personId ?? "",
    type: member.type,
    position: member.position,
    motto: member.motto ?? "",
    description: member.description ?? "",
    ordinationDate: member.ordinationDate ?? "",
    termId: member.termId ?? "",
    sortOrder: member.sortOrder ? String(member.sortOrder) : "",
    isVisible: member.isVisible ?? true,
    showOnHomepage: member.showOnHomepage ?? false,
  };
}

export function getClergyTypeLabel(type: 1 | 2): string {
  return type === 1 ? "Linh mục" : "Ban Hành Giáo";
}

export function getClergyTypeBadgeClassName(type: 1 | 2): string {
  if (type === 1) return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}
