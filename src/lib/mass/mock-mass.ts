export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type MassEntry = {
  time: string;
  title?: string;
};

export type MassScheduleGroup = {
  id: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  label: string;
  entries: MassEntry[];
};

export function getIsoDayOfWeek(date: Date): DayOfWeek {
  const jsDay = date.getDay();
  return (jsDay === 0 ? 7 : jsDay) as DayOfWeek;
}

export const dayIdMap: Record<DayOfWeek, MassScheduleGroup["id"]> = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
};

export const defaultEntries: MassEntry[] = [{ time: "05:30" }];

export const saturdayEntries: MassEntry[] = [
  { time: "05:30" },
  { time: "18:00" },
  { time: "19:00", title: "Giới trẻ" },
];

export const sundayEntries: MassEntry[] = [
  { time: "04:30" },
  { time: "06:00" },
  { time: "08:00", title: "Thiếu nhi" },
  { time: "19:00", title: "Giới trẻ" },
];

const massScheduleGroups: MassScheduleGroup[] = [
  { id: "monday", label: "Thứ Hai", entries: defaultEntries },
  { id: "tuesday", label: "Thứ Ba", entries: defaultEntries },
  { id: "wednesday", label: "Thứ Tư", entries: defaultEntries },
  { id: "thursday", label: "Thứ Năm", entries: defaultEntries },
  { id: "friday", label: "Thứ Sáu", entries: defaultEntries },
  { id: "saturday", label: "Thứ Bảy", entries: saturdayEntries },
  { id: "sunday", label: "Chủ Nhật", entries: sundayEntries },
];

export function getTodayGroupId(today: DayOfWeek): MassScheduleGroup["id"] {
  return dayIdMap[today];
}

export function getMassScheduleGroups(): MassScheduleGroup[] {
  return massScheduleGroups;
}

export function isTodayGroup(
  groupId: string,
  anchor = new Date(),
): boolean {
  return groupId === getTodayGroupId(getIsoDayOfWeek(anchor));
}
