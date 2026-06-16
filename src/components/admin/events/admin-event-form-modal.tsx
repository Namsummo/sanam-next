"use client";

import { useEffect, useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import {
  EMPTY_EVENT_CATEGORY_LABEL,
  EVENT_STATUS_OPTIONS,
  getEventStatusByLabel,
  getEventStatusLabel,
  readImageFile,
  type EventFormValues,
} from "@/components/admin/events/admin-event-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { ControlledField, FieldGroup } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import {
  eventCategories,
  getEventCategoryIdByLabel,
  getEventCategoryLabel,
} from "@/lib/events/categories";

type AdminEventFormModalProps = {
  open: boolean;
  defaultValues: EventFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
};

export function AdminEventFormModal({
  open,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
}: AdminEventFormModalProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<EventFormValues>({
    defaultValues,
  });

  const isFeatured = useWatch({ control: form.control, name: "isFeatured" });
  const imagePreview = useWatch({ control: form.control, name: "image" });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, open]);

  function handleImageSelect(changeEvent: React.ChangeEvent<HTMLInputElement>) {
    const file = changeEvent.target.files?.[0];
    changeEvent.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("image", { message: "Vui lòng chọn file ảnh hợp lệ." });
      return;
    }

    void readImageFile(file)
      .then((dataUrl) => {
        form.setValue("image", dataUrl, { shouldDirty: true });
        form.clearErrors("image");
      })
      .catch(() => {
        form.setError("image", { message: "Không thể đọc ảnh đã chọn." });
      });
  }

  function handleRemoveImage() {
    form.setValue("image", "", { shouldDirty: true });
    form.clearErrors("image");
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={editingId ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
      footer={
        <div className="flex items-center justify-end gap-3">
          <AdminOutlineButton onClick={onClose}>Hủy</AdminOutlineButton>
          <button
            type="submit"
            form="admin-event-form"
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            {editingId ? "Lưu thay đổi" : "Tạo sự kiện"}
          </button>
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

          <ControlledField control={form.control} name="slug" label="Slug">
            {({ controlProps }) => (
              <Input
                {...controlProps}
                placeholder="Bỏ trống để tự động tạo theo tên sự kiện"
              />
            )}
          </ControlledField>
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <ControlledField
            control={form.control}
            name="startDate"
            label="Ngày bắt đầu"
            rules={{ required: "Vui lòng chọn ngày bắt đầu." }}
          >
            {({ controlProps }) => <Input {...controlProps} type="date" />}
          </ControlledField>

          <ControlledField control={form.control} name="startTime" label="Giờ bắt đầu">
            {({ controlProps }) => <Input {...controlProps} type="time" />}
          </ControlledField>

          <ControlledField
            control={form.control}
            name="endDate"
            label="Ngày kết thúc"
            rules={{
              validate: (value) => {
                if (!value) {
                  return true;
                }

                const startDate = form.getValues("startDate");
                if (startDate && value < startDate) {
                  return "Ngày kết thúc không được sớm hơn ngày bắt đầu.";
                }

                return true;
              },
            }}
          >
            {({ controlProps }) => <Input {...controlProps} type="date" />}
          </ControlledField>

          <ControlledField control={form.control} name="endTime" label="Giờ kết thúc">
            {({ controlProps }) => <Input {...controlProps} type="time" />}
          </ControlledField>
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
              <Textarea {...controlProps} placeholder="Nhập nội dung sự kiện..." />
            )}
          </ControlledField>
        </FieldGroup>

        <div className="grid gap-4 md:grid-cols-2">
          <ControlledField control={form.control} name="categoryId" label="Danh mục">
            {({ field, triggerProps }) => (
              <Select
                value={getEventCategoryLabel(field.value) ?? EMPTY_EVENT_CATEGORY_LABEL}
                onValueChange={(value) => {
                  if (!value || value === EMPTY_EVENT_CATEGORY_LABEL) {
                    field.onChange("");
                    return;
                  }

                  field.onChange(getEventCategoryIdByLabel(value) ?? "");
                }}
              >
                <SelectTrigger {...triggerProps}>
                  <SelectValue placeholder={EMPTY_EVENT_CATEGORY_LABEL} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY_EVENT_CATEGORY_LABEL}>
                    {EMPTY_EVENT_CATEGORY_LABEL}
                  </SelectItem>
                  {eventCategories.map((category) => (
                    <SelectItem key={category.id} value={category.label}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </ControlledField>

          <ControlledField control={form.control} name="status" label="Trạng thái">
            {({ field, triggerProps }) => (
              <Select
                value={getEventStatusLabel(field.value)}
                onValueChange={(value) => {
                  if (!value) {
                    return;
                  }

                  const status = getEventStatusByLabel(value);
                  if (status) {
                    field.onChange(status);
                  }
                }}
              >
                <SelectTrigger {...triggerProps}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
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
          <span className="mb-1 block text-sm font-medium text-card-foreground">
            Ảnh đại diện
          </span>
          <input type="hidden" {...form.register("image")} />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Chọn ảnh đại diện từ máy"
            onChange={handleImageSelect}
          />
          <div className="flex flex-wrap items-start gap-3">
            <AdminOutlineButton
              className="h-11 px-4"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImagePlus className="size-4" aria-hidden />
              Chọn ảnh từ máy
            </AdminOutlineButton>
            {imagePreview ? (
              <AdminOutlineButton
                className="text-destructive hover:bg-destructive/10"
                onClick={handleRemoveImage}
              >
                <Trash2 className="size-4" aria-hidden />
                Xóa ảnh
              </AdminOutlineButton>
            ) : null}
          </div>
          {imagePreview ? (
            <div className="relative mt-3 h-40 w-full overflow-hidden rounded-[10px] border border-border">
              <Image
                src={imagePreview}
                alt="Xem trước ảnh đại diện"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized={imagePreview.startsWith("data:")}
              />
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">Chưa chọn ảnh.</p>
          )}
          {form.formState.errors.image ? (
            <p className="mt-2 text-sm text-destructive">
              {form.formState.errors.image.message}
            </p>
          ) : null}
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
                    if (!checked) {
                      form.setValue("featuredOrder", "");
                    }
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
