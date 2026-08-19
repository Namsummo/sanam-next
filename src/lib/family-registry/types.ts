// Sổ Gia Đình Công Giáo — Giáo xứ Sa Nam
//  Bí tích

export type BaptismSacrament = {
  date: string | null;
  church: string | null;
};

export type FirstCommunionSacrament = {
  date: string | null;
  church: string | null;
};

export type ConfirmationSacrament = {
  date: string | null;
  church: string | null;
};

export type MarriageSacrament = {
  date: string | null;
  church: string | null;
};

export type PersonSacraments = {
  baptism: BaptismSacrament | null;
  firstCommunion: FirstCommunionSacrament | null;
  confirmation: ConfirmationSacrament | null;
  marriage: MarriageSacrament | null;
};

export type PersonGender = "male" | "female" | "other";

export type MaritalStatus = "single" | "married";

export type PersonStatus =
  | "active"
  | "away"
  | "transferred"
  | "deceased"
  | "inactive";

export type Person = {
  id: string;

  saintName: string | null;
  fullName: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  profileImage: string | null;
  gender: PersonGender | null;

  status: PersonStatus;
  maritalStatus: MaritalStatus;

  giaoHo: string | null;
  giaoXu: string;
  giaoPhan: string;

  sacraments: PersonSacraments;

  createdAt: string;
  updatedAt: string;
  notes: string | null;
};

// Family

export type FamilyStatus = "active" | "away" | "transferred" | "inactive";

export type Family = {
  id: string;
  familyCode: string;
  name: string;
  headPersonId: string;
  status: FamilyStatus;
  statusNote: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
};

// FamilyMember

export type FamilyMemberRole = "husband" | "wife" | "child" | "other";

export type FamilyMember = {
  id: string;
  familyId: string;
  personId: string;
  role: FamilyMemberRole;
  birthOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

// Display helpers

export type FamilyMemberDisplay = FamilyMember & {
  person: Person;
};

export type FamilyDetail = Family & {
  headPerson: Person;
  members: FamilyMemberDisplay[];
};
