export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  children: NavLink[];
};

export type SiteNavItem = NavLink | NavGroup;

export function isSiteNavActive(
  pathname: string,
  href: string,
  options?: { exact?: boolean },
) {
  if (href === "/") {
    return pathname === "/";
  }

  if (options?.exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export const siteMainNav: SiteNavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    children: [
      { label: "Giáo xứ", href: "/introduce" },
      { label: "Hoa trái ơn gọi", href: "/introduce/hoa-trai-on-goi" },
      { label: "Ban Hành Giáo", href: "/introduce/ban-hanh-giao" },
      { label: "Sổ giáo dân", href: "/introduce/so-giao-dan" },
    ],
  },
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
