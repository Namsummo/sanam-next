import type { VocationFruit } from "@/lib/vocation/types";
import {
  VOCATION_TYPE_BROTHER,
  VOCATION_TYPE_PRIEST,
  VOCATION_TYPE_SISTER,
  type VocationType,
} from "@/lib/vocation/types";
import { vocationTypeSectionTitles } from "@/lib/vocation/labels";

export const VOCATION_TYPE_OPTIONS = [
  { value: VOCATION_TYPE_PRIEST, label: vocationTypeSectionTitles[VOCATION_TYPE_PRIEST] },
  { value: VOCATION_TYPE_BROTHER, label: vocationTypeSectionTitles[VOCATION_TYPE_BROTHER] },
  { value: VOCATION_TYPE_SISTER, label: vocationTypeSectionTitles[VOCATION_TYPE_SISTER] },
] as const;

export type VocationFruitFormValues = {
  fullName: string;
  vocationType: VocationType;
  religiousOrder: string;
  currentAssignment: string;
  hometown: string;
  patronSaint: string;
  vocationYear: string;
  image: string;
};

export function createEmptyVocationFruitFormValues(): VocationFruitFormValues {
  return {
    fullName: "",
    vocationType: VOCATION_TYPE_PRIEST,
    religiousOrder: "",
    currentAssignment: "",
    hometown: "",
    patronSaint: "",
    vocationYear: "",
    image: "",
  };
}

export function mapVocationFruitToFormValues(
  fruit: VocationFruit,
): VocationFruitFormValues {
  return {
    fullName: fruit.fullName,
    vocationType: fruit.vocationType,
    religiousOrder: fruit.religiousOrder ?? "",
    currentAssignment: fruit.currentAssignment ?? "",
    hometown: fruit.hometown ?? "",
    patronSaint: fruit.patronSaint ?? "",
    vocationYear: fruit.vocationYear ? String(fruit.vocationYear) : "",
    image: fruit.image ?? "",
  };
}
