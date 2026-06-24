"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
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
import type { Organization } from "@/lib/organization/types";

export const ORGANIZATIONS_PAGE_SIZE = 10;

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminOrganizationsTableProps = {
  organizations: Organization[];
  editingId: string | null;
  fetching?: boolean;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organizationId: string) => void;
  onToggleVisibility: (organizationId: string) => void;
};

export function AdminOrganizationsTable({
  organizations,
  editingId,
  fetching = false,
  totalItems,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  onToggleVisibility,
}: AdminOrganizationsTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card",
        fetching && "opacity-60",
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách đoàn thể ({organizations.length}/{totalItems ?? organizations.length})
          {fetching ? (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              Đang tải...
            </span>
          ) : null}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[250px] px-4">Tên đoàn thể</TableHead>
            <TableHead className="px-4">Đường dẫn (Slug)</TableHead>
            <TableHead className="px-4">Hiển thị</TableHead>
            <TableHead className="px-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                Không có đoàn thể nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org) => (
              <TableRow
                key={org._id}
                className={cn(editingId === org._id && "bg-accent/5 hover:bg-accent/10")}
              >
                <TableCell className="min-w-[250px] px-4 py-3 whitespace-normal">
                  <div className="flex items-center gap-3">
                    {org.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveApiUrl(org.image)} alt="" className="size-10 rounded-[8px] object-cover shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-card-foreground">{org.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{org.memberCount} thành viên</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-card-foreground">
                  {org.slug}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(org._id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      org.isVisible
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    )}
                  >
                    {org.isVisible ? (
                      <><Eye className="size-3" aria-hidden /> Hiện</>
                    ) : (
                      <><EyeOff className="size-3" aria-hidden /> Ẩn</>
                    )}
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      className={actionButtonClassName}
                      onClick={() => onEdit(org)}
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
                      onClick={() => onDelete(org._id)}
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
            onPageChange={onPageChange}
            showWhenSinglePage
          />
        </div>
      ) : null}
    </section>
  );
}
