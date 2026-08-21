"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { cn } from "@/lib/utils";
import type { Family, FamilyMember, Person } from "@/lib/family-registry/types";
import { FAMILY_STATUS_LABELS } from "@/lib/family-registry/constants";
import {
  formatPersonDisplayName,
  getFamilyStatusBadgeClassName,
} from "@/lib/family-registry/helpers";

const actionBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminFamiliesTableProps = {
  families: Family[];
  persons: Person[];
  members: FamilyMember[];
  onEdit: (family: Family) => void;
  onDelete: (familyId: string) => void;
};

export function AdminFamiliesTable({
  families,
  persons,
  members,
  onEdit,
  onDelete,
}: AdminFamiliesTableProps) {
  const personMap = new Map(persons.map((p) => [p.id, p]));

  return (
    <section className="overflow-hidden rounded-[20px] border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách gia đình ({families.length})
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Mã GĐ</TableHead>
              <TableHead className="min-w-50">Tên gia đình</TableHead>
              <TableHead className="min-w-50">Người đứng đầu</TableHead>
              <TableHead className="w-35">Trạng thái</TableHead>
              <TableHead className="w-30">Thành viên</TableHead>
              <TableHead className="w-55 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {families.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  Chưa có gia đình nào
                </TableCell>
              </TableRow>
            ) : (
              families.map((family) => {
                const head = personMap.get(family.headPersonId);
                const count = members.filter(
                  (m) => m.familyId === family.id,
                ).length;

                return (
                  <TableRow
                    key={family.id}
                    className="cursor-pointer"
                    onClick={() => onEdit(family)}
                  >
                    <TableCell className="font-mono text-sm">
                      {family.familyCode}
                    </TableCell>

                    <TableCell className="font-medium">
                      {family.name}
                    </TableCell>

                    <TableCell>
                      {head ? formatPersonDisplayName(head) : "—"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={getFamilyStatusBadgeClassName(
                          family.status,
                        )}
                      >
                        {FAMILY_STATUS_LABELS[family.status] ?? "—"}
                      </span>
                    </TableCell>

                    <TableCell>{count} người</TableCell>

                    <TableCell className="text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className={actionBtn}
                          onClick={() => onEdit(family)}
                        >
                          <Pencil className="size-4" aria-hidden />
                          Sửa
                        </button>

                        <button
                          type="button"
                          className={cn(
                            actionBtn,
                            "text-destructive hover:bg-destructive/10",
                          )}
                          onClick={() => onDelete(family.id)}
                          title="Xóa"
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
      </div>
    </section>
  );
}