"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { cn } from "@/lib/utils";
import {
  getAccessToken,
  getCurrentUser,
  subscribeSession,
} from "@/lib/admin/auth-session";
import { Button } from "@/components/site/shared/ui/button/button";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const token = useSyncExternalStore(
    subscribeSession,
    getAccessToken,
    () => null,
  );
  const sessionUser = useSyncExternalStore(
    subscribeSession,
    getCurrentUser,
    () => null,
  );

  useEffect(() => {
    // Defer until after hydration so localStorage token is readable.
    // A false "null" token would redirect to login and lose the page.
    const id = requestAnimationFrame(() => setSessionReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 401) {
          const { clearSession } = await import("@/lib/admin/auth-session");
          clearSession();
        }
        return response;
      } catch (error) {
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (!sessionReady) return;
    if (token !== null) return;

    const next = encodeURIComponent(pathname || "/admin");
    router.replace(`/admin/login?next=${next}`);
  }, [sessionReady, token, pathname, router]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  if (!sessionReady || token === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-72">
          <AdminSidebar
            email={sessionUser?.email ?? ""}
            name={sessionUser?.name ?? ""}
          />
        </div>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}

      <div
        id="admin-mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        )}
      >
        <AdminSidebar
          email={sessionUser?.email ?? ""}
          name={sessionUser?.name ?? ""}
          onNavigate={closeMobileMenu}
          onClose={closeMobileMenu}
          showCloseButton
        />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-4 lg:hidden">
          <Button
            variant="transparent"
            showIcon={false}
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen ? "true" : "false"}
            aria-controls="admin-mobile-sidebar"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            className="size-10 shrink-0 text-black"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </Button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold text-card-foreground">
              Sa Nam Admin
            </p>
            <p className="truncate text-sm text-muted-foreground">{sessionUser?.email}</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
