"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNavItems, isAdminNavActive } from "@/lib/admin/modules";
import { clearMockAdminSession } from "@/lib/admin/mock-auth";

type AdminSidebarProps = {
  email: string;
  onNavigate?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
};

export function AdminSidebar({
  email,
  onNavigate,
  onClose,
  showCloseButton = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearMockAdminSession();
    onNavigate?.();
    router.replace("/admin/login");
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-5">
        <Link href="/admin" className="block min-w-0 flex-1" onClick={onNavigate}>
          <p className="font-display text-lg font-semibold text-card-foreground">
            Sa Nam Admin
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản trị nội dung website
          </p>
        </Link>
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <X className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = isAdminNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="leading-snug">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          Đăng xuất
        </button>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-2 inline-flex w-full rounded-[10px] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          Xem website
        </Link>
      </div>
    </aside>
  );
}
