import Link from "next/link";
import type { AdminModule } from "@/lib/admin/modules";
import { cn } from "@/lib/utils";

type AdminModuleCardProps = {
  module: AdminModule;
};

export function AdminModuleCard({ module }: AdminModuleCardProps) {
  const Icon = module.icon;
  const isComingSoon = module.status === "coming-soon";

  return (
    <article
      className={cn(
        "rounded-[20px] border border-border bg-card p-5 transition-shadow",
        !isComingSoon && "hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-[10px] bg-muted text-accent">
          <Icon className="size-5" aria-hidden />
        </div>
        {isComingSoon ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Sắp có
          </span>
        ) : null}
      </div>

      <h2 className="mt-4 font-display text-lg font-semibold text-card-foreground">
        {module.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {module.description}
      </p>

      {isComingSoon ? (
        <p className="mt-4 text-sm text-muted-foreground">Đang được xây dựng.</p>
      ) : (
        <Link
          href={module.href}
          className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
        >
          Mở quản lý
        </Link>
      )}
    </article>
  );
}
