import type {
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgyGospel,
  LiturgyReflection,
  LiturgySeason,
} from "@/lib/liturgy/types";

const FIRST_READING_TITLE =
  "Bài trích sách ngon sứ giê-rê-mi-a (Giê-rê-mi 29, 11-13)";
const FIRST_READING_CONTENT =
  "Đây lời Đức Chúa phán với ông Giê-rê-mi-a: Con hãy viết vào sách mọi lời Ta đã phán với con.";
const GOSPEL_TITLE =
  "Tin mừng Chúa Giê-su Kito theo thánh Mattheu (Mt 1, 18-25)";
const GOSPEL_CONTENT =
  'Sứ thần vào nhà trinh nữ và nói: "Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà."';
const PRAYER_CONTENT =
  "Lạy Chúa, xin cho chúng con biết lắng nghe Lời Chúa và đem ơn cứu độ vào đời sống hằng ngày. Chúng con cầu xin.";
const SECOND_READING_TITLE =
  "Bài trích sách ngon sứ giê-rê-mi-a (Giê-rê-mi 29, 11-13)";
const SECOND_READING_CONTENT =
  "Thánh Thần và chúng tôi đã quyết định không đặt lên vai anh em một gánh nặng nào khác ngoài những điều cần thiết này.";

export const MOCK_GOSPELS: LiturgyGospel[] = [
  {
    id: "1",
    date: "2026-08-31",
    today: false,
    liturgicalDayName: "Thứ Hai XXII Thường Niên",
    theme: "Từ bỏ chính mình và vác thập giá theo đức giê-su",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "2",
    date: "2026-09-01",
    today: false,
    liturgicalDayName: "Thứ Ba XXII Thường Niên",
    theme: "Thứ Ba tuần Thường Niên",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "3",
    date: "2026-09-02",
    today: false,
    liturgicalDayName: "Thứ Tư XXII Thường Niên",
    theme: "Thứ Tư tuần Thường Niên",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "4",
    date: "2026-09-03",
    today: false,
    liturgicalDayName: "Thứ Năm XXII Thường Niên",
    theme: "Thứ Năm tuần Thường Niên",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "5",
    date: "2026-09-04",
    today: false,
    liturgicalDayName: "Thứ Sáu XXII Thường Niên",
    theme: "Thứ Sáu tuần Thường Niên",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "6",
    date: "2026-09-05",
    today: false,
    liturgicalDayName: "Thứ Bảy XXII Thường Niên",
    theme: "Thứ Bảy tuần Thường Niên",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
  {
    id: "7",
    date: "2026-09-06",
    today: true,
    liturgicalDayName: "Chúa Nhật XXIII Thường Niên",
    theme: "Con hãy viết vào sách mọi lời Ta đã phán với con",
    coverImage: "/images/default-cover.jpg",
    firstReadingTitle: FIRST_READING_TITLE,
    firstReadingContent: FIRST_READING_CONTENT,
    secondReadingTitle: SECOND_READING_TITLE,
    secondReadingContent: SECOND_READING_CONTENT,
    gospelTitle: GOSPEL_TITLE,
    gospelContent: GOSPEL_CONTENT,
    prayerContent: PRAYER_CONTENT,
    status: "published",
  },
];

export function seedSeasons(): LiturgySeason[] {
  return [
    {
      id: "season-ordinary-1",
      name: "Mùa Thường Niên",
      slug: "mua-thuong-nien-i-2026",
      startDate: "2026-01-13",
      endDate: "2026-02-17",
      isCurrentSeason: false,
    },
    {
      id: "season-chay",
      name: "Mùa Chay",
      slug: "mua-chay-2026",
      startDate: "2026-02-18",
      endDate: "2026-04-04",
      isCurrentSeason: true,
    },
    {
      id: "season-phuc-sinh",
      name: "Mùa Phục Sinh",
      slug: "mua-phuc-sinh-2026",
      startDate: "2026-04-05",
      endDate: "2026-05-24",
      isCurrentSeason: false,
    },
    {
      id: "season-vong",
      name: "Mùa Vọng",
      slug: "mua-vong-2026",
      startDate: "2026-11-30",
      endDate: "2026-12-24",
      isCurrentSeason: false,
    },
    {
      id: "season-giang-sinh",
      name: "Mùa Giáng Sinh",
      slug: "mua-giang-sinh-2026",
      startDate: "2026-12-25",
      endDate: "2027-01-12",
      isCurrentSeason: false,
    },
  ];
}

export function seedFeastRanks(): LiturgyFeastRank[] {
  return [
    {
      id: "rank-solemnity",
      slug: "solemnity",
      label: "Lễ trọng",
      sortOrder: 1,
    },
    { id: "rank-feast", slug: "feast", label: "Lễ kính", sortOrder: 2 },
    { id: "rank-memorial", slug: "memorial", label: "Lễ nhớ", sortOrder: 3 },
  ];
}

export function seedFeasts(): LiturgyFeast[] {
  return [
    // Mùa Thường Niên I
    {
      id: "1",
      date: "2026-02-02",
      name: "Dâng Chúa Giêsu Trong Đền Thánh",
      rankId: "rank-feast",
      rankLabel: "Lễ kính",
      seasonId: "season-ordinary-1",
      status: "published",
    },

    // Mùa Chay
    {
      id: "2",
      date: "2026-02-18",
      name: "Thứ Tư Lễ Tro",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-chay",
      status: "published",
    },
    {
      id: "3",
      date: "2026-03-19",
      name: "Thánh Giuse, Bạn trăm năm Đức Maria",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-chay",
      status: "published",
    },
    {
      id: "4",
      date: "2026-03-25",
      name: "Lễ Truyền Tin",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-chay",
      status: "published",
    },

    // Mùa Phục Sinh
    {
      id: "5",
      date: "2026-04-05",
      name: "Chúa Nhật Phục Sinh",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-phuc-sinh",
      status: "published",
    },
    {
      id: "6",
      date: "2026-04-12",
      name: "Chúa Nhật Lòng Chúa Thương Xót",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-phuc-sinh",
      status: "published",
    },
    {
      id: "7",
      date: "2026-05-14",
      name: "Lễ Chúa Giêsu Lên Trời",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-phuc-sinh",
      status: "published",
    },
    {
      id: "8",
      date: "2026-05-24",
      name: "Lễ Chúa Thánh Thần Hiện Xuống",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-phuc-sinh",
      status: "published",
    },

    {
      id: "9",
      date: "2026-09-06",
      name: "Đức Maria, Nữ Vương",
      rankId: "rank-memorial",
      rankLabel: "Lễ nhớ",
      seasonId: "season-ordinary-2",
      status: "published",
    },
    {
      id: "10",
      date: "2026-08-15",
      name: "Đức Mẹ Hồn Xác Lên Trời",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-ordinary-2",
      status: "published",
    },
    {
      id: "11",
      date: "2026-09-14",
      name: "Suy Tôn Thánh Giá",
      rankId: "rank-feast",
      rankLabel: "Lễ kính",
      seasonId: "season-ordinary-2",
      status: "published",
    },
    {
      id: "12",
      date: "2026-11-01",
      name: "Lễ Các Thánh",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-ordinary-2",
      status: "published",
    },
    {
      id: "13",
      date: "2026-11-22",
      name: "Chúa Giêsu Kitô Vua Vũ Trụ",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-ordinary-2",
      status: "published",
    },

    // Mùa Vọng
    {
      id: "14",
      date: "2026-12-08",
      name: "Đức Mẹ Vô Nhiễm Nguyên Tội",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-vong",
      status: "published",
    },
    {
      id: "15",
      date: "2026-12-12",
      name: "Đức Mẹ Guadalupe",
      rankId: "rank-feast",
      rankLabel: "Lễ kính",
      seasonId: "season-vong",
      status: "published",
    },

    // Mùa Giáng Sinh
    {
      id: "16",
      date: "2026-12-25",
      name: "Lễ Giáng Sinh",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-giang-sinh",
      status: "published",
    },
    {
      id: "17",
      date: "2026-12-28",
      name: "Lễ Thánh Gia",
      rankId: "rank-feast",
      rankLabel: "Lễ kính",
      seasonId: "season-giang-sinh",
      status: "published",
    },
    {
      id: "18",
      date: "2027-01-01",
      name: "Đức Maria, Mẹ Thiên Chúa",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-giang-sinh",
      status: "published",
    },
    {
      id: "19",
      date: "2027-01-04",
      name: "Lễ Chúa Hiển Linh",
      rankId: "rank-solemnity",
      rankLabel: "Lễ trọng",
      seasonId: "season-giang-sinh",
      status: "published",
    },
    {
      id: "20",
      date: "2027-01-11",
      name: "Lễ Chúa Giêsu Chịu Phép Rửa",
      rankId: "rank-feast",
      rankLabel: "Lễ kính",
      seasonId: "season-giang-sinh",
      status: "published",
    },
  ];
}

export function seedReflections(): LiturgyReflection[] {
  return [
    {
      id: "1",
      date: "2026-09-01",
      title: "Tôi là tôi tớ Chúa",
      coverImage: "/images/default-cover.jpg",
      content:
        "<p>Lời xin vâng của Đức Maria mở ra lịch sử cứu độ. Người tín hữu cũng được mời gọi lắng nghe Lời Chúa và đáp lại trong đời sống mỗi ngày.</p>",
      author: "Cha xứ",
      keyPoint:
        "Xin cho lòng con biết lắng nghe, để Lời Chúa thành lời xin vâng.",
      status: "published" as const,
    },
    {
      id: "2",
      date: "2026-09-03",
      title: "Sống Lời Chúa giữa đời thường",
      coverImage: "/images/default-cover.jpg",
      content:
        "<p>Mỗi ngày là cơ hội để đáp lại Lời Chúa trong công việc, gia đình và những mối quan hệ gần gũi.</p>",
      author: "Admin",
      keyPoint: "Giữa những điều bình dị, Chúa vẫn đang thì thầm gọi tên tôi.",
      status: "published" as const,
    },
    {
      id: "3",
      date: "2026-09-05",
      title: "Chúa Nhật XXIII Thường Niên – Năm A",
      coverImage: "/images/default-cover.jpg",
      content:
        "<p>Đặt cuộc đời trong tay Chúa không phải là buông xuôi, mà là tin tưởng bước đi với Ngài.</p>",
      author: "Cha xứ",
      status: "published" as const,
    },
  ];
}
