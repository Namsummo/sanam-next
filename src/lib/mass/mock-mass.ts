export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type MassEntry = {
  time: string;
  title?: string;
};

export type MassScheduleGroup = {
  id: "weekday" | "saturday" | "sunday";
  label: string;
  entries: MassEntry[];
};

export function getIsoDayOfWeek(date: Date): DayOfWeek {
  const jsDay = date.getDay();
  return (jsDay === 0 ? 7 : jsDay) as DayOfWeek;
}

export const weekdayEntries: MassEntry[] = [{ time: "05:30" }];

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
  { id: "weekday", label: "Ngày thường", entries: weekdayEntries },
  { id: "saturday", label: "Thứ Bảy", entries: saturdayEntries },
  { id: "sunday", label: "Chủ Nhật", entries: sundayEntries },
];

function getTodayGroupId(today: DayOfWeek): MassScheduleGroup["id"] {
  if (today === 7) {
    return "sunday";
  }
  if (today === 6) {
    return "saturday";
  }
  return "weekday";
}

export function getMassScheduleGroups(
  anchor = new Date(),
): MassScheduleGroup[] {
  const today = getIsoDayOfWeek(anchor);
  const todayGroupId = getTodayGroupId(today);
  const todayGroup = massScheduleGroups.find(
    (group) => group.id === todayGroupId,
  );
  const otherGroups = massScheduleGroups.filter(
    (group) => group.id !== todayGroupId,
  );

  if (!todayGroup) {
    return massScheduleGroups;
  }

  return [todayGroup, ...otherGroups];
}

export function isTodayGroup(
  groupId: MassScheduleGroup["id"],
  anchor = new Date(),
): boolean {
  return groupId === getTodayGroupId(getIsoDayOfWeek(anchor));
}
