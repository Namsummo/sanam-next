"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  getVocationTypeBadgeClassName,
  getVocationTypeLabel,
} from "@/lib/vocation/labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { AdminPagination } from "@/components/admin/shared/admin-pagination";
import { cn, resolveApiUrl } from "@/lib/utils";
import type { VocationFruit } from "@/lib/vocation/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminVocationFruitsTableProps = {
  fruits: VocationFruit[];
  editingId: string | null;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit: (fruit: VocationFruit) => void;
  onDelete: (fruitId: string) => void;
};

export function AdminVocationFruitsTable({
  fruits,
  editingId,
  totalItems,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
}: AdminVocationFruitsTableProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách hoa trái ({fruits.length}/{totalItems ?? fruits.length})
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[250px] px-4">Thông tin</TableHead>
            <TableHead className="px-4">Nhóm</TableHead>
            <TableHead className="px-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fruits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                Không có hoa trái phù hợp bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            fruits.map((fruit) => (
              <TableRow
                key={fruit.id}
                className={cn(editingId === fruit.id && "bg-accent/5 hover:bg-accent/10")}
              >
                <TableCell className="min-w-[250px] px-4 py-3 whitespace-normal">
                  <div className="flex items-start gap-3">
                    {fruit.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveApiUrl(fruit.image)}
                        alt=""
                        className="size-10 shrink-0 rounded-[8px] object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="font-medium text-card-foreground">{fruit.fullName}</p>
                      {fruit.currentAssignment ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {fruit.currentAssignment}
                        </p>
                      ) : null}
                      {fruit.hometown ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {fruit.hometown}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      getVocationTypeBadgeClassName(fruit.vocationType),
                    )}
                  >
                    {getVocationTypeLabel(fruit.vocationType)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      className={actionButtonClassName}
                      onClick={() => onEdit(fruit)}
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
                      onClick={() => onDelete(fruit.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                      Xóa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {onPageChange ? (
        <div className="border-t border-border px-4 py-3">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => onPageChange?.(nextPage)}
            showWhenSinglePage
          />
        </div>
      ) : null}
    </section>
  );
}
