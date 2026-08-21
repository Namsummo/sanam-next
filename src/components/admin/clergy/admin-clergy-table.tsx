"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import {
  getClergyTypeBadgeClassName,
  getClergyTypeLabel,
} from "@/components/admin/clergy/admin-clergy-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { AdminPagination } from "@/components/admin/shared/admin-pagination";
import { cn } from "@/lib/utils";
import type { ClergyMember } from "@/lib/clergy/types";
import Image from "next/image";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminClergyTableProps = {
  members: ClergyMember[];
  editingId: string | null;
  fetching?: boolean;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit: (member: ClergyMember) => void;
  onDelete: (memberId: string) => void;
  onToggleVisibility: (memberId: string) => void;
  onToggleHomepageVisibility: (memberId: string) => void;
};

export function AdminClergyTable({
  members,
  editingId,
  fetching = false,
  totalItems,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleHomepageVisibility,
}: AdminClergyTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card",
        fetching && "opacity-60",
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách thành viên ({members.length}/{totalItems ?? members.length})
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
            <TableHead className="px-4">STT</TableHead>
            <TableHead className="min-w-72 px-4">Thông tin</TableHead>
            <TableHead className="px-4">Phân loại</TableHead>
            <TableHead className="px-4">Nhiệm kỳ</TableHead>
            <TableHead className="px-4">Hiển thị</TableHead>
            <TableHead className="px-4">Hiện ở Trang chủ</TableHead>
            <TableHead className="px-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                Không có thành viên phù hợp bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member, index) => (
              <TableRow
                key={member.id}
                className={cn(editingId === member.id && "bg-accent/5 hover:bg-accent/10")}
              >
                <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="min-w-72 px-4 py-3 whitespace-normal flex items-center gap-2">
                  <Image src={member.image || ""} alt={member.fullName} width={50} height={50} />
                  <div className="flex flex-col">                      <p className="font-medium text-card-foreground">{member.fullName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{member.position}</p>
                    {member.hometown ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{member.hometown}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      getClergyTypeBadgeClassName(member.type),
                    )}
                  >
                    {getClergyTypeLabel(member.type)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-card-foreground">
                  {member.termId || "-"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(String(member.id))}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      member.isVisible
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                    )}
                  >
                    {member.isVisible ? (
                      <><Eye className="size-3" aria-hidden /> Hiện</>
                    ) : (
                      <><EyeOff className="size-3" aria-hidden /> Ẩn</>
                    )}
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {member.type === 2 ? (
                    <button
                      type="button"
                      onClick={() => onToggleHomepageVisibility(String(member.id))}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        member.showOnHomepage
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                      )}
                    >
                      {member.showOnHomepage ? (
                        <><Eye className="size-3" aria-hidden /> Hiện</>
                      ) : (
                        <><EyeOff className="size-3" aria-hidden /> Ẩn</>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      className={actionButtonClassName}
                      onClick={() => onEdit(member)}
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
                      onClick={() => onDelete(String(member.id))}
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
