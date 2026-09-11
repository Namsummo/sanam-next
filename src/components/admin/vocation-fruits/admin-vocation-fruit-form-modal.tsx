"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  VOCATION_TYPE_OPTIONS,
  type VocationFruitFormValues,
} from "@/components/admin/vocation-fruits/admin-vocation-fruit-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ControlledField, FieldGroup } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { AdminPersonSelector } from "@/components/admin/shared/admin-person-selector";
import type { VocationType } from "@/lib/vocation/types";

type AdminVocationFruitFormModalProps = {
  open: boolean;
  defaultValues: VocationFruitFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: VocationFruitFormValues) => void;
};

export function AdminVocationFruitFormModal({
  open,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
}: AdminVocationFruitFormModalProps) {
  const form = useForm<VocationFruitFormValues>({ defaultValues });
  const personIdValue = useWatch({ control: form.control, name: "personId" });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa hoa trái" : "Thêm hoa trái mới"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton type="button" onClick={onClose}>
            Hủy
          </AdminOutlineButton>
          <AdminOutlineButton
            type="submit"
            form="admin-vocation-fruit-form"
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {editingId ? "Lưu thay đổi" : "Thêm mới"}
          </AdminOutlineButton>
        </div>
      }
    >
      <form
        id="admin-vocation-fruit-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <FieldGroup>
          {/* Central Person Selector */}
          <AdminPersonSelector
            value={personIdValue}
            onChange={(pId) =>
              form.setValue("personId", pId, { shouldValidate: true, shouldDirty: true })
            }
            label="Chọn hồ sơ giáo dân / tu sĩ"
            required
            error={form.formState.errors.personId?.message}
          />

          <ControlledField
            control={form.control}
            name="vocationType"
            label="Nhóm ơn gọi"
            rules={{ required: "Vui lòng chọn nhóm" }}
          >
            {({ field }) => (
              <AdminSelect
                value={field.value}
                onChange={(value) => field.onChange(value as VocationType)}
                options={VOCATION_TYPE_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                placeholder="Chọn nhóm"
              />
            )}
          </ControlledField>

          <ControlledField control={form.control} name="religiousOrder" label="Dòng tu / tổ chức">
            {({ field, id }) => (
              <Input
                {...field}
                id={id}
                placeholder="Ví dụ: Hàng linh mục Giáo phận Vinh, Dòng Tên, Dòng Mến Thánh Giá..."
              />
            )}
          </ControlledField>

          <ControlledField control={form.control} name="currentAssignment" label="Nơi phục vụ hiện tại">
            {({ field, id }) => (
              <Input
                {...field}
                id={id}
                placeholder="Ví dụ: Cha Chánh Xứ Sa Nam, Giáo xứ Chính Tòa..."
              />
            )}
          </ControlledField>

          <ControlledField control={form.control} name="vocationYear" label="Năm thụ phong / tuyên khấn">
            {({ field, id }) => (
              <Input {...field} id={id} type="number" min={1900} max={2100} placeholder="2000" />
            )}
          </ControlledField>
        </FieldGroup>
      </form>
    </AdminFormDialog>
  );
}
