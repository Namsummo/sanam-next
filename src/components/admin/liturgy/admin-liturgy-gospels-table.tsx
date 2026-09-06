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
import type { LiturgyGospel } from "@/lib/liturgy/types";
import { formatIsoDateToVi } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminLiturgyGospelsTableProps = {
  gospels: LiturgyGospel[];
  onEdit: (gospel: LiturgyGospel) => void;
  onDelete: (gospel: LiturgyGospel) => void;
};

export function AdminLiturgyGospelsTable({
  gospels,
  onEdit,
  onDelete,
}: AdminLiturgyGospelsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">Ngày</TableHead>
          <TableHead className="px-4">Tên ngày phụng vụ</TableHead>
          <TableHead className="px-4">Trạng thái</TableHead>
          <TableHead className="px-4 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gospels.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              Chưa có lời Chúa nào.
            </TableCell>
          </TableRow>
        ) : (
          gospels.map((gospel) => (
            <TableRow key={gospel.id}>
              <TableCell className="px-4 py-3">
                {formatIsoDateToVi(gospel.date)}
                {gospel.today ? (
                  <span className="ml-2 text-xs font-medium text-accent">
                    Hôm nay
                  </span>
                ) : null}
              </TableCell>
              <TableCell className="px-4 py-3 font-medium">
                {gospel.liturgicalDayName}
              </TableCell>
              <TableCell className="px-4 py-3">
                {STATUS_LABELS[gospel.status]}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className={actionButtonClassName}
                    onClick={() => onEdit(gospel)}
                  >
                    <Pencil className="size-4" /> Sửa
                  </button>
                  <button
                    type="button"
                    className={cn(actionButtonClassName, "text-accent")}
                    onClick={() => onDelete(gospel)}
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
