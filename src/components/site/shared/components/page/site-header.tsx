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

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          isSticky && "active",
          isHidden && "hide"
        )}
      >
        <nav className="navbar navbar-expand-lg py-5 lg:py-[30px] border-b border-white/10">
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
                            className={cn(
                              "nav-link text-white hover:text-accent transition-colors font-sans text-base font-semibold py-3 px-2.5 block",
                              active && "text-accent"
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
                            "nav-link text-white hover:text-accent transition-colors font-sans text-base font-semibold py-3 px-2.5 flex items-center gap-1 cursor-pointer",
                            active && "text-accent"
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
                                  "block text-white hover:text-primary font-sans text-base font-medium py-2 px-5 hover:pl-[23px] transition-all",
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

            <div className="navbar-toggle">
              <button
                type="button"
                className={cn(
                  "text-white hover:text-accent border border-primary rounded-sm bg-accent p-2 flex items-center gap-1 cursor-pointer",
                )}
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
