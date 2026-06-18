"use client";

import { useEffect, useMemo, useState } from "react";
import { Tag, X } from "lucide-react";
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
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { getToken } from "@/lib/admin/mock-auth";
import {
  createEventCategory,
  getEventCategories,
  type ApiEventCategory,
} from "@/shared/services/events-api";

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
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [catError, setCatError] = useState("");

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      getEventCategories()
        .then(setCategories)
        .catch(() => {});
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

  const newCatAutoSlug = useMemo(
    () =>
      newCatLabel
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    [newCatLabel],
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
                if (!value) return true;
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
              <div className="mt-3 overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Tag className="size-4 text-accent" />
                    Danh mục mới
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCatLabel("");
                      setNewCatSlug("");
                      setCatError("");
                    }}
                    className="text-muted-foreground transition-colors hover:text-card-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {catError ? (
                  <div className="mx-4 mt-3 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {catError}
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      placeholder="VD: Mục vụ"
                      className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      placeholder={newCatAutoSlug || "tu-dong-theo-ten"}
                      className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
                    />
                    {!newCatSlug && newCatAutoSlug ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Slug tự động:{" "}
                        <span className="font-mono text-accent">{newCatAutoSlug}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={creatingCategory}
                      onClick={async () => {
                        const token = getToken();
                        if (!token) return;

                        const slug = newCatSlug.trim() || newCatAutoSlug;
                        if (!newCatLabel.trim() || !slug) {
                          setCatError("Vui lòng nhập tên danh mục");
                          return;
                        }

                        setCreatingCategory(true);
                        setCatError("");

                        try {
                          const cat = await createEventCategory(token, {
                            slug,
                            label: newCatLabel.trim(),
                          });
                          setCategories((prev) => [...prev, cat]);
                          form.setValue("categoryId", cat._id, { shouldDirty: true });
                          setShowNewCategory(false);
                          setNewCatLabel("");
                          setNewCatSlug("");
                        } catch (err) {
                          setCatError(
                            err instanceof Error ? err.message : "Lỗi tạo danh mục",
                          );
                        } finally {
                          setCreatingCategory(false);
                        }
                      }}
                      className="rounded-[8px] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
                    >
                      {creatingCategory ? "Đang tạo..." : "Tạo danh mục"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCatLabel("");
                        setNewCatSlug("");
                        setCatError("");
                      }}
                      className="text-sm text-muted-foreground transition-colors hover:text-card-foreground"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
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
