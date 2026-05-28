import { CLERGY_TYPE_COUNCIL, CLERGY_TYPE_PRIEST } from "@/lib/clergy/types";
import type { ClergyMember } from "@/lib/clergy/types";

export const mockClergyMembers: ClergyMember[] = [
  {
    id: 1,
    type: CLERGY_TYPE_PRIEST,
    fullName: "Linh mục Phaolô",
    position: "Cha Chánh Xứ",
    avatar: "/images/clergy/cha-chanh-xu.jpg",
    motto:
      "Tôi đến không phải để được phục vụ, nhưng để phục vụ và hiến dâng mạng sống làm giá chuộc muôn người.",
    description:
      "Với hơn 20 năm gắn bó, Cha luôn là người cha hiền, dẫn dắt cộng đoàn trên con đường đức tin.",
    birthday: "1975-06-29",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    type: CLERGY_TYPE_PRIEST,
    fullName: "Linh mục Vinh Sơn",
    position: "Cha Phó Xứ",
    avatar: "/images/clergy/cha-pho-xu.jpg",
    motto:
      "Cứ để trẻ em đến với Thầy, đừng ngăn cản chúng, vì Nước Trời là của những ai giống như chúng.",
    description:
      "Cha đặc biệt dành nhiều tâm huyết cho giới trẻ và các em thiếu nhi trong giáo xứ.",
    birthday: "1982-03-15",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 3,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan A",
    position: "Trùm giáo xứ",
    avatar: "/images/clergy/ong-trum.jpg",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 4,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan B",
    position: "Phó Trùm giáo xứ",
    avatar: "/images/clergy/pho-trum.jpg",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 5,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan C",
    position: "Chánh chương",
    avatar: "/images/clergy/thu-ky.jpg",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 5,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan C",
    position: "Chánh chương",
    avatar: "/images/clergy/thu-ky.jpg",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 5,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan C",
    position: "Chánh chương",
    avatar: "/images/clergy/thu-ky.jpg",
    sortOrder: 3,
    isVisible: true,
  },
];

function sortMembers(list: ClergyMember[]): ClergyMember[] {
  return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function getVisiblePriests(): ClergyMember[] {
  return sortMembers(
    mockClergyMembers.filter(
      (m) => m.isVisible !== false && m.type === CLERGY_TYPE_PRIEST,
    ),
  );
}

export function getVisibleCouncilMembers(): ClergyMember[] {
  return sortMembers(
    mockClergyMembers.filter(
      (m) => m.isVisible !== false && m.type === CLERGY_TYPE_COUNCIL,
    ),
  );
}
