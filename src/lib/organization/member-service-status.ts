import type { MemberServiceStatus } from "@/lib/organization/types";

const STATUS_LABELS: Record<MemberServiceStatus, string> = {
  active: "Đang tham gia",
  retired: "Đã về hưu",
  inactive: "Đã rời",
};

export function getMemberServiceStatusLabel(status: MemberServiceStatus): string {
  return STATUS_LABELS[status];
}
