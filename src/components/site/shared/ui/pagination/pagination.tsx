import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const paginationLinkVariants = cva(
  "inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      isActive: {
        true: "border-accent bg-accent text-white hover:bg-accent/90",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

export function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  href?: string;
} & Omit<React.ComponentProps<typeof Link>, "href"> &
  React.ComponentProps<"button">;

export function PaginationLink({
  className,
  isActive,
  href,
  ...props
}: PaginationLinkProps) {
  if (href) {
    const { onClick, disabled, type, ...linkProps } = props;
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(paginationLinkVariants({ isActive }), className)}
        {...(linkProps as Omit<React.ComponentProps<typeof Link>, "href">)}
      />
    );
  }

  const { children, ...buttonProps } = props;
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={cn(paginationLinkVariants({ isActive }), className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export function PaginationPrevious({
  className,
  ...props
}: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink className={cn("gap-1 pl-2.5", className)} {...props}>
      <ChevronLeft className="size-4" aria-hidden />
      <span className="hidden sm:inline">Trước</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  ...props
}: Omit<PaginationLinkProps, "children">) {
  return (
    <PaginationLink className={cn("gap-1 pr-2.5", className)} {...props}>
      <span className="hidden sm:inline">Sau</span>
      <ChevronRight className="size-4" aria-hidden />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 min-w-9 items-center justify-center text-muted-foreground",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" aria-hidden />
      <span className="sr-only">Nhiều trang</span>
    </span>
  );
}

