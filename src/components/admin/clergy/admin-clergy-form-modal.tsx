"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CLERGY_TYPE_OPTIONS,
  getClergyTypeLabel,
  type ClergyFormValues,
} from "@/components/admin/clergy/admin-clergy-form";
import { AdminClergyNewTermForm } from "@/components/admin/clergy/admin-clergy-new-term-form";
import { AdminPersonFormModal } from "@/components/admin/family-registry/admin-person-form-modal";
import {
  createEmptyPersonFormValues,
  formValuesToPerson,
  type PersonFormValues,
} from "@/components/admin/family-registry/admin-person-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ControlledField } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { formatCouncilTermLabel } from "@/lib/clergy/council-terms";
import { formatPersonDisplayName } from "@/lib/family-registry/helpers";
import type { Person } from "@/lib/family-registry/types";
import type { OrganizationTerm } from "@/lib/organization/types";
import { getAccessToken } from "@/lib/admin/auth-session";
import { createPerson } from "@/shared/services/family-registry-api";
import { AdminDateInput } from "../shared/admin-datetime-input";


function RequiredMark() {
  return <span className="text-red-500">*</span>;
}

function getPersonRecordId(person: Person): string {
  return person.id || (person as Person & { _id?: string })._id || "";
}

function formatPersonParish(person: Person): string | undefined {
  const parts = [person.giaoHo, person.giaoXu].filter(
    (part): part is string => Boolean(part?.trim()),
  );
  return parts.length > 0 ? parts.join(" - ") : undefined;
}

type AdminClergyFormModalProps = {
  open: boolean;
  defaultValues: ClergyFormValues;
  editingId: string | null;
  councilTerms: OrganizationTerm[];
  persons: Person[];
  onClose: () => void;
  onSubmit: (values: ClergyFormValues) => void;
  onUploadImage?: (file: File) => Promise<string>;
  onTermCreated: (term: OrganizationTerm) => void;
  onPersonCreated?: (person: Person) => void;
};

export function AdminClergyFormModal({
  open,
  defaultValues,
  editingId,
  councilTerms,
  persons,
  onClose,
  onSubmit,
  onUploadImage,
  onTermCreated,
  onPersonCreated,
}: AdminClergyFormModalProps) {
  const form = useForm<ClergyFormValues>({ defaultValues });
  const clergyType = useWatch({ control: form.control, name: "type" });
  const termIdValue = useWatch({ control: form.control, name: "termId" });
  const [showNewTerm, setShowNewTerm] = useState(false);
  const [showNewPerson, setShowNewPerson] = useState(false);
  const [creatingPerson, setCreatingPerson] = useState(false);
  const [personCreateError, setPersonCreateError] = useState<string | null>(null);

  const termOptions = useMemo(
    () =>
      councilTerms.map((term) => ({
        value: term.id,
        label: formatCouncilTermLabel(term),
      })),
    [councilTerms],
  );

  const personOptions = useMemo(
    () =>
      persons
        .map((person) => ({
          value: getPersonRecordId(person),
          label: formatPersonDisplayName(person),
          description: formatPersonParish(person),
          image:
            typeof person.profileImage === "string" && person.profileImage.trim()
              ? person.profileImage
              : null,
        }))
        .filter((option) => option.value),
    [persons],
  );

  async function handleCreatePerson(values: PersonFormValues) {
    const token = getAccessToken();
    if (!token) {
      setPersonCreateError("Bạn chưa đăng nhập.");
      return;
    }

    try {
      setCreatingPerson(true);
      setPersonCreateError(null);
      const created = await createPerson(token, formValuesToPerson(values));
      onPersonCreated?.(created);
      form.setValue("personId", getPersonRecordId(created), {
        shouldDirty: true,
        shouldValidate: true,
      });
      setShowNewPerson(false);
    } catch (err) {
      setPersonCreateError(
        err instanceof Error ? err.message : "Không tạo được hồ sơ giáo dân.",
      );
    } finally {
      setCreatingPerson(false);
    }
  }

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      // eslint-disable-next-line
      setShowNewTerm(false);
      setShowNewPerson(false);
      setPersonCreateError(null);
    }
  }, [defaultValues, form, open]);

  return (
    <>
      <AdminFormDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && (showNewPerson || showNewTerm)) return;
          if (!nextOpen) onClose();
        }}
        title={editingId ? "Chỉnh sửa chức vụ / nhiệm kỳ" : "Thêm vào Quý Cha / Ban Hành Giáo"}
        className="sm:max-w-3xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminOutlineButton onClick={onClose}>Hủy</AdminOutlineButton>
            <button
              type="submit"
              form="admin-clergy-form"
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              {editingId ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        }
      >
        <form
          id="admin-clergy-form"
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" {...form.register("id")} />
          <input type="hidden" {...form.register("sortOrder")} />

          <div className="grid gap-4 sm:grid-cols-2">
            <ControlledField
              control={form.control}
              name="type"
              label="Phân loại"
              rules={{ required: "Vui lòng chọn phân loại." }}
            >
              {({ field, triggerProps }) => (
                <Select
                  value={getClergyTypeLabel(field.value)}
                  onValueChange={(value) => {
                    const opt = CLERGY_TYPE_OPTIONS.find((o) => o.label === value);
                    if (opt) field.onChange(opt.value);
                  }}
                >
                  <SelectTrigger {...triggerProps}>
                    <SelectValue placeholder="Chọn phân loại" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                    {CLERGY_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.label}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </ControlledField>

            <ControlledField
              control={form.control}
              name="position"
              label={<><span>Chức vụ đảm nhiệm</span> <RequiredMark /></>}
              rules={{ required: "Vui lòng nhập chức vụ." }}
            >
              {({ controlProps }) => (
                <Input {...controlProps} placeholder="VD: Cha Chánh Xứ, Trùm Chánh..." />
              )}
            </ControlledField>
          </div>

          <ControlledField
            control={form.control}
            name="personId"
            label={
              <><span>Chọn thành viên</span> <RequiredMark /></>
            }

            rules={{ required: "Vui lòng chọn thành viên trong giáo xứ." }}
          >
            {({ field }) => (
              <AdminSelect
                value={field.value}
                onChange={field.onChange}
                options={personOptions}
                placeholder="Chọn thành viên trong giáo xứ"
                contentClassName="max-h-60"
                searchable
                onAdd={() => {
                  setPersonCreateError(null);
                  setShowNewPerson(true);
                }}
                addLabel="Tạo giáo dân mới"
              />
            )}
          </ControlledField>

          {personCreateError ? (
            <p className="text-sm text-destructive">{personCreateError}</p>
          ) : null}

          {clergyType === 1 ? (
            <>
              <ControlledField
                control={form.control}
                name="ordinationDate"
                label="Ngày thụ phong Linh mục"
              >
                {({ controlProps }) => <AdminDateInput {...controlProps} />}
              </ControlledField>

              <ControlledField
                control={form.control}
                name="motto"
                label="Châm ngôn sống"
              >
                {({ controlProps }) => (
                  <Input {...controlProps} placeholder="Châm ngôn sống / khẩu hiệu" />
                )}
              </ControlledField>

              <ControlledField
                control={form.control}
                name="description"
                label="Mô tả / Tiểu sử phục vụ"
              >
                {({ controlProps }) => (
                  <Textarea {...controlProps} placeholder="Mô tả ngắn về quá trình phục vụ..." />
                )}
              </ControlledField>

              <ControlledField
                control={form.control}
                name="termId"
                label="Thời gian phục vụ (Linh mục)"
              >
                {({ controlProps }) => (
                  <Input
                    {...controlProps}
                    placeholder="VD: 2018–nay, 2022–2024 (Phó xứ)..."
                  />
                )}
              </ControlledField>
            </>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">
                Nhiệm kỳ (Ban Hành Giáo)
              </label>
              <AdminSelect
                value={termIdValue || ""}
                onChange={(value) =>
                  form.setValue("termId", value, { shouldDirty: true })
                }
                options={termOptions}
                placeholder="Chọn nhiệm kỳ"
                searchable={termOptions.length > 5}
                onAdd={() => setShowNewTerm(true)}
                addLabel="Thêm nhiệm kỳ mới"
              />

              {showNewTerm ? (
                <AdminClergyNewTermForm
                  existingTermIds={councilTerms.map((term) => term.id)}
                  onClose={() => setShowNewTerm(false)}
                  onCreated={(term) => {
                    onTermCreated(term);
                    form.setValue("termId", term.id, { shouldDirty: true });
                    setShowNewTerm(false);
                  }}
                />
              ) : null}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <ControlledField
              control={form.control}
              name="isVisible"
              label="Trạng thái hiển thị"
            >
              {({ field, id }) => (
                <label
                  htmlFor={id}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-border px-3"
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={field.value}
                    onChange={(changeEvent) => field.onChange(changeEvent.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="size-4 rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">Hiển thị hồ sơ</span>
                </label>
              )}
            </ControlledField>

            {clergyType === 2 && (
              <ControlledField
                control={form.control}
                name="showOnHomepage"
                label="Hiển thị ở homepage"
              >
                {({ field, id }) => (
                  <label
                    htmlFor={id}
                    className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-border px-3"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={field.value}
                      onChange={(changeEvent) => field.onChange(changeEvent.target.checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      className="size-4 rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className="text-sm text-card-foreground">Hiển thị ở mục Đương nhiệm trang chủ</span>
                  </label>
                )}
              </ControlledField>
            )}
          </div>
        </form>
      </AdminFormDialog>

      <AdminPersonFormModal
        open={showNewPerson}
        defaultValues={createEmptyPersonFormValues()}
        editingId={null}
        onClose={() => {
          if (!creatingPerson) setShowNewPerson(false);
        }}
        onSubmit={handleCreatePerson}
        onUploadImage={onUploadImage}
      />
    </>
  );
}

