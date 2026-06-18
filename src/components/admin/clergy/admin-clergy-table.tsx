"use client";

import { Eye, EyeOff, Pencil, Search, Trash2 } from "lucide-react";
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
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { cn } from "@/lib/utils";
import type { ClergyMember } from "@/lib/clergy/types";

const ALL_FILTER_VALUE = "Tất cả";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminClergyTableProps = {
  members: ClergyMember[];
  editingId: string | null;
  searchQuery: string;
  typeFilter: "all" | "priest" | "council";
  onSearchQueryChange: (value: string) => void;
  onTypeFilterChange: (value: "all" | "priest" | "council") => void;
  onEdit: (member: ClergyMember) => void;
  onDelete: (memberId: string) => void;
  onToggleVisibility: (memberId: string) => void;
};

export function AdminClergyTable({
  members,
  editingId,
  searchQuery,
  typeFilter,
  onSearchQueryChange,
  onTypeFilterChange,
  onEdit,
  onDelete,
  onToggleVisibility,
}: AdminClergyTableProps) {
  return (
    <>
      <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Tìm kiếm
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(changeEvent) => onSearchQueryChange(changeEvent.target.value)}
                placeholder="Tên, chức vụ, quê quán..."
                className="pl-10"
              />
            </div>
          </label>

          <div className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Phân loại
            </span>
            <Select
              value={typeFilter === "all" ? ALL_FILTER_VALUE : typeFilter === "priest" ? "Linh mục" : "Ban Hành Giáo"}
              onValueChange={(value) => {
                if (!value || value === ALL_FILTER_VALUE) {
                  onTypeFilterChange("all");
                  return;
                }
                onTypeFilterChange(value === "Linh mục" ? "priest" : "council");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={ALL_FILTER_VALUE} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
                <SelectItem value="Linh mục">Linh mục</SelectItem>
                <SelectItem value="Ban Hành Giáo">Ban Hành Giáo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[20px] border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-card-foreground">
            Danh sách thành viên ({members.length})
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[250px] px-4">Thông tin</TableHead>
              <TableHead className="px-4">Phân loại</TableHead>
              <TableHead className="px-4">Nhiệm kỳ</TableHead>
              <TableHead className="px-4">Hiển thị</TableHead>
              <TableHead className="px-4 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Không có thành viên phù hợp bộ lọc hiện tại.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className={cn(editingId === member.id && "bg-accent/5 hover:bg-accent/10")}
                >
                  <TableCell className="min-w-[250px] px-4 py-3 whitespace-normal">
                    <p className="font-medium text-card-foreground">{member.fullName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{member.position}</p>
                    {member.hometown ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{member.hometown}</p>
                    ) : null}
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
      </section>
    </>
  );
}
