import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Church,
  Contact,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
  Video,
} from "lucide-react";

export type AdminModuleStatus = "available" | "coming-soon";

export type AdminModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status: AdminModuleStatus;
};

export const adminModules: AdminModule[] = [
  {
    id: "news",
    title: "Tin tức",
    description: "Quản lý bài viết, danh mục và tin nổi bật.",
    href: "/admin/news",
    icon: Newspaper,
    status: "coming-soon",
  },
  {
    id: "events",
    title: "Sự kiện",
    description: "Tạo và cập nhật sự kiện giáo xứ.",
    href: "/admin/events",
    icon: CalendarDays,
    status: "available",
  },
  {
    id: "clergy",
    title: "Quý Cha & Ban Hành Giáo",
    description: "Cập nhật hồ sơ linh mục và ban hành giáo.",
    href: "/admin/clergy",
    icon: Church,
    status: "coming-soon",
  },
  {
    id: "organizations",
    title: "Đoàn thể",
    description: "Quản lý hội đoàn và thành viên phục vụ.",
    href: "/admin/organizations",
    icon: Users,
    status: "coming-soon",
  },
  {
    id: "worship",
    title: "Video & Livestream",
    description: "Thư viện video và trạng thái phát trực tiếp.",
    href: "/admin/worship",
    icon: Video,
    status: "coming-soon",
  },
  {
    id: "mass-schedule",
    title: "Lịch Thánh Lễ",
    description: "Cấu hình giờ lễ theo ngày trong tuần.",
    href: "/admin/mass-schedule",
    icon: CalendarDays,
    status: "coming-soon",
  },
  {
    id: "contact",
    title: "Liên hệ & Quyên góp",
    description: "Thông tin liên hệ và tài khoản quyên góp.",
    href: "/admin/contact",
    icon: Contact,
    status: "coming-soon",
  },
  {
    id: "settings",
    title: "Cấu hình chung",
    description: "Thiết lập website và nội dung tĩnh.",
    href: "/admin/settings",
    icon: Settings,
    status: "coming-soon",
  },
];

export const adminNavItems = [
  {
    id: "dashboard",
    title: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  ...adminModules.map(({ id, title, href, icon }) => ({
    id,
    title,
    href,
    icon,
  })),
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
