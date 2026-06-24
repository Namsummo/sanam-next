"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import type { WorshipVideoCategory } from "@/lib/videos/admin-worship-store";
import { slugifyCategoryName } from "@/lib/videos/admin-worship-store";

export type WorshipCategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

type AdminWorshipCategoryModalProps = {
  open: boolean;
  defaultValues: WorshipCategoryFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: WorshipCategoryFormValues) => void;
};

export function AdminWorshipCategoryModal({
  open,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
}: AdminWorshipCategoryModalProps) {
  const form = useForm<WorshipCategoryFormValues>({ defaultValues });

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
      title={editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton type="button" onClick={onClose}>
            Hủy
          </AdminOutlineButton>
          <AdminOutlineButton
            type="submit"
            form="admin-worship-category-form"
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {editingId ? "Cập nhật" : "Thêm danh mục"}
          </AdminOutlineButton>
        </div>
      }
    >
      <form
        id="admin-worship-category-form"
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Tên danh mục</span>
          <Input
            {...form.register("name", { required: true })}
            onChange={(event) => {
              const name = event.target.value;
              form.setValue("name", name);
              if (!editingId) {
                form.setValue("slug", slugifyCategoryName(name));
              }
            }}
            placeholder="Ví dụ: Thánh lễ & Sự kiện"
            className="rounded-[10px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Slug</span>
          <Input
            {...form.register("slug", { required: true })}
            placeholder="mass-event"
            className="rounded-[10px] font-mono text-sm"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Thứ tự hiển thị</span>
          <Input
            type="number"
            min={1}
            {...form.register("sortOrder", { valueAsNumber: true })}
            className="rounded-[10px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Mô tả</span>
          <Textarea
            {...form.register("description")}
            placeholder="Mô tả ngắn về danh mục..."
            className="min-h-[88px] rounded-[10px]"
          />
        </label>
      </form>
    </AdminFormDialog>
  );
}

export function mapCategoryToFormValues(
  category: WorshipVideoCategory,
): WorshipCategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    sortOrder: category.sortOrder,
  };
}
