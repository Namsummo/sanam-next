"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  isSiteNavActive,
  siteMainNav,
  siteWorshipLiveCta,
} from "@/lib/site-navigation";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button/button";
import { SiteMobileNav } from "./site-mobile-nav";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 600) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      if (
        !mobileOpen &&
        currentScrollY > lastScrollY.current &&
        currentScrollY > 150
      ) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="main-header" ref={headerRef}>
      <div
        className={cn(
          "header-sticky",
          (isSticky || mobileOpen) && "active",
          isHidden && !mobileOpen && "hide",
          mobileOpen && "transform-none!"
        )}
      >
        <nav className="navbar navbar-expand-lg relative z-60 border-b border-white/10 py-5 lg:py-[30px]">
          <div className="container mx-auto flex w-full max-w-[1300px] items-center justify-between px-4 min-[992px]:px-8">
            <Link href="/" className="navbar-brand">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={151}
                height={50}
                priority
                className="h-auto w-[120px] max-w-full sm:w-[151px]"
              />
            </Link>

            <div className="main-menu hidden min-[992px]:flex items-center flex-1 justify-center">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav flex items-center list-none m-0 p-0" id="menu">
                  {siteMainNav.map((item) => {
                    if (!isNavGroup(item)) {
                      const active = isSiteNavActive(pathname, item.href);
                      return (
                        <li key={item.href} className="nav-item relative">
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "nav-link block py-3 px-2.5 font-sans text-base font-semibold transition-colors hover:text-accent",
                              active ? "text-accent" : "text-white"
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    const active = item.children.some((child) =>
                      isSiteNavActive(pathname, child.href, { exact: true })
                    );
                    return (
                      <li key={item.label} className="nav-item submenu group relative">
                        <span
                          className={cn(
                            "nav-link flex cursor-pointer items-center gap-1 py-3 px-2.5 font-sans text-base font-semibold transition-colors hover:text-accent",
                            active ? "text-accent" : "text-white"
                          )}
                        >
                          {item.label}
                          <ChevronDown className="size-4 opacity-80" />
                        </span>
                        <ul className="absolute left-0 top-full bg-accent rounded-lg py-2 shadow-lg w-[235px] list-none z-50">
                          {item.children.map((child) => (
                            <li key={child.href} className="w-full">
                              <Link
                                href={child.href}
                                className={cn(
                                  "block py-2 px-5 font-sans text-base font-medium text-white transition-all hover:pl-[23px] hover:text-primary",
                                  isSiteNavActive(pathname, child.href, { exact: true }) && "font-bold underline"
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
                </ul>
              </div>

              <div className="header-btn shrink-0 ml-4">
                <Button
                  variant="primary"
                  showIcon={true}
                  onClick={() => router.push(siteWorshipLiveCta.href)}
                >
                  {siteWorshipLiveCta.label}
                </Button>
              </div>
            </div>

            <div className="navbar-toggle relative z-60">
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="site-mobile-nav"
                aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
                className="flex cursor-pointer items-center justify-center rounded-[10px] border border-white/20 bg-accent p-2 text-white transition-colors hover:bg-accent/90"
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </nav>

        <div className="responsive-menu">
          <SiteMobileNav open={mobileOpen} onClose={closeMobile} />
        </div>
      </div>
    </header>
  );
}
