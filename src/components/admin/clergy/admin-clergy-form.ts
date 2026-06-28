import type { ClergyMember } from "@/lib/clergy/types";

export const CLERGY_TYPE_OPTIONS = [
  { value: 1, label: "Linh mục" },
  { value: 2, label: "Ban Hành Giáo" },
] as const;

export type ClergyFormValues = {
  id: string;
  type: 1 | 2;
  fullName: string;
  position: string;
  motto: string;
  description: string;
  birthday: string;
  sortOrder: string;
  isVisible: boolean;
  showOnHomepage: boolean;
  image: string;
  ordinationDate: string;
  patronSaint: string;
  patronDate: string;
  hometown: string;
  termId: string;
};

export function createEmptyClergyFormValues(): ClergyFormValues {
  return {
    id: "",
    type: 1,
    fullName: "",
    position: "",
    motto: "",
    description: "",
    birthday: "",
    sortOrder: "",
    isVisible: true,
    showOnHomepage: false,
    image: "",
    ordinationDate: "",
    patronSaint: "",
    patronDate: "",
    hometown: "",
    termId: "",
  };
}

export function mapClergyToFormValues(member: ClergyMember): ClergyFormValues {
  return {
    id: String(member.id),
    type: member.type,
    fullName: member.fullName,
    position: member.position,
    motto: member.motto ?? "",
    description: member.description ?? "",
    birthday: member.birthday ?? "",
    sortOrder: member.sortOrder ? String(member.sortOrder) : "",
    isVisible: member.isVisible ?? true,
    showOnHomepage: member.showOnHomepage ?? false,
    image: member.image ?? "",
    ordinationDate: member.ordinationDate ?? "",
    patronSaint: member.patronSaint ?? "",
    patronDate: member.patronDate ?? "",
    hometown: member.hometown ?? "",
    termId: member.termId ?? "",
  };
}

export function getClergyTypeLabel(type: 1 | 2): string {
  return type === 1 ? "Linh mục" : "Ban Hành Giáo";
}

export function getClergyTypeBadgeClassName(type: 1 | 2): string {
  if (type === 1) return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}
