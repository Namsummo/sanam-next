import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";


type ButtonVariant = "primary" | "dark" | "transparent";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  /** @default true */
  showIcon?: boolean;
  className?: string;
  children?: ReactNode;
};

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<"a">, "children"> & {
    href: string;
  };

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, "children"> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variants: Record<
  ButtonVariant,
  {
    base: string;
    sweep: string;
    textHover: string;
  }
> = {
  primary: {
    base: "border border-transparent bg-accent text-white",
    sweep: "bg-white",
    textHover: "group-hover:text-primary",
  },

  dark: {
    base: "border border-primary bg-primary text-white",
    sweep: "bg-white",
    textHover: "group-hover:text-primary",
  },

  transparent: {
    base: "border border-white bg-transparent text-white",
    sweep: "bg-white",
    textHover: "group-hover:text-primary",
  },
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    showIcon = true,
    className = "",
    children,
    ...rest
  } = props;
  const current = variants[variant];

  const classNames = cn(
    "group relative z-1 inline-flex items-center justify-center overflow-hidden rounded-[10px] px-[24px] py-[17px] font-display text-base font-semibold uppercase leading-none tracking-wide transition-all duration-500 ease-in-out cursor-pointer",
    showIcon ? "pr-[46px]" : "",
    current.base,
    className,
  );

  const content = (
    <>
      <span
        className={cn("absolute top-0 right-0 z-[-1] h-full w-0 transition-all duration-500 ease-in-out group-hover:left-0 group-hover:right-auto group-hover:w-full", current.sweep)}
        aria-hidden
      />

      <span
        className={cn("relative z-10 flex items-center transition-colors duration-500 ease-in-out", current.textHover)}
      >
        <span>{children}</span>
      </span>

      {showIcon ? (
        <ArrowUpRight
          className={cn(
            "absolute right-[24px] top-1/2 z-10 size-5 -translate-y-1/2 shrink-0 origin-center transform-gpu transition-all duration-500 ease-in-out group-hover:rotate-45",
            current.textHover,
          )}
          aria-hidden
        />
      ) : null}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest;
    return (
      <a href={href} className={classNames} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type, ...buttonProps } = rest as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button
      type={type === "submit" ? "submit" : "button"}
      className={classNames}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
