import Link from "next/link";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Top-level nav link — matches Emanu `.main-menu ul li a` */
export const navigationMenuLinkStyle = cva(
  "inline-flex items-center px-2.5 py-3 text-base font-medium capitalize transition-colors duration-300 ease-in-out focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "font-bold text-accent hover:text-primary focus-visible:text-primary",
        false: "text-white hover:text-white focus-visible:text-white",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

/** Submenu parent trigger — `.main-menu ul li.submenu > a` */
export const navigationSubmenuTriggerStyle = navigationMenuLinkStyle;

/** Dropdown panel — `.main-menu ul ul` */
export const navigationSubmenuContentStyle = cva(
  cn(
    "absolute left-0 top-full z-50 m-0 w-[235px] list-none rounded-[10px] bg-accent py-0",
    "invisible origin-top scale-y-[0.8] opacity-0 transition-all duration-300 ease-in-out",
    "group-hover/navigation-submenu:visible group-hover/navigation-submenu:scale-y-100 group-hover/navigation-submenu:opacity-100 group-hover/navigation-submenu:py-[5px]",
    "group-focus-within/navigation-submenu:visible group-focus-within/navigation-submenu:scale-y-100 group-focus-within/navigation-submenu:opacity-100 group-focus-within/navigation-submenu:py-[5px]",
  ),
);

/** Dropdown item link — `.main-menu ul ul li a` */
export const navigationSubmenuLinkStyle = cva(
  "block bg-transparent px-5 py-2 text-base font-medium capitalize transition-all duration-300 ease-in-out hover:bg-transparent focus-visible:bg-transparent focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "pl-[23px] font-semibold text-primary hover:pl-[23px] hover:text-primary focus-visible:pl-[23px] focus-visible:text-primary",
        false: "text-white hover:text-white focus-visible:text-white",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

type NavigationMenuProps = React.ComponentPropsWithoutRef<"nav">;

function NavigationMenu({ className, ...props }: NavigationMenuProps) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn("relative", className)}
      {...props}
    />
  );
}

type NavigationMenuListProps = React.ComponentPropsWithoutRef<"ul">;

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn("inline-flex list-none items-center", className)}
      {...props}
    />
  );
}

type NavigationMenuItemProps = React.ComponentPropsWithoutRef<"li">;

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn("relative mx-2.5", className)}
      {...props}
    />
  );
}

type NavigationMenuLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  active?: boolean;
};

function NavigationMenuLink({
  className,
  active = false,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <Link
      data-slot="navigation-menu-link"
      aria-current={active ? "page" : undefined}
      className={cn(navigationMenuLinkStyle({ active }), className)}
      {...props}
    />
  );
}

type NavigationMenuSubmenuProps = React.ComponentPropsWithoutRef<"li">;

function NavigationMenuSubmenu({ className, ...props }: NavigationMenuSubmenuProps) {
  return (
    <li
      data-slot="navigation-submenu"
      className={cn("group/navigation-submenu relative mx-2.5", className)}
      {...props}
    />
  );
}

type NavigationMenuSubmenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof Link
> & {
  active?: boolean;
};

function NavigationMenuSubmenuTrigger({
  className,
  active = false,
  children,
  ...props
}: NavigationMenuSubmenuTriggerProps) {
  return (
    <Link
      data-slot="navigation-submenu-trigger"
      className={cn(navigationSubmenuTriggerStyle({ active }), className)}
      {...props}
    >
      {children}
      <ChevronDown className="ml-2 size-3.5" aria-hidden />
    </Link>
  );
}

type NavigationMenuSubmenuContentProps = React.ComponentPropsWithoutRef<"ul">;

function NavigationMenuSubmenuContent({
  className,
  ...props
}: NavigationMenuSubmenuContentProps) {
  return (
    <ul
      data-slot="navigation-submenu-content"
      className={cn(navigationSubmenuContentStyle(), className)}
      {...props}
    />
  );
}

type NavigationMenuSubmenuItemProps = React.ComponentPropsWithoutRef<"li">;

function NavigationMenuSubmenuItem({
  className,
  ...props
}: NavigationMenuSubmenuItemProps) {
  return (
    <li
      data-slot="navigation-submenu-item"
      className={cn("m-0 p-0", className)}
      {...props}
    />
  );
}

type NavigationMenuSubmenuLinkProps = React.ComponentPropsWithoutRef<
  typeof Link
> & {
  active?: boolean;
};

function NavigationMenuSubmenuLink({
  className,
  active = false,
  ...props
}: NavigationMenuSubmenuLinkProps) {
  return (
    <Link
      data-slot="navigation-submenu-link"
      aria-current={active ? "page" : undefined}
      className={cn(navigationSubmenuLinkStyle({ active }), className)}
      {...props}
    />
  );
}

/** @deprecated Use NavigationMenuSubmenuTrigger */
const NavigationMenuTrigger = NavigationMenuSubmenuTrigger;

/** @deprecated Use NavigationMenuSubmenuContent */
const NavigationMenuContent = NavigationMenuSubmenuContent;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSubmenu,
  NavigationMenuSubmenuContent,
  NavigationMenuSubmenuItem,
  NavigationMenuSubmenuLink,
  NavigationMenuSubmenuTrigger,
  NavigationMenuTrigger,
  navigationSubmenuTriggerStyle as navigationMenuTriggerStyle,
};
