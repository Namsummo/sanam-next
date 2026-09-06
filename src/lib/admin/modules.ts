import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  Church,
  Contact,
  LayoutDashboard,
  Newspaper,
  Settings,
  Sprout,
  Users,
  Video,
  Image as ImageIcon,
  UserCog,
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
    status: "available",
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
    status: "available",
  },
  {
    id: "vocation-fruits",
    title: "Hoa trái ơn gọi",
    description: "Quản lý Quý Cha, Quý Thầy và Quý Dì quê hương.",
    href: "/admin/vocation-fruits",
    icon: Sprout,
    status: "available",
  },
  {
    id: "organizations",
    title: "Đoàn thể",
    description: "Quản lý hội đoàn và thành viên phục vụ.",
    href: "/admin/organizations",
    icon: Users,
    status: "available",
  },
  {
    id: "worship",
    title: "Video & Livestream",
    description: "Quản lý danh mục video, YouTube và phát trực tiếp.",
    href: "/admin/worship",
    icon: Video,
    status: "available",
  },
  {
    id: "liturgy",
    title: "Phụng vụ hàng ngày",
    description: "Quản lý mùa phụng vụ, ngày lễ, lời Chúa và suy niệm.",
    href: "/admin/liturgy",
    icon: BookOpen,
    status: "available",
  },
  {
    id: "mass-schedule",
    title: "Lịch Thánh Lễ",
    description: "Cấu hình giờ lễ theo ngày trong tuần.",
    href: "/admin/mass-schedule",
    icon: CalendarDays,
    status: "available",
  },
  {
    id: "contact",
    title: "Liên hệ & Quyên góp",
    description: "Thông tin liên hệ và tài khoản quyên góp.",
    href: "/admin/contact",
    icon: Contact,
    status: "available",
  },
  {
    id: "settings",
    title: "Cấu hình chung",
    description: "Thiết lập website, nội dung tĩnh và giao diện trang chủ.",
    href: "/admin/settings",
    icon: Settings,
    status: "available",
  },
  {
    id: "library",
    title: "Thư viện ảnh",
    description: "Quản lý hình ảnh nền của các trang.",
    href: "/admin/library",
    icon: ImageIcon,
    status: "available",
  },
  {
    id: "family-registry",
    title: "Sổ Gia Đình",
    description: "Quản lý hồ sơ cá nhân và gia đình Công giáo.",
    href: "/admin/family-registry",
    icon: BookOpen,
    status: "available",
  },
  {
    id: "users",
    title: "Thành viên",
    description: "Quản lý tài khoản đăng nhập trang quản trị.",
    href: "/admin/users",
    icon: UserCog,
    status: "available",
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
