export const EXECUTIVE_MEMBER_ROLES = [
  { value: "Trưởng", label: "Trưởng" },
  { value: "Phó", label: "Phó" },
  { value: "Thành viên", label: "Thành viên" },
] as const;

export type ExecutiveMemberRole = (typeof EXECUTIVE_MEMBER_ROLES)[number]["value"];

function stripDiacritics(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function normalizeExecutiveMemberRole(value?: string): ExecutiveMemberRole | "" {
  if (!value?.trim()) {
    return "";
  }

  const normalized = stripDiacritics(value);

  if (normalized === "truong" || normalized.startsWith("truong ")) {
    return "Trưởng";
  }

  if (normalized === "pho" || normalized.startsWith("pho ")) {
    return "Phó";
  }

  if (
    normalized === "thanh vien" ||
    normalized === "tv" ||
    normalized.startsWith("thanh vien")
  ) {
    return "Thành viên";
  }

  if (EXECUTIVE_MEMBER_ROLES.some((role) => role.value === value.trim())) {
    return value.trim() as ExecutiveMemberRole;
  }

  if (normalized.includes("truong")) {
    return "Trưởng";
  }

  if (normalized.includes("pho")) {
    return "Phó";
  }

  return "Thành viên";
}

export function getExecutiveMemberRoleLabel(value?: string): string {
  const role = normalizeExecutiveMemberRole(value);
  return role || value?.trim() || "";
}
