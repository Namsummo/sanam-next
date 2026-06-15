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
  motto?: string;
  description?: string;
  /** ISO date YYYY-MM-DD */
  birthday?: string;
  sortOrder?: number;
  isVisible?: boolean;
  ordinationDate?: string; // Ngày thụ phong Linh mục
  patronSaint?: string;    // Thánh bổn mạng
  patronDate?: string;     // Ngày lễ bổn mạng
  hometown?: string;       // Quê quán / Giáo họ
  /** Ban Hành Giáo: khóa nhiệm kỳ, format YYYY-YYYY */
  termId?: string;
};

