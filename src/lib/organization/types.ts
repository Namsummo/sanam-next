export type ExecutiveMember = {
  _id?: string;
  fullName: string;
  birthday?: string;
  patronSaint?: string;
  position?: string;
  parish?: string;
  image?: string;
};

export type ExecutiveTerm = {
  _id?: string;
  name: string;
  isCurrent: boolean;
  members: ExecutiveMember[];
};

export type Organization = {
  _id: string;
  slug: string;
  name: string;
  image?: string;
  memberCount: number;
  history?: string;
  terms: ExecutiveTerm[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

// Legacy types (kept for mock files compatibility temporarily)
export type OrganizationTerm = {
  id: string;
  startYear: number;
  endYear: number;
};

export type MemberServiceStatus = "active" | "retired" | "inactive";

export type MemberPerson = {
  id: string;
  saintName: string;
  realName: string;
  dateOfBirth: string;
  address: string;
};

export type MemberServiceRecord = {
  id: string;
  personId: string;
  organizationSlug: string;
  termId: string;
  position: string;
  status: MemberServiceStatus;
};

export type OrganizationMember = {
  id: string;
  personId: string;
  organizationSlug: string;
  termId: string;
  position: string;
  isExecutive: boolean;
  sortOrder: number;
};

export type OrganizationMemberDisplay = OrganizationMember & {
  saintName: string;
  realName: string;
};

export type ServiceHistoryRow = {
  id: string;
  organizationName: string;
  organizationSlug: string;
  termLabel: string;
  startYear: number;
  position: string;
  status: MemberServiceStatus;
  statusLabel: string;
};
