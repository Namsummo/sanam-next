"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { PersonFormValues } from "./admin-person-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
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

type AdminPersonFormModalProps = {
  open: boolean;
  defaultValues: PersonFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: PersonFormValues) => void;
};

function RequiredMark() {
  return (
    <span className="text-red-500">*</span>
  );
}

export function AdminPersonFormModal({
  open,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
}: AdminPersonFormModalProps) {
  const form = useForm<PersonFormValues>({ defaultValues });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [defaultValues, form, open]);

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa hồ sơ" : "Thêm thành viên"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <AdminOutlineButton onClick={onClose}>Hủy</AdminOutlineButton>
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      }
    >
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ControlledField control={form.control} name="saintName" label="Tên thánh">
            {({ controlProps }) => <Input placeholder="Phêrô, Maria, Gioan..." {...controlProps} />}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="fullName"
            label={<>Họ và tên <RequiredMark /></>}
            rules={{ required: "Vui lòng nhập họ và tên" }}
          >
            {({ controlProps }) => <Input placeholder="Nguyễn Văn A" {...controlProps} />}
          </ControlledField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ControlledField control={form.control} name="dateOfBirth" label={<>Ngày sinh <RequiredMark /></>} rules={{ required: "Vui lòng nhập ngày sinh" }}>
            {({ controlProps }) => <AdminDateInput {...controlProps} />}
          </ControlledField>

          <ControlledField control={form.control} name="dateOfDeath" label="Ngày mất">
            {({ controlProps }) => <AdminDateInput {...controlProps} />}
          </ControlledField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ControlledField control={form.control} name="gender" label="Giới tính">
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl py-3">
                  <SelectValue placeholder="Chọn giới tính">
                    {(val: string | null) => {
                      if (val === "male") return "Nam";
                      if (val === "female") return "Nữ";
                      if (val === "other") return "Khác";
                      return val || "Chọn giới tính";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            )}
          </ControlledField>

          <ControlledField control={form.control} name="status" label="Trạng thái">
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl py-3">
                  <SelectValue placeholder="Chọn trạng thái">
                    {(val: string | null) => {
                      if (val === "active") return "Đang sinh hoạt";
                      if (val === "away") return "Xa quê";
                      if (val === "transferred") return "Chuyển xứ";
                      if (val === "deceased") return "Đã qua đời";
                      if (val === "inactive") return "Không hoạt động";
                      return val || "Chọn trạng thái";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                  <SelectItem value="active">Đang sinh hoạt</SelectItem>
                  <SelectItem value="away">Xa quê</SelectItem>
                  <SelectItem value="transferred">Chuyển xứ</SelectItem>
                  <SelectItem value="deceased">Đã qua đời</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            )}
          </ControlledField>

          <ControlledField control={form.control} name="maritalStatus" label="Hôn nhân">
            {({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-xl py-3">
                  <SelectValue placeholder="Chọn tình trạng">
                    {(val: string | null) => {
                      if (val === "single") return "Độc thân";
                      if (val === "married") return "Đã kết hôn";
                      return val || "Chọn tình trạng";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                  <SelectItem value="single">Độc thân</SelectItem>
                  <SelectItem value="married">Đã kết hôn</SelectItem>
                </SelectContent>
              </Select>
            )}
          </ControlledField>
        </div>

        <FieldSeparator>Thông tin Giáo hội</FieldSeparator>

        <ControlledField control={form.control} name="giaoHo" label="Giáo họ">
          {({ controlProps }) => <Input placeholder="Giáo họ Nhà Xứ" {...controlProps} />}
        </ControlledField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ControlledField control={form.control} name="giaoXu" label="Giáo xứ">
            {({ controlProps }) => <Input placeholder="Sa Nam" {...controlProps} />}
          </ControlledField>

          <ControlledField control={form.control} name="giaoPhan" label="Giáo phận">
            {({ controlProps }) => <Input placeholder="Phú Thọ" {...controlProps} />}
          </ControlledField>
        </div>

        <FieldSeparator>Bí tích</FieldSeparator>

        <SacramentFields form={form} prefix="baptism" label="Rửa tội" />
        <SacramentFields form={form} prefix="firstCommunion" label="Rước lễ lần đầu" />
        <SacramentFields form={form} prefix="confirmation" label="Thêm sức" />
        <SacramentFields form={form} prefix="marriage" label="Hôn phối" />

        <FieldSeparator />

        <ControlledField control={form.control} name="notes" label="Ghi chú">
          {({ controlProps }) => <Textarea rows={3} placeholder="Ghi chú thêm về người này..." {...controlProps} />}
        </ControlledField>
      </FieldGroup>
    </AdminFormDialog>
  );
}

type SacramentPrefix = "baptism" | "firstCommunion" | "confirmation" | "marriage";

function SacramentFields({
  form,
  prefix,
  label,
}: {
  form: ReturnType<typeof useForm<PersonFormValues>>;
  prefix: SacramentPrefix;
  label: string;
}) {
  const dateField = `${prefix}Date` as keyof PersonFormValues;
  const churchField = `${prefix}Church` as keyof PersonFormValues;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-card-foreground">{label}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ControlledField control={form.control} name={dateField} label="Ngày">
          {({ controlProps }) => <AdminDateInput {...controlProps} />}
        </ControlledField>
        <ControlledField control={form.control} name={churchField} label="Nhà thờ">
          {({ controlProps }) => <Input placeholder="Nhà thờ Sa Nam" {...controlProps} />}
        </ControlledField>
      </div>
    </div>
  );
}
