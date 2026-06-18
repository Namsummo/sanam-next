"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
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
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Toggle active (sticky background) when scrolling past 600px
      if (currentScrollY > 600) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Hide or show based on scroll direction (hide when scrolling down, show when scrolling up)
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
          <div className="container mx-auto px-4 md:px-8 max-w-[1300px] flex items-center justify-between">
            {/* Logo Start */}
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
            {/* Logo End */}

            {/* Main Menu Start */}
            <div className="hidden lg:flex items-center flex-1 justify-center main-menu">
              <div className="nav-menu-wrapper">
                <ul className="navbar-nav flex items-center list-none m-0 p-0">
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

                    // For submenus (children)
                    const active = item.children.some((child) =>
                      isSiteNavActive(pathname, child.href, { exact: true })
                    );
                    return (
                      <li key={item.label} className="nav-item submenu group relative">
                        <span
                          className={cn(
                            "nav-link text-white hover:text-accent transition-colors font-sans text-base font-semibold py-3 px-2.5 block cursor-pointer flex items-center gap-1",
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

              {/* Header Btn Start */}
              <div className="header-btn shrink-0 ml-4">
                <Link
                  href={siteWorshipLiveCta.href}
                  className="btn-default btn-highlighted hover:text-primary py-3.5 px-6"
                >
                  {siteWorshipLiveCta.label}
                </Link>
              </div>
              {/* Header Btn End */}
            </div>
            {/* Main Menu End */}

            {/* Mobile Toggle Button */}
            <div className="navbar-toggle lg:hidden">
              <button
                type="button"
                className={cn(
                  "slicknav_btn flex items-center justify-center size-[38px] rounded-md bg-accent text-white",
                  mobileOpen && "slicknav_open"
                )}
                onClick={() => setMobileOpen((open) => !open)}
                aria-label="Toggle navigation menu"
              >
                <span className="slicknav_icon flex flex-col justify-between h-[15px] w-[22px]">
                  <span
                    className={cn(
                      "slicknav_icon-bar block h-[3px] w-full bg-white rounded transition-transform duration-300",
                      mobileOpen && "transform rotate-45 translate-y-[6px]"
                    )}
                  />
                  <span
                    className={cn(
                      "slicknav_icon-bar block h-[3px] w-full bg-white rounded transition-opacity duration-300",
                      mobileOpen && "opacity-0"
                    )}
                  />
                  <span
                    className={cn(
                      "slicknav_icon-bar block h-[3px] w-full bg-white rounded transition-transform duration-300",
                      mobileOpen && "transform -rotate-45 -translate-y-[6px]"
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Responsive Menu */}
        <div
          className={cn(
            "responsive-menu lg:hidden bg-accent overflow-hidden transition-all duration-300 ease-in-out w-full border-t border-white/10",
            mobileOpen ? "max-h-[80vh] py-3 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <ul className="list-none p-0 m-0">
            {siteMainNav.map((item) => {
              if (!isNavGroup(item)) {
                return (
                  <li key={item.href} className="w-full">
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className={cn(
                        "block text-white hover:text-primary font-sans text-base font-semibold py-2.5 px-6 transition-all",
                        isSiteNavActive(pathname, item.href) && "underline font-bold"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label} className="w-full">
                  <div className="text-white/80 font-sans text-xs uppercase tracking-wider font-bold pt-3 pb-1.5 px-6">
                    {item.label}
                  </div>
                  <ul className="list-none pl-4 pb-2">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeMobile}
                          className={cn(
                            "block text-white hover:text-primary font-sans text-sm font-medium py-2 px-6 transition-all",
                            isSiteNavActive(pathname, child.href, { exact: true }) && "underline font-bold"
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
            <li className="w-full px-6 py-4">
              <Link
                href={siteWorshipLiveCta.href}
                onClick={closeMobile}
                className="btn-default btn-border block text-center py-3 w-full bg-white text-primary border-none rounded-md"
              >
                {siteWorshipLiveCta.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
