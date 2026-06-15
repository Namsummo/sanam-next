import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AdminModulePlaceholderProps = {
  title: string;
  description: string;
};

export function AdminModulePlaceholder({
  title,
  description,
}: AdminModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về Tổng quan
      </Link>

      <div className="mt-6 rounded-[20px] border border-dashed border-border bg-card p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Đang phát triển
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-card-foreground">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
