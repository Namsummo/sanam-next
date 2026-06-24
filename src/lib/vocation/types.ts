export const VOCATION_TYPE_PRIEST = "priest" as const;
export const VOCATION_TYPE_BROTHER = "brother" as const;
export const VOCATION_TYPE_SISTER = "sister" as const;

export type VocationType =
  | typeof VOCATION_TYPE_PRIEST
  | typeof VOCATION_TYPE_BROTHER
  | typeof VOCATION_TYPE_SISTER;

export type VocationFruit = {
  id: string;
  fullName: string;
  vocationType: VocationType;
  /** Dòng tu / tổ chức */
  religiousOrder?: string;
  /** Nơi đang phục vụ */
  currentAssignment?: string;
  /** Giáo họ / quê hương tại giáo xứ */
  hometown?: string;
  patronSaint?: string;
  /** Năm thụ phong / tuyên khấn */
  vocationYear?: number;
  image?: string;
};
