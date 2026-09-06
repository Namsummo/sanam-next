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
import type { LiturgySeason } from "@/lib/liturgy/types";
import { formatIsoDateToVi } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminLiturgySeasonsTableProps = {
  seasons: LiturgySeason[];
  onEdit: (season: LiturgySeason) => void;
  onDelete: (season: LiturgySeason) => void;
};

export function AdminLiturgySeasonsTable({
  seasons,
  onEdit,
  onDelete,
}: AdminLiturgySeasonsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">Tên</TableHead>
          <TableHead className="px-4">Thời gian</TableHead>
          <TableHead className="px-4">Mùa hiện tại</TableHead>
          <TableHead className="px-4 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {seasons.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              Chưa có mùa phụng vụ nào.
            </TableCell>
          </TableRow>
        ) : (
          seasons.map((season) => (
            <TableRow key={season.id}>
              <TableCell className="px-4 py-3 font-medium">{season.name}</TableCell>
              <TableCell className="px-4 py-3">
                {formatIsoDateToVi(season.startDate)} –{" "}
                {formatIsoDateToVi(season.endDate)}
              </TableCell>
              <TableCell className="px-4 py-3">
                {season.isCurrentSeason ? "Có" : "Không"}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className={actionButtonClassName}
                    onClick={() => onEdit(season)}
                  >
                    <Pencil className="size-4" /> Sửa
                  </button>
                  <button
                    type="button"
                    className={cn(actionButtonClassName, "text-accent")}
                    onClick={() => onDelete(season)}
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
