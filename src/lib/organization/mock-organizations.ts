import type { Organization } from "@/lib/organization/types";

export const mockOrganizations: Organization[] = [
  {
    id: "org-001",
    slug: "ca-doan",
    name: "Ca đoàn",
    memberCount: 48,
    description:
      "Ca đoàn phục vụ trong các Thánh lễ Chúa Nhật và các dịp lễ đặc biệt của giáo xứ, góp phần nâng cao phần ca tụng và tinh thần cầu nguyện của cộng đoàn.",
    isVisible: true,
  },
  {
    id: "org-002",
    slug: "ban-giao-ly",
    name: "Ban Giáo lý",
    memberCount: 32,
    description:
      "Ban Giáo lý phụ trách giảng dạy, hướng dẫn và đồng hành với các lớp giáo lý từ lứa tuổi thiếu nhi đến thanh niên trong giáo xứ.",
    isVisible: true,
  },
  {
    id: "org-003",
    slug: "gia-dinh-phuc-tu",
    name: "Gia đình Phụt từ",
    memberCount: 86,
    description:
      "Hội đoàn Gia đình Phụt từ sinh hoạt định kỳ, chia sẻ Tin Mừng và củng cố đời sống đức tin trong từng gia đình giáo dân.",
    isVisible: true,
  },
  {
    id: "org-004",
    slug: "thieu-nhi-thanh-the",
    name: "Thiếu nhi Thánh Thể",
    memberCount: 120,
    description:
      "Thiếu nhi Thánh Thể tổ chức các buổi sinh hoạt, học hỏi đức tin và các hoạt động vui chơi lành mạnh cho các em trong giáo xứ.",
    isVisible: true,
  },
  {
    id: "org-005",
    slug: "legio-mariae",
    name: "Legio Mariae",
    memberCount: 24,
    description:
      "Legio Mariae hiệp ý cầu nguyện, tông đồ và phục vụ theo tinh thần hiến dâng cho Đức Maria, hỗ trợ các hoạt động mục vụ của giáo xứ.",
    isVisible: true,
  },
  {
    id: "org-006",
    slug: "hiep-hoi-ba-me",
    name: "Hiệp hội Bà mẹ",
    memberCount: 54,
    description:
      "Hiệp hội Bà mẹ quy tụ các bà mẹ giáo dân, cùng nhau cầu nguyện, chia sẻ kinh nghiệm nuôi dạy con cái theo đức tin.",
    isVisible: true,
  },
];

export function getVisibleOrganizations(): Organization[] {
  return mockOrganizations.filter((org) => org.isVisible);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  return mockOrganizations.find((org) => org.slug === slug);
}

export function getOrganizationById(id: string): Organization | undefined {
  return mockOrganizations.find((org) => org.id === id);
}
