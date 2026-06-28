"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  CLERGY_TYPE_OPTIONS,
  getClergyTypeLabel,
  type ClergyFormValues,
} from "@/components/admin/clergy/admin-clergy-form";
import { AdminClergyNewTermForm } from "@/components/admin/clergy/admin-clergy-new-term-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ControlledField, FieldGroup } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { formatCouncilTermLabel } from "@/lib/clergy/council-terms";
import type { OrganizationTerm } from "@/lib/organization/types";
import { AdminDateInput } from "../shared/admin-datetime-input";

type AdminClergyFormModalProps = {
  open: boolean;
  defaultValues: ClergyFormValues;
  editingId: string | null;
  councilTerms: OrganizationTerm[];
  onClose: () => void;
  onSubmit: (values: ClergyFormValues) => void;
  onUploadImage: (file: File) => Promise<string>;
  onTermCreated: (term: OrganizationTerm) => void;
};

export function AdminClergyFormModal({
  open,
  defaultValues,
  editingId,
  councilTerms,
  onClose,
  onSubmit,
  onUploadImage,
  onTermCreated,
}: AdminClergyFormModalProps) {
  const form = useForm<ClergyFormValues>({ defaultValues });
  const imageValue = useWatch({ control: form.control, name: "image" });
  const clergyType = useWatch({ control: form.control, name: "type" });
  const termIdValue = useWatch({ control: form.control, name: "termId" });
  const [showNewTerm, setShowNewTerm] = useState(false);

  const termOptions = useMemo(
    () =>
      councilTerms.map((term) => ({
        value: term.id,
        label: formatCouncilTermLabel(term),
      })),
    [councilTerms],
  );

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      // eslint-disable-next-line
      setShowNewTerm(false);
    }
  }, [defaultValues, form, open]);

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex items-center justify-end gap-3">
          <AdminOutlineButton onClick={onClose}>Hủy</AdminOutlineButton>
          <button
            type="submit"
            form="admin-clergy-form"
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {editingId ? "Lưu thay đổi" : "Thêm thành viên"}
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-card-foreground">
            Ảnh đại diện
          </label>
          <input type="hidden" {...form.register("image")} />
          <ImageUploader
            value={imageValue || null}
            onChange={(url) => form.setValue("image", url || "", { shouldDirty: true })}
            onUpload={onUploadImage}
          />
        </div>

        <FieldGroup>
          <ControlledField
            control={form.control}
            name="fullName"
            label="Họ và tên"
            rules={{ required: "Vui lòng nhập họ và tên." }}
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="VD: Linh mục Phaolô Nguyễn Văn A" />
            )}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="position"
            label="Chức vụ"
            rules={{ required: "Vui lòng nhập chức vụ." }}
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="VD: Cha Chánh Xứ" />
            )}
          </ControlledField>
        </FieldGroup>

        {clergyType === 1 ? (
          <>
            <ControlledField
              control={form.control}
              name="motto"
              label="Châm ngôn"
            >
              {({ controlProps }) => (
                <Input {...controlProps} placeholder="Châm ngôn sống / khẩu hiệu" />
              )}
            </ControlledField>

            <ControlledField
              control={form.control}
              name="description"
              label="Mô tả"
            >
              {({ controlProps }) => (
                <Textarea {...controlProps} placeholder="Mô tả ngắn về thành viên..." />
              )}
            </ControlledField>
          </>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <ControlledField
            control={form.control}
            name="birthday"
            label="Ngày sinh"
          >
            {({ controlProps }) => <AdminDateInput {...controlProps} />}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="ordinationDate"
            label="Ngày thụ phong"
          >
            {({ controlProps }) => <AdminDateInput {...controlProps} />}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="patronSaint"
            label="Thánh bổn mạng"
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="VD: Thánh Phaolô Tông Đồ" />
            )}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="patronDate"
            label="Ngày lễ bổn mạng"
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="VD: 29/06" />
            )}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="hometown"
            label="Quê quán / Giáo họ"
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="VD: Giáo phận Vinh" />
            )}
          </ControlledField>

          {clergyType === 2 ? (
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
          ) : (
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
          )}
        </div>

        <div className="flex flex-wrap gap-4">
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
  );
}
