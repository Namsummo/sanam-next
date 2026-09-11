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

/**
 * Chuẩn hóa chuỗi tiếng Việt: loại bỏ dấu thanh, dấu mũ/móc và chuyển đ/Đ thành d để tìm kiếm không dấu.
 */
export function normalizeVietnamese(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim();
}

/**
 * Kiểm tra xem chuỗi haystack có chứa chuỗi query không (không phân biệt dấu tiếng Việt và chữ hoa/thường).
 */
export function matchesVietnamese(haystack: string | null | undefined, query: string | null | undefined): boolean {
  if (!query) return true;
  const normQuery = normalizeVietnamese(query);
  if (!normQuery) return true;
  return normalizeVietnamese(haystack).includes(normQuery);
}


