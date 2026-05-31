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
