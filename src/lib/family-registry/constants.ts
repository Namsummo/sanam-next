export const DEFAULT_GIAO_XU = "";
export const DEFAULT_GIAO_PHAN = "";

export const FAMILY_MEMBER_ROLE_LABELS: Record<string, string> = {
  husband: "Chồng",
  wife: "Vợ",
  child: "Con",
  other: "Khác",
};

export const PERSON_STATUS_LABELS: Record<string, string> = {
  active: "Đang sinh hoạt",
  away: "Xa quê",
  transferred: "Chuyển xứ",
  deceased: "Đã qua đời",
  inactive: "Khác",
};

export const FAMILY_STATUS_LABELS: Record<string, string> = {
  active: "Đang sinh hoạt",
  away: "Xa quê",
  transferred: "Chuyển xứ",
  inactive: "Khác",
};

export const GENDER_LABELS: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: "Độc thân",
  married: "Đã kết hôn",
};

export const SACRAMENT_LABELS = {
  baptism: "Rửa tội",
  firstCommunion: "Rước lễ lần đầu",
  confirmation: "Thêm sức",
  marriage: "Hôn phối",
} as const;
