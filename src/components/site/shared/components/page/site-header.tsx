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
  NavigationMenuList,
} from "@/components/site/shared/ui/navigation-menu/navigation-menu";
import {
  isSiteNavActive,
  siteMainNav,
  siteWorshipLiveCta,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";

function SiteNavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex px-2.5 py-3 text-base font-medium capitalize outline-none ring-0 focus-visible:outline-none focus-visible:ring-0",
        active ? "text-accent font-bold" : "text-white",
        className,
      )}
    >
      {label}
    </Link>
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

        <NavigationMenu className="hidden max-w-none flex-1 lg:flex">
          <NavigationMenuList className="gap-1">
            {siteMainNav.map((item) => (
              <NavigationMenuItem key={item.href}>
                <SiteNavLink
                  href={item.href}
                  label={item.label}
                  active={isSiteNavActive(pathname, item.href)}
                />
              </NavigationMenuItem>
            ))}
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
        <NavigationMenu className="w-full max-w-none">
          <NavigationMenuList className="flex w-full flex-col items-stretch gap-0 px-4 py-4 sm:px-6">
            {siteMainNav.map((item) => (
              <NavigationMenuItem
                key={item.href}
                className="w-full border-b border-white/10 last:border-0"
              >
                <SiteNavLink
                  href={item.href}
                  label={item.label}
                  active={isSiteNavActive(pathname, item.href)}
                  onNavigate={closeMobile}
                  className="block w-full py-3.5"
                />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
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
