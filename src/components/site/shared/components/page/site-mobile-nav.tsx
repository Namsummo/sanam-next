"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  isSiteNavActive,
  siteMainNav,
  siteWorshipLiveCta,
  type SiteNavItem,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button/button";

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
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const toggleGroup = (label: string, currentlyOpen: boolean) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !currentlyOpen,
    }));
  };

  const isGroupExpanded = (
    item: Extract<SiteNavItem, { children: unknown }>,
  ) => {
    if (Object.hasOwn(expandedGroups, item.label)) {
      return expandedGroups[item.label];
    }

    return item.children.some((child) =>
      isSiteNavActive(pathname, child.href, { exact: true }),
    );
  };

  return (
    <>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        aria-label="Đóng menu"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-primary/55 backdrop-blur-[2px] transition-opacity duration-300 min-[992px]:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <nav
        id="site-mobile-nav"
        aria-label="Menu di động"
        aria-hidden={!open}
        className={cn(
          "absolute inset-x-0 top-full z-50 origin-top px-3 pb-3 transition-all duration-300 min-[992px]:hidden",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="max-h-[min(78vh,640px)] overflow-y-auto rounded-2xl border border-primary/10 bg-background shadow-[0_24px_60px_rgba(1,1,1,0.28)]">
          <div className="h-1 bg-accent" />

          <ul className="m-0 flex list-none flex-col gap-0.5 p-2.5">
            {siteMainNav.map((item) => {
              if (!isNavGroup(item)) {
                const active = isSiteNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-4 py-3 font-sans text-[15px] font-semibold tracking-wide no-underline transition-colors",
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-primary hover:bg-primary/5 hover:text-accent",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const groupOpen = isGroupExpanded(item);
              const groupActive = item.children.some((child) =>
                isSiteNavActive(pathname, child.href, { exact: true }),
              );

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    aria-expanded={groupOpen}
                    onClick={() => toggleGroup(item.label, groupOpen)}
                    className={cn(
                      "flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left font-sans text-[15px] font-semibold tracking-wide transition-colors",
                      groupActive
                        ? "bg-accent/10 text-accent"
                        : "text-primary hover:bg-primary/5 hover:text-accent",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 opacity-55 transition-transform duration-300",
                        groupOpen && "rotate-180 opacity-100",
                      )}
                      aria-hidden
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      groupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <ul className="m-0 list-none overflow-hidden">
                      {item.children.map((child) => {
                        const childActive = isSiteNavActive(
                          pathname,
                          child.href,
                          { exact: true },
                        );
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "ml-3 mr-1 mt-0.5 flex min-h-11 items-center rounded-lg border-l-2 px-4 py-2.5 font-sans text-sm font-medium no-underline transition-colors",
                                childActive
                                  ? "border-accent bg-accent/10 text-accent"
                                  : "border-transparent text-foreground hover:border-accent/40 hover:bg-primary/5 hover:text-accent",
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-primary/10 p-3">
            <Button
              variant="primary"
              showIcon
              onClick={() => {
                onClose();
                router.push(siteWorshipLiveCta.href);
              }}
              className="w-full"
            >
              {siteWorshipLiveCta.label}
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
