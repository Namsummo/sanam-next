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

export function resolveApiUrl(url: string | null | undefined): string {
  if (!url) return "";

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // If it's a relative path starting with /uploads
  if (url.startsWith("/uploads/")) {
    return `${apiBase}${url}`;
  }

  // If it's an absolute URL but points to the uploads directory (e.g. via IP or old domain)
  const uploadsIndex = url.indexOf("/uploads/");
  if (uploadsIndex !== -1 && (url.startsWith("http://") || url.startsWith("https://"))) {
    const relativePath = url.substring(uploadsIndex);
    return `${apiBase}${relativePath}`;
  }

  return url;
}

