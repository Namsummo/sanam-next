"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  isSiteNavActive,
  siteMainNav,
  siteWorshipLiveCta,
  type SiteNavItem,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

function isNavGroup(
  item: SiteNavItem,
): item is { label: string; children: { label: string; href: string }[] } {
  return "children" in item && Array.isArray(item.children);
}

type SiteMobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function SiteMobileNav({ open, onClose }: SiteMobileNavProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  if (!open) return null;

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="slicknav_menu">
      <ul className="slicknav_nav list-none p-0 m-0">
        {siteMainNav.map((item) => {
          if (!isNavGroup(item)) {
            const active = isSiteNavActive(pathname, item.href);
            return (
              <li key={item.href} className="block">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "slicknav_row block",
                    active && "font-bold underline",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const groupOpen = !!expandedGroups[item.label];
          const groupActive = item.children.some((child) =>
            isSiteNavActive(pathname, child.href, { exact: true }),
          );

          return (
            <li
              key={item.label}
              className={cn(
                "slicknav_parent block",
                groupOpen ? "slicknav_open" : "slicknav_collapsed",
              )}
            >
              <button
                type="button"
                aria-expanded={groupOpen ? "true" : "false"}
                onClick={() => toggleGroup(item.label)}
                className={cn(
                  "slicknav_item slicknav_row w-full text-left",
                  groupActive && "font-bold",
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "slicknav_arrow-icon pointer-events-none absolute right-[15px] top-1/2 size-3 -translate-y-1/2 text-white transition-transform duration-300",
                    groupOpen && "rotate-180 text-primary",
                  )}
                  aria-hidden
                />
              </button>
              <ul
                className={cn(
                  "list-none p-0 m-0",
                  !groupOpen && "!hidden",
                )}
              >
                {item.children.map((child) => (
                  <li key={child.href} className="block">
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className={cn(
                        "block",
                        isSiteNavActive(pathname, child.href, {
                          exact: true,
                        }) && "font-bold underline",
                      )}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
        <li className="block px-5 py-4">
          <Link
            href={siteWorshipLiveCta.href}
            onClick={onClose}
            className="btn-default btn-highlighted inline-flex w-full justify-center py-3.5"
          >
            {siteWorshipLiveCta.label}
          </Link>
        </li>
      </ul>
    </div>
  );
}
