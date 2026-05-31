import type { ParishEvent } from "@/lib/events/types";

export const mockParishEvents: ParishEvent[] = [
  {
    id: "event-001",
    slug: "ruoc-kieu-chua-thanh-the-2026",
    name: "Rước kiệu Chúa Thánh Thể — Lễ Thánh Thể",
    startDate: "2026-05-31",
    startTime: "16:00",
    endTime: "18:30",
    location: "Nhà thờ Giáo xứ Sa Nam — quanh khuôn viên giáo xứ",
    contentFormat: "html",
    content: `
      <p>Giáo xứ trân trọng kính mời cộng đoàn tham dự nghi thức Rước kiệu Chúa Thánh Thể mừng Lễ Thánh Thể.</p>
      <h2>Chương trình</h2>
      <ul>
        <li><strong>16h00</strong>: Tụ họp tại sân trước nhà thờ, chuẩn bị hoa và nến.</li>
        <li><strong>16h30</strong>: Thánh lễ và Rước kiệu quanh khuôn viên giáo xứ.</li>
        <li><strong>18h00</strong>: Chầu Thánh Thể và kết thúc.</li>
      </ul>
      <p>Xin cộng đoàn mặc trang phục chỉnh tề, mang theo hoa nếu có thể.</p>
    `,
    categoryId: "ruoc-kieu",
    isFeatured: true,
    featuredOrder: 1,
    status: "published",
    isVisible: true,
  },
  {
    id: "event-002",
    slug: "hoi-cho-gia-dinh-giao-xu-2026",
    name: "Hội chợ gia đình Giáo xứ Sa Nam 2026",
    startDate: "2026-06-07",
    startTime: "08:00",
    endDate: "2026-06-07",
    endTime: "17:00",
    location: "Sân giáo xứ Sa Nam",
    contentFormat: "html",
    content: `
      <p>Hội chợ gia đình thường niên với gian hàng ẩm thực, trò chơi cho thiếu nhi và các hoạt động gây quỹ bác ái.</p>
      <h2>Hoạt động nổi bật</h2>
      <ul>
        <li>Gian hàng ẩm thực các giáo họ</li>
        <li>Khu vui chơi thiếu nhi</li>
        <li>Ca nguyện và văn nghệ cộng đoàn</li>
      </ul>
      <p>Mọi gia đình được mời tham gia và hiệp lời cầu nguyện cho công việc bác ái của giáo xứ.</p>
    `,
    categoryId: "hoi-cho",
    isFeatured: true,
    featuredOrder: 2,
    status: "published",
    isVisible: true,
  },
  {
    id: "event-003",
    slug: "sinh-hoat-gioi-tre-cuoi-tuan",
    name: "Sinh hoạt Giới trẻ cuối tuần",
    startDate: "2026-05-30",
    startTime: "19:00",
    endTime: "21:00",
    location: "Phòng sinh hoạt Giới trẻ — Giáo xứ Sa Nam",
    contentFormat: "plain",
    content:
      "Chương trình sinh hoạt Giới trẻ cuối tuần gồm cầu nguyện, chia sẻ Lời Chúa và giao lưu văn nghệ.\n\nGiới trẻ từ 15–25 tuổi được mời tham dự đông đủ. Ban Giới trẻ có hỗ trợ đón tiếp từ 18h45.",
    categoryId: "gioi-tre",
    isFeatured: false,
    status: "published",
    isVisible: true,
  },
  {
    id: "event-004",
    slug: "thanh-le-le-hien-xuong-2026",
    name: "Thánh lễ Lễ Hiện Xuống",
    startDate: "2026-05-31",
    startTime: "19:00",
    location: "Nhà thờ chính Giáo xứ Sa Nam",
    contentFormat: "plain",
    content:
      "Thánh lễ mừng Lễ Hiện Xuống — kết thúc Mùa Phục Sinh.\n\nCộng đoàn được mời tham dự đông đủ, đặc biệt các gia đình có con em vừa Rước lễ lần đầu.",
    categoryId: "le-kinh",
    isFeatured: false,
    status: "published",
    isVisible: true,
  },
  {
    id: "event-005",
    slug: "giu-chan-thang-hoa-2026",
    name: "Giữ chân Tháng Hoa kính Đức Mẹ",
    startDate: "2026-06-03",
    startTime: "18:30",
    endDate: "2026-06-03",
    endTime: "20:00",
    location: "Nhà thờ Giáo xứ Sa Nam",
    contentFormat: "plain",
    content:
      "Chương trình giữ chân Tháng Hoa gồm Kinh Mân Côi, Thánh lễ và bông hoa dâng kính Đức Mẹ.\n\nMọi giáo dân được mời tham dự, đặc biệt các gia đình và hội đoàn.",
    categoryId: "giuong-trai",
    isFeatured: false,
    status: "published",
    isVisible: true,
  },
  {
    id: "event-006",
    slug: "hoat-dong-thien-nguyen-thang-6",
    name: "Chương trình thiện nguyện tháng 6",
    startDate: "2026-06-14",
    startTime: "07:00",
    endTime: "11:30",
    location: "Xã An Phú — huyện lân cận",
    contentFormat: "plain",
    content:
      "Đoàn thiện nguyện giáo xứ tổ chức thăm và trao quà cho các gia đình khó khăn.\n\nĐăng ký tham gia tại văn phòng giáo xứ trước ngày 10/6.",
    categoryId: "bac-ai",
    isFeatured: false,
    status: "published",
    isVisible: true,
  },
];

function parseDateOnly(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getEventStartDateTime(event: ParishEvent): Date {
  const date = parseDateOnly(event.startDate);
  if (event.startTime) {
    const [hours, minutes] = event.startTime.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

function getWeekRange(anchor: Date): { start: Date; end: Date } {
  const start = new Date(anchor);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function isPublishedVisible(event: ParishEvent): boolean {
  return event.isVisible && event.status === "published";
}

function compareEventsByStart(a: ParishEvent, b: ParishEvent): number {
  return (
    getEventStartDateTime(a).getTime() - getEventStartDateTime(b).getTime()
  );
}

export function getVisibleEvents(anchor = new Date()): ParishEvent[] {
  const now = new Date(anchor);
  now.setHours(0, 0, 0, 0);

  return mockParishEvents
    .filter(isPublishedVisible)
    .filter((event) => {
      const endDate = event.endDate ?? event.startDate;
      return parseDateOnly(endDate).getTime() >= now.getTime();
    })
    .sort(compareEventsByStart);
}

export function getFeaturedEvents(limit = 2, anchor = new Date()): ParishEvent[] {
  return getVisibleEvents(anchor)
    .filter((event) => event.isFeatured)
    .sort((a, b) => {
      const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return compareEventsByStart(a, b);
    })
    .slice(0, limit);
}

export function getEventsThisWeek(anchor = new Date()): ParishEvent[] {
  const { start, end } = getWeekRange(anchor);

  return getVisibleEvents(anchor).filter((event) => {
    const eventStart = parseDateOnly(event.startDate);
    const eventEnd = parseDateOnly(event.endDate ?? event.startDate);
    return eventStart.getTime() <= end.getTime() && eventEnd.getTime() >= start.getTime();
  });
}

export function getEventById(id: string): ParishEvent | undefined {
  return mockParishEvents.find((event) => event.id === id);
}

export function getEventBySlug(slug: string): ParishEvent | undefined {
  return mockParishEvents.find((event) => event.slug === slug);
}

export function getVisibleEventBySlug(slug: string): ParishEvent | undefined {
  const event = getEventBySlug(slug);
  if (!event || !isPublishedVisible(event)) {
    return undefined;
  }
  return event;
}
