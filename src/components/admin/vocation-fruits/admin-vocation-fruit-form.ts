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
  id?: string;
  personId: string;
  vocationType: VocationType;
  religiousOrder: string;
  currentAssignment: string;
  vocationYear: string;
};

export function createEmptyVocationFruitFormValues(): VocationFruitFormValues {
  return {
    id: "",
    personId: "",
    vocationType: VOCATION_TYPE_PRIEST,
    religiousOrder: "",
    currentAssignment: "",
    vocationYear: "",
  };
}

export function mapVocationFruitToFormValues(
  fruit: VocationFruit,
): VocationFruitFormValues {
  return {
    id: fruit.id,
    personId: fruit.personId ?? "",
    vocationType: fruit.vocationType,
    religiousOrder: fruit.religiousOrder ?? "",
    currentAssignment: fruit.currentAssignment ?? "",
    vocationYear: fruit.vocationYear ? String(fruit.vocationYear) : "",
  };
}
