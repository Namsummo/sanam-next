export const CLERGY_TYPE_PRIEST = 1 as const;
export const CLERGY_TYPE_COUNCIL = 2 as const;

export type ClergyMemberType =
  | typeof CLERGY_TYPE_PRIEST
  | typeof CLERGY_TYPE_COUNCIL;

export type ClergyMember = {
  id: number;
  type: ClergyMemberType;
  fullName: string;
  position: string;
  avatar: string;
  motto?: string;
  description?: string;
  /** ISO date YYYY-MM-DD */
  birthday?: string;
  sortOrder?: number;
  isVisible?: boolean;
};
