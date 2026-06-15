"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/site/shared/ui/button/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSubmenu,
  NavigationMenuSubmenuContent,
  NavigationMenuSubmenuItem,
  NavigationMenuSubmenuLink,
  NavigationMenuSubmenuTrigger,
} from "@/components/site/shared/ui/navigation-menu/navigation-menu";
import {
  isSiteNavActive,
  siteMainNav,
  siteWorshipLiveCta,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

function isNavGroup(item: unknown): item is { label: string; children: { label: string; href: string }[] } {
  return (
    !!item &&
    typeof item === "object" &&
    "children" in item &&
    Array.isArray((item as { children?: unknown }).children)
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const mobileToggleA11y = mobileOpen
    ? ({ "aria-expanded": "true", "aria-label": "Đóng menu" } as const)
    : ({ "aria-expanded": "false", "aria-label": "Mở menu" } as const);

  const mobilePanelA11y = mobileOpen
    ? {}
    : ({ "aria-hidden": "true" } as const);

  const renderMobileNavItems = () =>
    siteMainNav.map((item) => {
      if (!isNavGroup(item)) {
        return (
          <li
            key={item.href}
            className="w-full border-b border-white/10 last:border-0"
          >
            <NavigationMenuLink
              href={item.href}
              active={isSiteNavActive(pathname, item.href)}
              onClick={closeMobile}
              className="block w-full py-3.5"
            >
              {item.label}
            </NavigationMenuLink>
          </li>
        );
      }

      return (
        <li
          key={item.label}
          className="w-full border-b border-white/10 last:border-0"
        >
          <div className="px-2.5 py-3 text-base font-bold text-white">
            {item.label}
          </div>
          <ul className="list-none pb-3">
            {item.children.map((child) => (
              <li key={child.href}>
                <NavigationMenuLink
                  href={child.href}
                  active={isSiteNavActive(pathname, child.href, { exact: true })}
                  onClick={closeMobile}
                  className="block w-full py-2 pl-5 text-sm opacity-95"
                >
                  {child.label}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </li>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        className={cn(
          "flex w-full items-center justify-between gap-4 bg-primary",
          "border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10 lg:py-[30px] rounded-2xl mt-2",
        )}
        aria-label="Main navigation"
      >
        <Link href="/" className="relative z-10 shrink-0">
          <Image
            src="/images/logo.svg"
            alt="SANAM"
            width={151}
            height={50}
            priority
            className="h-auto w-[120px] max-w-full sm:w-[151px]"
          />
        </Link>

        <NavigationMenu className="hidden flex-1 justify-center lg:flex">
          <NavigationMenuList>
            {siteMainNav.map((item) => {
              if (!isNavGroup(item)) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      href={item.href}
                      active={isSiteNavActive(pathname, item.href)}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              }

              const anyChildActive = item.children.some((c) =>
                isSiteNavActive(pathname, c.href, { exact: true }),
              );
              const parentHref = item.children[0]?.href ?? "/";

              return (
                <NavigationMenuSubmenu key={item.label}>
                  <NavigationMenuSubmenuTrigger
                    href={parentHref}
                    active={anyChildActive}
                  >
                    {item.label}
                  </NavigationMenuSubmenuTrigger>
                  <NavigationMenuSubmenuContent>
                    {item.children.map((child) => (
                      <NavigationMenuSubmenuItem key={child.href}>
                        <NavigationMenuSubmenuLink
                          href={child.href}
                          active={isSiteNavActive(pathname, child.href, { exact: true })}
                        >
                          {child.label}
                        </NavigationMenuSubmenuLink>
                      </NavigationMenuSubmenuItem>
                    ))}
                  </NavigationMenuSubmenuContent>
                </NavigationMenuSubmenu>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden shrink-0 lg:block">
          <Button
            variant="primary"
            href={siteWorshipLiveCta.href}
            className="normal-case py-3.5 pr-[42px] text-sm"
          >
            {siteWorshipLiveCta.label}
          </Button>
        </div>

        <button
          type="button"
          className="relative z-10 flex size-[38px] items-center justify-center rounded-md bg-accent text-white lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-controls="site-mobile-menu"
          {...mobileToggleA11y}
        >
          {mobileOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </nav>

      <div
        id="site-mobile-menu"
        className={cn(
          "w-full overflow-hidden border-b border-white/10 bg-primary transition-[max-height,opacity] duration-300 ease-in-out lg:hidden",
          mobileOpen
            ? "max-h-[min(80vh,640px)] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        )}
        {...mobilePanelA11y}
      >
        <ul className="list-none px-4 py-4 sm:px-6">
          {renderMobileNavItems()}
        </ul>
        <div className="px-4 pb-6 sm:px-6">
          <Button
            variant="primary"
            href={siteWorshipLiveCta.href}
            className="w-full justify-center normal-case"
            onClick={closeMobile}
          >
            {siteWorshipLiveCta.label}
          </Button>
        </div>
      </div>
    </header>
  );
}
