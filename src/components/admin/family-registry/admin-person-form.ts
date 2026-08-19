import type { Person } from "@/lib/family-registry/types";

export type PersonFormValues = {
  id: string;
  saintName: string;
  fullName: string;
  dateOfBirth: string;
  dateOfDeath: string;
  gender: string;
  status: string;
  maritalStatus: string;
  giaoHo: string;
  giaoXu: string;
  giaoPhan: string;
  notes: string;

  baptismDate: string;
  baptismChurch: string;
  firstCommunionDate: string;
  firstCommunionChurch: string;
  confirmationDate: string;
  confirmationChurch: string;
  marriageDate: string;
  marriageChurch: string;
};

export function createEmptyPersonFormValues(): PersonFormValues {
  return {
    id: "",
    saintName: "",
    fullName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    gender: "male",
    status: "active",
    maritalStatus: "single",
    giaoHo: "",
    giaoXu: "",
    giaoPhan: "",
    notes: "",
    baptismDate: "",
    baptismChurch: "",
    firstCommunionDate: "",
    firstCommunionChurch: "",
    confirmationDate: "",
    confirmationChurch: "",
    marriageDate: "",
    marriageChurch: "",
  };
}

export function mapPersonToFormValues(person: Person): PersonFormValues {
  return {
    id: person.id,
    saintName: person.saintName ?? "",
    fullName: person.fullName,
    dateOfBirth: person.dateOfBirth,
    dateOfDeath: person.dateOfDeath ?? "",
    gender: person.gender ?? "male",
    status: person.status,
    maritalStatus: person.maritalStatus,
    giaoHo: person.giaoHo ?? "",
    giaoXu: person.giaoXu,
    giaoPhan: person.giaoPhan,
    notes: person.notes ?? "",
    baptismDate: person.sacraments.baptism?.date ?? "",
    baptismChurch: person.sacraments.baptism?.church ?? "",
    firstCommunionDate: person.sacraments.firstCommunion?.date ?? "",
    firstCommunionChurch: person.sacraments.firstCommunion?.church ?? "",
    confirmationDate: person.sacraments.confirmation?.date ?? "",
    confirmationChurch: person.sacraments.confirmation?.church ?? "",
    marriageDate: person.sacraments.marriage?.date ?? "",
    marriageChurch: person.sacraments.marriage?.church ?? "",
  };
}

export function formValuesToPerson(values: PersonFormValues): Omit<Person, "id" | "createdAt" | "updatedAt"> {
  const status = values.dateOfDeath
    ? "deceased" as const
    : (values.status as Person["status"]);

  return {
    saintName: values.saintName.trim() || null,
    fullName: values.fullName.trim(),
    dateOfBirth: values.dateOfBirth,
    dateOfDeath: values.dateOfDeath || null,
    profileImage: null,
    gender: (values.gender as Person["gender"]) || null,
    status,
    maritalStatus: values.maritalStatus as Person["maritalStatus"],
    giaoHo: values.giaoHo.trim() || null,
    giaoXu: values.giaoXu.trim(),
    giaoPhan: values.giaoPhan.trim(),
    sacraments: {
      baptism:
        values.baptismDate || values.baptismChurch
          ? { date: values.baptismDate || null, church: values.baptismChurch || null }
          : null,
      firstCommunion:
        values.firstCommunionDate || values.firstCommunionChurch
          ? { date: values.firstCommunionDate || null, church: values.firstCommunionChurch || null }
          : null,
      confirmation:
        values.confirmationDate || values.confirmationChurch
          ? { date: values.confirmationDate || null, church: values.confirmationChurch || null }
          : null,
      marriage:
        values.marriageDate || values.marriageChurch
          ? { date: values.marriageDate || null, church: values.marriageChurch || null }
          : null,
    },
    notes: values.notes.trim() || null,
  };
}
