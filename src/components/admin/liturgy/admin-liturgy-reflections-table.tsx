"use client";

import { Pencil, Trash2 } from "lucide-react";
import { actionButtonClassName } from "@/components/admin/events/admin-events-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { STATUS_LABELS } from "@/lib/liturgy/helpers";
import type { LiturgyReflection } from "@/lib/liturgy/types";
import { formatIsoDateToVi } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminLiturgyReflectionsTableProps = {
  reflections: LiturgyReflection[];
  onEdit: (reflection: LiturgyReflection) => void;
  onDelete: (reflection: LiturgyReflection) => void;
};

export function AdminLiturgyReflectionsTable({
  reflections,
  onEdit,
  onDelete,
}: AdminLiturgyReflectionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">Ngày</TableHead>
          <TableHead className="px-4">Tiêu đề</TableHead>
          <TableHead className="px-4">Trạng thái</TableHead>
          <TableHead className="px-4 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reflections.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              Chưa có suy niệm nào.
            </TableCell>
          </TableRow>
        ) : (
          reflections.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="px-4 py-3">
                {formatIsoDateToVi(item.date)}
              </TableCell>
              <TableCell className="px-4 py-3 font-medium">{item.title}</TableCell>
              <TableCell className="px-4 py-3">
                {STATUS_LABELS[item.status]}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className={actionButtonClassName}
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="size-4" /> Sửa
                  </button>
                  <button
                    type="button"
                    className={cn(actionButtonClassName, "text-accent")}
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="size-4" /> Xóa
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
