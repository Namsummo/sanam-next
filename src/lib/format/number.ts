export function formatLocaleNumber(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return Math.floor(safe).toLocaleString("vi-VN");
}

export function formatMemberCount(count: number): string {
  return `${formatLocaleNumber(count)} thành viên`;
}
