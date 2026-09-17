/** Hiển thị ngày: DD/MM/YYYY. Chuỗi chỉ ngày (YYYY-MM-DD) tách phần để tránh lệch timezone. */
export function formatDate(value?: string | null): string {
  const trimmed = value?.trim();
  if (!trimmed) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

type EventDateTimeInput = {
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  allDay?: boolean;
};

export function formatEventDateTime(event: EventDateTimeInput): string {
  const startDateLabel = formatDate(event.startDate);

  if (event.allDay) {
    if (event.endDate && event.endDate !== event.startDate) {
      return `${startDateLabel} – ${formatDate(event.endDate)} (cả ngày)`;
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

  const endDateLabel = formatDate(endDate);
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
  const startDateLabel = formatDate(event.startDate);

  if (event.allDay) {
    if (event.endDate && event.endDate !== event.startDate) {
      return {
        date: `${startDateLabel} – ${formatDate(event.endDate)}`,
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

  const endDateLabel = formatDate(endDate);
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
