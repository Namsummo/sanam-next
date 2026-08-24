"use client";

import Link from "next/link";
import { Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";
import { actionButtonClassName } from "@/components/admin/events/admin-events-table";
import { AdminPagination } from "@/components/admin/shared/admin-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { formatNewsDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NewsArticleResponse, PaginationInfo } from "@/shared/services/news-api";

export const NEWS_PAGE_SIZE = 20;

type AdminNewsTableProps = {
  articles: NewsArticleResponse[];
  pagination: PaginationInfo | null;
  fetching?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (articleId: string) => void;
  onToggleVisibility: (articleId: string) => void;
  onDelete: (articleId: string) => void;
};

export function AdminNewsTable({
  articles,
  pagination,
  fetching = false,
  onPageChange,
  onEdit,
  onToggleVisibility,
  onDelete,
}: AdminNewsTableProps) {
  const page = pagination?.page ?? 1;
  const startIndex = (page - 1) * (pagination?.limit ?? NEWS_PAGE_SIZE);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card",
        fetching && "opacity-60",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">STT</TableHead>
            <TableHead className="px-4">Tiêu đề</TableHead>
            <TableHead className="px-4">Danh mục</TableHead>
            <TableHead className="px-4 text-center">Nổi bật</TableHead>
            <TableHead className="px-4 text-center">Hiển thị</TableHead>
            <TableHead className="px-4">Ngày đăng</TableHead>
            <TableHead className="px-4 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={article._id}>
              <TableCell className="px-4 py-3 text-center">
                {startIndex + index + 1}
              </TableCell>
              <TableCell className="px-4 py-3 whitespace-normal">
                <Link
                  href={`/admin/news/${article._id}/edit`}
                  className="font-medium text-card-foreground transition-colors hover:text-accent"
                >
                  {article.title}
                </Link>
              </TableCell>
              <TableCell className="px-4 py-3 text-card-foreground">
                {article.categoryId?.label ?? "—"}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                {article.isFeatured ? (
                  <Star className="inline size-4 text-yellow-500" fill="currentColor" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(article._id)}
                  title={article.isVisible ? "Ẩn bài" : "Hiện bài"}
                  className={cn(
                    "transition-colors",
                    article.isVisible
                      ? "text-green-600 hover:text-green-700"
                      : "text-muted-foreground hover:text-card-foreground",
                  )}
                >
                  {article.isVisible ? (
                    <Eye className="inline size-4" />
                  ) : (
                    <EyeOff className="inline size-4" />
                  )}
                </button>
              </TableCell>
              <TableCell className="px-4 py-3 text-muted-foreground">
                {formatNewsDate(article.publishedAt)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className={actionButtonClassName}
                    onClick={() => onEdit(article._id)}
                    title="Sửa"
                  >
                    <Pencil className="size-4" aria-hidden />
                    Sửa
                  </button>
                  <button
                    type="button"
                    className={cn(
                      actionButtonClassName,
                      "text-destructive hover:bg-destructive/10",
                    )}
                    onClick={() => onDelete(article._id)}
                    title="Xóa"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Xóa
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages} ({pagination.total} bài)
          </span>
          <AdminPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  );
}
