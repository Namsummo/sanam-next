import type { ComponentProps } from "react";
import { cn, getAriaInvalidProps } from "@/lib/utils";

export function Textarea({
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[132px] w-full resize-y rounded-[10px] border border-border bg-card px-4 py-3",
        "text-sm leading-relaxed text-card-foreground outline-none transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className,
      )}
      {...getAriaInvalidProps(ariaInvalid)}
      {...props}
    />
  );
}
