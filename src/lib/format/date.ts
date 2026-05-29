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
