import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NewsReadMoreLinkProps = {
  href: string;
  className?: string;
};

export function NewsReadMoreLink({ href, className }: NewsReadMoreLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-base font-semibold uppercase leading-none text-primary",
        "transition-colors hover:text-accent",
        className,
      )}
    >
      <span>Đọc thêm</span>
      <ArrowUpRight
        className="size-3 shrink-0 transition-transform duration-400 group-hover:rotate-45"
        aria-hidden
      />
    </Link>
  );
}
