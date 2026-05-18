import type { ComponentProps } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";


type ButtonVariant = "primary" | "dark" | "transparent";

type ButtonProps = ComponentProps<"a"> & {
  variant?: ButtonVariant;
};

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

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const current = variants[variant];

  return (
    <a
      className={cn("group relative z-1 inline-flex items-center justify-center overflow-hidden rounded-[10px] px-[24px] py-[17px] pr-[46px] font-display text-base font-semibold uppercase leading-none tracking-wide transition-all duration-500 ease-in-out", current.base, className)}
      {...props}
    >
      <span
        className={cn("absolute top-0 right-0 z-[-1] h-full w-0 transition-all duration-500 ease-in-out group-hover:left-0 group-hover:right-auto group-hover:w-full", current.sweep)}
        aria-hidden
      />

      <span
        className={cn("relative z-10 flex items-center transition-colors duration-500 ease-in-out", current.textHover)}
      >
        <span>{children}</span>
      </span>

      <ArrowUpRight
        className={cn("absolute right-[24px] top-1/2 z-10 size-5 -translate-y-1/2 shrink-0 origin-center transform-gpu transition-all duration-500 ease-in-out group-hover:rotate-45", current.textHover)}
        aria-hidden
      />
    </a>
  );
}
