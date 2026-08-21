"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { FamilyFormValues, MemberEntry } from "./admin-family-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ControlledField, FieldGroup, FieldSeparator } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import type { Person, FamilyMemberRole } from "@/lib/family-registry/types";
import {
  FAMILY_MEMBER_ROLE_LABELS,
  PERSON_STATUS_LABELS,
} from "@/lib/family-registry/constants";
import { formatPersonDisplayName } from "@/lib/family-registry/helpers";
import { cn } from "@/lib/utils";

type AdminFamilyFormModalProps = {
  open: boolean;
  defaultValues: FamilyFormValues;
  editingId: string | null;
  persons: Person[];
  onClose: () => void;
  onSubmit: (values: FamilyFormValues) => void;
};

function RequiredMark() {
  return (
    <span className="text-red-500">*</span>
  );
}

export function AdminFamilyFormModal({
  open,
  defaultValues,
  editingId,
  persons,
  onClose,
  onSubmit,
}: AdminFamilyFormModalProps) {
  const form = useForm<FamilyFormValues>({ defaultValues });
  const [memberEntries, setMemberEntries] = useState<MemberEntry[]>([]);

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      setTimeout(() => {
        setMemberEntries(defaultValues.members);
      }, 0);
    }
  }, [defaultValues, form, open]);

  const personOptions = persons.map((p) => ({
    value: p.id,
    label: formatPersonDisplayName(p),
  }));

  const personMap = new Map(persons.map((p) => [p.id, p]));

  function handleAddMember() {
    setMemberEntries((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        personId: "",
        role: "child",
        birthOrder: null,
      },
    ]);
  }

  function updateMember(tempId: string, patch: Partial<MemberEntry>) {
    setMemberEntries((prev) =>
      prev.map((m) => (m.tempId === tempId ? { ...m, ...patch } : m)),
    );
  }

  function removeMember(tempId: string) {
    setMemberEntries((prev) => prev.filter((m) => m.tempId !== tempId));
  }

  function handleFinalSubmit() {
    form.handleSubmit((values) => {
      onSubmit({ ...values, members: memberEntries });
    })();
  }

  function isRoleDisabled(role: FamilyMemberRole, currentTempId: string): boolean {
    if (role === "husband") {
      return memberEntries.some((m) => m.role === "husband" && m.tempId !== currentTempId);
    }
    if (role === "wife") {
      return memberEntries.some((m) => m.role === "wife" && m.tempId !== currentTempId);
    }
    return false;
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa gia đình" : "Thêm gia đình mới"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <AdminOutlineButton onClick={onClose}>Hủy</AdminOutlineButton>
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      }
    >
      <FieldGroup>
        <ControlledField
          control={form.control}
          name="name"
          label={<>Tên gia đình <RequiredMark /></>}
          rules={{ required: "Vui lòng nhập tên gia đình" }}
        >
          {({ controlProps }) => (
            <Input placeholder="Gia đình Nguyễn Văn A" {...controlProps} />
          )}
        </ControlledField>

        <ControlledField
          control={form.control}
          name="headPersonId"
          label={<>Người đứng đầu <RequiredMark /></>}
          rules={{ required: "Vui lòng chọn người đứng đầu" }}
        >
          {({ field }) => (
            <AdminSelect
              value={field.value}
              onChange={field.onChange}
              options={personOptions}
              placeholder="Chọn người đứng đầu"
              searchable
            />
          )}
        </ControlledField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ControlledField control={form.control} name="status" label="Trạng thái gia đình">
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl py-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                  <SelectItem value="active">Đang sinh hoạt</SelectItem>
                  <SelectItem value="away">Xa quê</SelectItem>
                  <SelectItem value="transferred">Chuyển xứ</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            )}
          </ControlledField>

          <ControlledField control={form.control} name="statusNote" label="Ghi chú trạng thái">
            {({ controlProps }) => (
              <Input placeholder="Ghi chú thêm về trạng thái..." {...controlProps} />
            )}
          </ControlledField>
        </div>

        <ControlledField control={form.control} name="notes" label="Ghi chú">
          {({ controlProps }) => (
            <Textarea rows={2} placeholder="Ghi chú về gia đình..." {...controlProps} />
          )}
        </ControlledField>

        <FieldSeparator>Thành viên gia đình</FieldSeparator>

        {memberEntries.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Chưa có thành viên nào. Nhấn &quot;Thêm thành viên&quot; để bắt đầu.
          </p>
        ) : (
          <div className="space-y-3">
            {memberEntries.map((entry, idx) => {
              const person = personMap.get(entry.personId);
              return (
                <div
                  key={entry.tempId}
                  className="rounded-xl border border-border bg-muted/30 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Thành viên {idx + 1}
                      {person ? ` — ${formatPersonDisplayName(person)}` : ""}
                      {person && person.status !== "active" && (
                        <span className={cn(
                          "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          person.status === "away" && "bg-amber-100 text-amber-700",
                          person.status === "transferred" && "bg-blue-100 text-blue-700",
                          person.status === "deceased" && "bg-gray-100 text-gray-600",
                          person.status === "inactive" && "bg-gray-100 text-gray-500",
                        )}>
                          {PERSON_STATUS_LABELS[person.status]}
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(entry.tempId)}
                      className="inline-flex h-7 items-center gap-1 rounded-lg border border-border bg-card px-2 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-3" />
                      Xóa
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Chọn người */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">
                        Thành viên <RequiredMark />
                      </label>
                      <AdminSelect
                        value={entry.personId}
                        onChange={(v) => updateMember(entry.tempId, { personId: v })}
                        options={personOptions}
                        placeholder="Chọn người..."
                        searchable
                      />
                    </div>

                    {/* Vai trò */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">
                        Vai trò  <RequiredMark />
                      </label>
                      <Select
                        value={entry.role}
                        onValueChange={(v) => {
                          const role = v as FamilyMemberRole;
                          updateMember(entry.tempId, {
                            role,
                            birthOrder: role === "child" ? entry.birthOrder : null,
                          });
                        }}
                      >
                        <SelectTrigger className="rounded-xl py-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                          {Object.entries(FAMILY_MEMBER_ROLE_LABELS).map(([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              disabled={isRoleDisabled(value as FamilyMemberRole, entry.tempId)}
                            >
                              {label}
                              {isRoleDisabled(value as FamilyMemberRole, entry.tempId)
                                ? " (đã có)"
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Thứ tự con — chỉ hiện khi role = child */}
                    {entry.role === "child" && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">
                          Thứ tự con
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={entry.birthOrder ?? ""}
                          onChange={(e) =>
                            updateMember(entry.tempId, {
                              birthOrder: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          placeholder="1 = con cả, 2 = con thứ 2..."
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddMember}
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-accent hover:text-accent"
        >
          <Plus className="size-4" />
          Thêm thành viên
        </button>
      </FieldGroup>
    </AdminFormDialog>
  );
}
