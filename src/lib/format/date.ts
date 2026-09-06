/** ISO 8601 date (YYYY-MM-DD) → DD/MM/YYYY */
export function formatIsoDateToVi(isoDate?: string): string {
  const trimmed = isoDate?.trim();
  if (!trimmed) {
    return "";
  }

  const parts = trimmed.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return trimmed;
}

const WEEKDAY_LABELS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

/** ISO date → nhãn thứ trong tuần (UTC) */
export function formatWeekdayVi(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return "";
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return WEEKDAY_LABELS[day] ?? "";
}

/** ISO 8601 datetime → ngày tháng tiếng Việt (vd. 20 thg 5, 2026) */
export function formatNewsDate(iso: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatEventTime(time?: string): string {
  const trimmed = time?.trim();
  if (!trimmed) {
    return "";
  }

  const [hours, minutes] = trimmed.split(":");
  if (!hours) {
    return trimmed;
  }

  if (minutes === "00" || !minutes) {
    return `${hours}h00`;
  }

  return `${hours}h${minutes}`;
}

export function formatEventDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

type EventDateTimeInput = {
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
};

export function formatEventDateTime(event: EventDateTimeInput): string {
  const startDateLabel = formatEventDate(event.startDate);

  if (event.allDay) {
    if (event.endDate && event.endDate !== event.startDate) {
      return `${startDateLabel} – ${formatEventDate(event.endDate)} (cả ngày)`;
    }
    return `${startDateLabel} (cả ngày)`;
  }

  const startTimeLabel = formatEventTime(event.startTime);
  const endDate = event.endDate ?? event.startDate;
  const sameDay = endDate === event.startDate;

  if (sameDay) {
    const endTimeLabel = formatEventTime(event.endTime);
    if (startTimeLabel && endTimeLabel) {
      return `${startDateLabel}, ${startTimeLabel} – ${endTimeLabel}`;
    }
    if (startTimeLabel) {
      return `${startDateLabel}, ${startTimeLabel}`;
    }
    return startDateLabel;
  }

  const endDateLabel = formatEventDate(endDate);
  const endTimeLabel = formatEventTime(event.endTime);

  if (startTimeLabel && endTimeLabel) {
    return `${startDateLabel}, ${startTimeLabel} – ${endDateLabel}, ${endTimeLabel}`;
  }

  return `${startDateLabel} – ${endDateLabel}`;
}

export function getEventDateTimeDisplay(event: EventDateTimeInput): {
  date: string;
  time?: string;
} {
  const startDateLabel = formatEventDate(event.startDate);

  if (event.allDay) {
    if (event.endDate && event.endDate !== event.startDate) {
      return {
        date: `${startDateLabel} – ${formatEventDate(event.endDate)}`,
        time: "Cả ngày",
      };
    }

    return { date: startDateLabel, time: "Cả ngày" };
  }

  const startTimeLabel = formatEventTime(event.startTime);
  const endDate = event.endDate ?? event.startDate;
  const sameDay = endDate === event.startDate;

  if (sameDay) {
    const endTimeLabel = formatEventTime(event.endTime);
    let time: string | undefined;

    if (startTimeLabel && endTimeLabel) {
      time = `${startTimeLabel} – ${endTimeLabel}`;
    } else if (startTimeLabel) {
      time = startTimeLabel;
    }

    return { date: startDateLabel, time };
  }

  const endDateLabel = formatEventDate(endDate);
  const endTimeLabel = formatEventTime(event.endTime);
  const date = `${startDateLabel} – ${endDateLabel}`;

  if (startTimeLabel && endTimeLabel) {
    return { date, time: `${startTimeLabel} – ${endTimeLabel}` };
  }

  if (startTimeLabel) {
    return { date, time: startTimeLabel };
  }

  return { date };
}
