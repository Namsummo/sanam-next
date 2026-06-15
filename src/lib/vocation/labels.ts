import {
  VOCATION_TYPE_BROTHER,
  VOCATION_TYPE_PRIEST,
  VOCATION_TYPE_SISTER,
  type VocationType,
} from "@/lib/vocation/types";

export const vocationTypeSectionTitles: Record<VocationType, string> = {
  [VOCATION_TYPE_PRIEST]: "Quý Cha",
  [VOCATION_TYPE_BROTHER]: "Quý Thầy",
  [VOCATION_TYPE_SISTER]: "Quý Dì",
};

export const vocationFilterOptions = [
  { id: "all", label: "Tất cả" },
  { id: VOCATION_TYPE_PRIEST, label: "Quý Cha" },
  { id: VOCATION_TYPE_BROTHER, label: "Quý Thầy" },
  { id: VOCATION_TYPE_SISTER, label: "Quý Dì" },
] as const;

export type VocationFilterId = (typeof vocationFilterOptions)[number]["id"];
