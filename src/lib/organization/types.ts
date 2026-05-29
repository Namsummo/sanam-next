export type Organization = {
  id: string;
  slug: string;
  name: string;
  memberCount: number;
  description: string;
  isVisible: boolean;
};

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
  /** ISO 8601 date YYYY-MM-DD */
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
