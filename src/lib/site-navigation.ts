import { EVENT_SECTIONS, getEventSectionHref } from "@/lib/events/categories";
import { NEWS_SECTIONS, getNewsSectionHref } from "@/lib/news/categories";

export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  children: NavLink[];
};

export type SiteNavItem = NavLink | NavGroup;

function splitNavHref(href: string) {
  const queryIndex = href.indexOf("?");
  if (queryIndex === -1) {
    return { pathname: href, search: "" };
  }
  return {
    pathname: href.slice(0, queryIndex),
    search: href.slice(queryIndex + 1),
  };
}

export function isSiteNavActive(
  pathname: string,
  href: string,
  options?: { exact?: boolean; search?: string },
) {
  const { pathname: hrefPath, search: hrefSearch } = splitNavHref(href);

  if (hrefPath === "/") {
    return pathname === "/";
  }

  const pathMatch = options?.exact
    ? pathname === hrefPath
    : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);

  if (!pathMatch) {
    return false;
  }

  if (!hrefSearch) {
    return true;
  }

  const expected = new URLSearchParams(hrefSearch);
  const current = new URLSearchParams(options?.search ?? "");
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) {
      return false;
    }
  }
  return true;
}

export function isNavGroupActive(
  pathname: string,
  item: NavGroup,
  search?: string,
) {
  if (item.href && isSiteNavActive(pathname, item.href)) {
    return true;
  }

  return item.children.some((child) =>
    isSiteNavActive(pathname, child.href, { exact: true, search }),
  );
}

export const siteMainNav: SiteNavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Giới thiệu",
    children: [
      { label: "Giáo xứ", href: "/introduce" },
      { label: "Hoa trái ơn gọi", href: "/introduce/hoa-trai-on-goi" },
      { label: "Ban Hành Giáo", href: "/introduce/ban-hanh-giao" },
      {
        label: "Sổ Gia Đình Công Giáo",
        href: "/introduce/so-gia-dinh-cong-giao",
      },
    ],
  },
  { label: "Đoàn thể", href: "/organization" },
  {
    label: "Tin tức",
    href: "/news",
    children: NEWS_SECTIONS.map((section) => ({
      label: section.label,
      href: getNewsSectionHref(section.id),
    })),
  },
  {
    label: "Sự kiện",
    href: "/events",
    children: EVENT_SECTIONS.map((section) => ({
      label: section.label,
      href: getEventSectionHref(section.id),
    })),
  },
  { label: "Phụng vụ", href: "/worship" },
  { label: "Liên hệ", href: "/contact" },
];

/** Header CTA — live worship stream */
export const siteWorshipLiveCta: NavLink = {
  label: "Thánh lễ trực tuyến",
  href: "/live",
};
