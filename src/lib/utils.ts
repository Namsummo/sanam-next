import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AriaInvalidValue = boolean | "true" | "false" | "grammar" | "spelling";

export function getAriaInvalidProps(value?: AriaInvalidValue) {
  if (value === undefined) {
    return {};
  }

  if (value === true || value === "true") {
    return { "aria-invalid": "true" as const };
  }

  if (value === false || value === "false") {
    return { "aria-invalid": "false" as const };
  }

  if (value === "grammar") {
    return { "aria-invalid": "grammar" as const };
  }

  return { "aria-invalid": "spelling" as const };
}
