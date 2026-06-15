import { CLERGY_TYPE_COUNCIL, CLERGY_TYPE_PRIEST } from "@/lib/clergy/types";
import type { ClergyMember } from "@/lib/clergy/types";
import { getDefaultCouncilTermId } from "@/lib/clergy/council-terms";

export const mockClergyMembers: ClergyMember[] = [
  {
    id: 1,
    type: CLERGY_TYPE_PRIEST,
    fullName: "Linh mục Phaolô Nguyễn Văn Hữu",
    position: "Cha Chánh Xứ",
    motto:
      "Tôi đến không phải để được phục vụ, nhưng để phục vụ và hiến dâng mạng sống làm giá chuộc muôn người.",
    description:
      "Với hơn 20 năm hồng ân Linh mục, Cha luôn là người mục tử hiền lành và nhân hậu, tận hiến dẫn dắt đoàn chiên Sa Nam thăng tiến trong đức tin và đức ái.",
    birthday: "1970-06-29",
    ordinationDate: "2000-06-29",
    patronSaint: "Thánh Phaolô Tông Đồ",
    patronDate: "29/06",
    hometown: "Giáo phận Vinh",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    type: CLERGY_TYPE_PRIEST,
    fullName: "Linh mục Vinh Sơn Trần Quý Sơn",
    position: "Cha Phó Xứ",
    motto:
      "Cứ để trẻ em đến với Thầy, đừng ngăn cản chúng, vì Nước Trời là của những ai giống như chúng.",
    description:
      "Với bầu nhiệt huyết của người mục tử trẻ, Cha đặc biệt dành nhiều tâm huyết đồng hành cùng Giới trẻ, Ban Giáo lý và các em Thiếu nhi Thánh Thể trong giáo xứ.",
    birthday: "1988-04-05",
    ordinationDate: "2018-05-31",
    patronSaint: "Thánh Vinh Sơn Linh Mục",
    patronDate: "05/04",
    hometown: "Giáo phận Hà Tĩnh",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 3,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan Baotixita Nguyễn Văn Hùng",
    position: "Trùm Chánh Giáo Xứ",
    birthday: "1965-06-24",
    patronSaint: "Thánh Gioan Tẩy Giả",
    patronDate: "24/06",
    hometown: "Giáo họ Trị Tin",
    termId: "2023-2026",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 4,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Giuse Phạm Minh Đức",
    position: "Phó Trùm Giáo Xứ",
    birthday: "1970-03-19",
    patronSaint: "Thánh Giuse",
    patronDate: "19/03",
    hometown: "Giáo họ Kim Lâm",
    termId: "2023-2026",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 5,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Phêrô Lê Hoàng Nam",
    position: "Thư Ký Giáo Xứ",
    birthday: "1978-06-29",
    patronSaint: "Thánh Phêrô Tông Đồ",
    patronDate: "29/06",
    hometown: "Giáo họ Kẻ Mui",
    termId: "2023-2026",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 6,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Bà Maria Nguyễn Thị Mai",
    position: "Trưởng Ban Caritas",
    birthday: "1972-09-15",
    patronSaint: "Đức Mẹ Sầu Bi",
    patronDate: "15/09",
    hometown: "Giáo họ Trị Tin",
    termId: "2023-2026",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: 7,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Anh Phanxicô Xaviê Lê Văn Anh",
    position: "Trưởng Ban Giáo Lý",
    birthday: "1991-12-03",
    patronSaint: "Thánh Phanxicô Xaviê",
    patronDate: "03/12",
    hometown: "Giáo họ Kim Lâm",
    termId: "2023-2026",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: 8,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Gioan Baotixita Nguyễn Văn Hùng",
    position: "Trùm Chánh Giáo Xứ",
    birthday: "1965-06-24",
    patronSaint: "Thánh Gioan Tẩy Giả",
    patronDate: "24/06",
    hometown: "Giáo họ Trị Tin",
    termId: "2020-2023",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 9,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Phêrô Lê Văn Trường",
    position: "Phó Trùm Giáo Xứ",
    birthday: "1968-06-29",
    patronSaint: "Thánh Phêrô Tông Đồ",
    patronDate: "29/06",
    hometown: "Giáo họ Kẻ Mui",
    termId: "2020-2023",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 10,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Ông Giuse Phạm Minh Đức",
    position: "Thư Ký Giáo Xứ",
    birthday: "1970-03-19",
    patronSaint: "Thánh Giuse",
    patronDate: "19/03",
    hometown: "Giáo họ Kim Lâm",
    termId: "2020-2023",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 11,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Bà Têrêsa Nguyễn Thị Hoa",
    position: "Trưởng Ban Caritas",
    birthday: "1975-10-01",
    patronSaint: "Thánh Têrêsa Calcutta",
    patronDate: "05/09",
    hometown: "Giáo họ Trị Tin",
    termId: "2020-2023",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: 12,
    type: CLERGY_TYPE_COUNCIL,
    fullName: "Anh Phanxicô Xaviê Lê Văn Anh",
    position: "Trưởng Ban Giáo Lý",
    birthday: "1991-12-03",
    patronSaint: "Thánh Phanxicô Xaviê",
    patronDate: "03/12",
    hometown: "Giáo họ Kim Lâm",
    termId: "2020-2023",
    sortOrder: 5,
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

export function getCurrentCouncilMembers(): ClergyMember[] {
  const all = getVisibleCouncilMembers();
  const currentTermId = getDefaultCouncilTermId(all);

  if (!currentTermId) {
    return all;
  }

  return all.filter((m) => m.termId === currentTermId);
}
