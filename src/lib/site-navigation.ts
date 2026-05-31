export type NavLink = {
  label: string;
  href: string;
};

export function isSiteNavActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const siteMainNav: NavLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/introduce" },
  { label: "Đoàn thể", href: "/organization" },
  { label: "Tin tức", href: "/news" },
  { label: "Sự kiện", href: "/events" },
  { label: "Phụng vụ", href: "/worship" },
  { label: "Liên hệ", href: "/contact" },
];

/** Header CTA — live worship stream */
export const siteWorshipLiveCta: NavLink = {
  label: "Thánh lễ trực tuyến",
  href: "/worship/live",
};

export const siteFooterQuickLinks: NavLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/introduce" },
  { label: "Đoàn thể", href: "/organization" },
  { label: "Tin tức", href: "/news" },
  { label: "Sự kiện", href: "/events" },
  { label: "Phụng vụ", href: "/worship" },
  { label: "Liên hệ", href: "/contact" },
];

export const siteFooterServiceLinks: NavLink[] = [
  { label: "Prayer and Intercession", href: "/services/prayer" },
  { label: "Bible Study and Teaching", href: "/services/bible-study" },
  { label: "Outreach and Community", href: "/services/outreach" },
  { label: "Children's Church", href: "/services/children" },
  { label: "Youth Ministry Service", href: "/services/youth" },
];
