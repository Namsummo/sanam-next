"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { cva } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";

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
  ),
  {
    variants: {
      open: {
        true: "visible scale-y-100 opacity-100 py-[5px]",
        false: "",
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

/** Dropdown item link — `.main-menu ul ul li a` */
export const navigationSubmenuLinkStyle = cva(
  "mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium capitalize transition-all duration-300 ease-in-out focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "bg-primary/40 font-semibold text-white",
        false: "bg-transparent text-white/95 hover:bg-white/12 hover:text-white focus-visible:bg-white/12",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

type SubmenuContextValue = {
  close: () => void;
  open: boolean;
};

const SubmenuContext = createContext<SubmenuContextValue | null>(null);

function useSubmenuContext() {
  const context = useContext(SubmenuContext);
  if (!context) {
    throw new Error("Submenu components must be used within NavigationMenuSubmenu");
  }
  return context;
}

type NavigationMenuProps = ComponentPropsWithoutRef<"nav">;

function NavigationMenu({ className, ...props }: NavigationMenuProps) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn("relative", className)}
      {...props}
    />
  );
}

type NavigationMenuListProps = ComponentPropsWithoutRef<"ul">;

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn("inline-flex list-none items-center", className)}
      {...props}
    />
  );
}

type NavigationMenuItemProps = ComponentPropsWithoutRef<"li">;

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn("relative mx-2.5", className)}
      {...props}
    />
  );
}

type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof Link> & {
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

type NavigationMenuSubmenuProps = ComponentPropsWithoutRef<"li">;

function NavigationMenuSubmenu({ className, ...props }: NavigationMenuSubmenuProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <SubmenuContext.Provider value={{ open, close }}>
      <li
        data-slot="navigation-submenu"
        className={cn("relative mx-2.5", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
        {...props}
      />
    </SubmenuContext.Provider>
  );
}

type NavigationMenuSubmenuTriggerProps = ComponentPropsWithoutRef<typeof Link> & {
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

type NavigationMenuSubmenuContentProps = ComponentPropsWithoutRef<"ul">;

function NavigationMenuSubmenuContent({
  className,
  ...props
}: NavigationMenuSubmenuContentProps) {
  const { open } = useSubmenuContext();

  return (
    <ul
      data-slot="navigation-submenu-content"
      className={cn(navigationSubmenuContentStyle({ open }), className)}
      {...props}
    />
  );
}

type NavigationMenuSubmenuItemProps = ComponentPropsWithoutRef<"li">;

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

type NavigationMenuSubmenuLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  active?: boolean;
};

function NavigationMenuSubmenuLink({
  className,
  active = false,
  onClick,
  children,
  ...props
}: NavigationMenuSubmenuLinkProps) {
  const { close } = useSubmenuContext();

  return (
    <Link
      data-slot="navigation-submenu-link"
      aria-current={active ? "page" : undefined}
      className={cn(navigationSubmenuLinkStyle({ active }), className)}
      onClick={(event) => {
        close();
        onClick?.(event);
      }}
      {...props}
    >
      <Check
        className={cn(
          "size-3.5 shrink-0 transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      <span>{children}</span>
    </Link>
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
