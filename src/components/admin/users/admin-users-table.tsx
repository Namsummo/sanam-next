"use client";

import { Pencil, Trash2, User } from "lucide-react";
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
import type { ApiUser } from "@/shared/services/users-api";

export const USERS_PAGE_SIZE = 10;

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminUsersTableProps = {
  users: ApiUser[];
  currentUserId?: string;
  fetching?: boolean;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit: (user: ApiUser) => void;
  onDelete: (user: ApiUser) => void;
};

const ROLE_LABELS = {
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  viewer: "Người xem",
};

const ROLE_BADGE_CLASSES = {
  admin: "bg-rose-100 text-rose-700 border-rose-200",
  editor: "bg-blue-100 text-blue-700 border-blue-200",
  viewer: "bg-slate-100 text-slate-600 border-slate-200",
};

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "-";
  }
}

export function AdminUsersTable({
  users,
  currentUserId,
  fetching = false,
  totalItems,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
}: AdminUsersTableProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card",
        fetching && "opacity-60",
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách thành viên ({users.length}/{totalItems ?? users.length})
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
            <TableHead className="min-w-[200px] px-4">Họ và tên</TableHead>
            <TableHead className="px-4">Email</TableHead>
            <TableHead className="px-4">Vai trò</TableHead>
            <TableHead className="px-4">Ngày sinh</TableHead>
            <TableHead className="px-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Không có thành viên nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const isSelf = currentUserId === user._id;

              return (
                <TableRow key={user._id}>
                  <TableCell className="min-w-[200px] px-4 py-3 whitespace-normal">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-[8px] bg-accent/10 text-accent shrink-0">
                        <User className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {user.name} {isSelf && <span className="text-xs text-muted-foreground font-normal">(Bạn)</span>}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-card-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                        ROLE_BADGE_CLASSES[user.role] || ROLE_BADGE_CLASSES.viewer,
                      )}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-card-foreground">
                    {formatDate(user.dateOfBirth)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        className={actionButtonClassName}
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="size-4" aria-hidden />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className={cn(
                          actionButtonClassName,
                          "text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:hover:bg-transparent",
                        )}
                        disabled={isSelf}
                        title={isSelf ? "Không thể xóa tài khoản của chính mình" : undefined}
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        Xóa
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {onPageChange && totalPages > 1 ? (
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
