"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  EMPTY_EVENT_CATEGORY_LABEL,
  EVENT_STATUS_OPTIONS,
  getEventStatusByLabel,
  getEventStatusLabel,
  type EventFormValues,
} from "@/components/admin/events/admin-event-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import {
  AdminDateInput,
  AdminTimeInput,
} from "@/components/admin/shared/admin-datetime-input";
import { ControlledField, FieldGroup, FieldLegend, FieldSet } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { AdminEventNewCategoryForm } from "@/components/admin/events/admin-event-new-category-form";
import { getEventCategories, type ApiEventCategory } from "@/shared/services/events-api";
import { Button } from "@/components/site/shared/ui/button/button";

type AdminEventFormModalProps = {
  open: boolean;
  defaultValues: EventFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
  onUploadImage: (file: File) => Promise<string>;
};

export function AdminEventFormModal({
  open,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
  onUploadImage,
}: AdminEventFormModalProps) {
  const form = useForm<EventFormValues>({
    defaultValues,
  });

  const isFeatured = useWatch({ control: form.control, name: "isFeatured" });
  const imageValue = useWatch({ control: form.control, name: "image" });

  const [categories, setCategories] = useState<ApiEventCategory[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      getEventCategories()
        .then(setCategories)
        .catch(() => { });
    }
  }, [defaultValues, form, open]);

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat._id,
        label: cat.label,
      })),
    [categories],
  );

  const sessionUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("sanam_admin_user") || "null")
      : null;
  const isAdmin = sessionUser?.role === "admin";

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
      footer={
        <div className="flex items-center justify-end gap-3">
          <AdminOutlineButton onClick={onClose} className="uppercase font-bold h-11">Hủy</AdminOutlineButton>
          <Button
            variant="primary"
            type="submit"
            form="admin-event-form"
            showIcon={false}
            className="h-11"
          >
            {editingId ? "Lưu thay đổi" : "Tạo sự kiện"}
          </Button>
        </div>
      }
    >
      <form
        id="admin-event-form"
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <input type="hidden" {...form.register("id")} />
        <input type="hidden" {...form.register("slug")} />

        <FieldGroup>
          <ControlledField
            control={form.control}
            name="name"
            label="Tên sự kiện"
            rules={{ required: "Vui lòng nhập tên sự kiện." }}
          >
            {({ controlProps }) => (
              <Input
                {...controlProps}
                placeholder="Ví dụ: Hội chợ Gia đình Giáo xứ 2026"
              />
            )}
          </ControlledField>
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldSet>
            <FieldLegend variant="label">Thời gian bắt đầu</FieldLegend>
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
              <ControlledField
                control={form.control}
                name="startDate"
                label="Ngày"
                rules={{ required: "Vui lòng chọn ngày bắt đầu." }}
              >
                {({ controlProps }) => <AdminDateInput {...controlProps} />}
              </ControlledField>

              <ControlledField control={form.control} name="startTime" label="Giờ">
                {({ controlProps }) => <AdminTimeInput {...controlProps} />}
              </ControlledField>
            </div>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label">Thời gian kết thúc</FieldLegend>
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
              <ControlledField
                control={form.control}
                name="endDate"
                label="Ngày"
                rules={{
                  validate: (value) => {
                    if (!value) return true;
                    const startDate = form.getValues("startDate");
                    if (startDate && value < startDate) {
                      return "Ngày kết thúc không được sớm hơn ngày bắt đầu.";
                    }
                    return true;
                  },
                }}
              >
                {({ controlProps }) => <AdminDateInput {...controlProps} />}
              </ControlledField>

              <ControlledField control={form.control} name="endTime" label="Giờ">
                {({ controlProps }) => <AdminTimeInput {...controlProps} />}
              </ControlledField>
            </div>
          </FieldSet>
        </div>

        <FieldGroup>
          <ControlledField
            control={form.control}
            name="location"
            label="Địa điểm"
            rules={{ required: "Vui lòng nhập địa điểm." }}
          >
            {({ controlProps }) => (
              <Input {...controlProps} placeholder="Nhà thờ Giáo xứ Sa Nam" />
            )}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="content"
            label="Nội dung"
            rules={{ required: "Vui lòng nhập nội dung sự kiện." }}
          >
            {({ controlProps }) => (
              <Textarea
                {...controlProps}
                placeholder="Nhập nội dung sự kiện..."
                className="min-h-[300px]"
              />
            )}
          </ControlledField>
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Danh mục
            </label>
            <AdminSelect
              value={form.watch("categoryId")}
              onChange={(value) => form.setValue("categoryId", value, { shouldDirty: true })}
              options={categoryOptions}
              placeholder={EMPTY_EVENT_CATEGORY_LABEL}
              searchable={categoryOptions.length > 5}
              onAdd={isAdmin ? () => setShowNewCategory(true) : undefined}
              addLabel="Thêm danh mục mới"
            />

            {showNewCategory ? (
              <AdminEventNewCategoryForm
                onClose={() => setShowNewCategory(false)}
                onCreated={(category) => {
                  setCategories((prev) => [...prev, category]);
                  form.setValue("categoryId", category._id, { shouldDirty: true });
                  setShowNewCategory(false);
                }}
              />
            ) : null}
          </div>

          <ControlledField control={form.control} name="status" label="Trạng thái">
            {({ field, triggerProps }) => (
              <Select
                value={getEventStatusLabel(field.value)}
                onValueChange={(value) => {
                  if (!value) return;
                  const status = getEventStatusByLabel(value);
                  if (status) field.onChange(status);
                }}
              >
                <SelectTrigger {...triggerProps}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start" sideOffset={6} alignItemWithTrigger={false}>
                  {EVENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </ControlledField>
        </div>

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

        <div className="grid gap-4 md:grid-cols-2 md:items-end">
          <ControlledField control={form.control} name="isFeatured" label="Đánh dấu nổi bật">
            {({ field, id }) => (
              <label
                htmlFor={id}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-border px-3"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={field.value}
                  onChange={(changeEvent) => {
                    const checked = changeEvent.target.checked;
                    field.onChange(checked);
                    if (!checked) form.setValue("featuredOrder", "");
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  className="size-4 rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-sm text-card-foreground">Hiển thị nổi bật trên trang chủ</span>
              </label>
            )}
          </ControlledField>

          <ControlledField control={form.control} name="featuredOrder" label="Thứ tự nổi bật">
            {({ controlProps }) => (
              <Input
                {...controlProps}
                type="number"
                min={1}
                step={1}
                disabled={!isFeatured}
                placeholder="1"
              />
            )}
          </ControlledField>
        </div>
      </form>
    </AdminFormDialog>
  );
}
