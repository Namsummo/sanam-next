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
import type { Person } from "@/lib/family-registry/types";
import { GENDER_LABELS, MARITAL_STATUS_LABELS, PERSON_STATUS_LABELS } from "@/lib/family-registry/constants";
import { formatDate, getPersonStatusBadgeClassName } from "@/lib/family-registry/helpers";

const actionBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

type AdminPersonsTableProps = {
  persons: Person[];
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
};

export function AdminPersonsTable({
  persons,
  onEdit,
  onDelete,
}: AdminPersonsTableProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-card-foreground">
          Danh sách hồ sơ ({persons.length})
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-2 text-center">STT</TableHead>
              <TableHead className="min-w-25">Tên thánh</TableHead>
              <TableHead className="min-w-50">Họ và tên</TableHead>
              <TableHead className="min-w-25">Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hôn nhân</TableHead>
              <TableHead>Giáo xứ</TableHead>
              <TableHead className="w-25" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {persons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Chưa có hồ sơ nào
                </TableCell>
              </TableRow>
            ) : (
              persons.map((person, index) => (
                <TableRow key={person.id}>
                  <TableCell className="px-2 py-3 text-center text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>{person.saintName || "—"}</TableCell>
                  <TableCell className="font-medium">{person.fullName}</TableCell>
                  <TableCell className="tabular-nums">{formatDate(person.dateOfBirth)}</TableCell>
                  <TableCell>{person.gender ? GENDER_LABELS[person.gender] ?? "—" : "—"}</TableCell>
                  <TableCell>
                    <span className={getPersonStatusBadgeClassName(person.status)}>
                      {PERSON_STATUS_LABELS[person.status] ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>{MARITAL_STATUS_LABELS[person.maritalStatus] ?? "—"}</TableCell>
                  <TableCell>{person.giaoXu || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <button type="button" className={actionBtn} onClick={() => onEdit(person)}>
                        <Pencil className="size-4" aria-hidden />
                        Sửa
                      </button>
                      <button type="button" className={cn(actionBtn, "text-destructive hover:bg-destructive/10")} onClick={() => onDelete(person.id)}>
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
      </div>
    </section>
  );
}
