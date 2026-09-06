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
import { getFeastRankLabel } from "@/lib/liturgy/helpers";
import type {
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgySeason,
} from "@/lib/liturgy/types";
import { formatIsoDateToVi } from "@/lib/format";
import { cn } from "@/lib/utils";

type AdminLiturgyFeastsTableProps = {
  feasts: LiturgyFeast[];
  ranks?: LiturgyFeastRank[];
  seasons?: LiturgySeason[];
  onEdit: (feast: LiturgyFeast) => void;
  onDelete: (feast: LiturgyFeast) => void;
};

function getSeasonLabel(seasonId: string, seasons: LiturgySeason[]): string {
  const season = seasons.find((item) => item.id === seasonId);
  if (!season) return "—";
  return season.name;
}

export function AdminLiturgyFeastsTable({
  feasts,
  ranks = [],
  seasons = [],
  onEdit,
  onDelete,
}: AdminLiturgyFeastsTableProps) {
  const showSeasonColumn = seasons.length > 0;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">Tên</TableHead>
          <TableHead className="px-4">Ngày</TableHead>
          {showSeasonColumn ? (
            <TableHead className="px-4">Mùa</TableHead>
          ) : null}
          <TableHead className="px-4">Cấp</TableHead>
          <TableHead className="px-4 text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feasts.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={showSeasonColumn ? 6 : 5}
              className="px-4 py-12 text-center text-sm text-muted-foreground"
            >
              Chưa có ngày lễ nào.
            </TableCell>
          </TableRow>
        ) : (
          feasts.map((feast) => (
            <TableRow key={feast.id}>
              <TableCell className="px-4 py-3 font-medium">{feast.name}</TableCell>
              <TableCell className="px-4 py-3">
                {formatIsoDateToVi(feast.date)}
              </TableCell>
              {showSeasonColumn ? (
                <TableCell className="px-4 py-3">
                  {getSeasonLabel(feast.seasonId, seasons)}
                </TableCell>
              ) : null}
              <TableCell className="px-4 py-3">
                {getFeastRankLabel(feast, ranks)}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className={actionButtonClassName}
                    onClick={() => onEdit(feast)}
                  >
                    <Pencil className="size-4" /> Sửa
                  </button>
                  <button
                    type="button"
                    className={cn(actionButtonClassName, "text-accent")}
                    onClick={() => onDelete(feast)}
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
