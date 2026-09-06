"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/admin/shared/image-uploader";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { BlogEditor } from "@/components/admin/shared/blog-editor";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  createEmptyReflection,
  reflectionToFormState,
  STATUS_LABELS,
} from "@/lib/liturgy/helpers";
import type { LiturgyReflection, PublishStatus } from "@/lib/liturgy/types";
import type { ReflectionPayload } from "@/lib/liturgy/types";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

type AdminReflectionFormFieldsProps = {
  editingReflection: LiturgyReflection | null;
};

function AdminReflectionFormFields({
  editingReflection,
}: AdminReflectionFormFieldsProps) {
  const [form, setForm] = useState<ReflectionPayload>(() =>
    editingReflection
      ? reflectionToFormState(editingReflection)
      : reflectionToFormState(createEmptyReflection()),
  );

  async function handleImageUpload(file: File) {
    return URL.createObjectURL(file);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span>
          Ngày suy niệm<RequiredMark />
        </span>
        <AdminDateInput
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>
          Tiêu đề <RequiredMark />
        </span>
        <Input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Tiêu đề"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span>Câu nói nổi bật</span>
        <Input
          value={form.keyPoint ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, keyPoint: e.target.value }))}
          placeholder="Một câu ngắn gợi cảm xúc hoặc ý chính…"
        />
      </label>
      <div className="space-y-2 text-sm">
        <span>Ảnh bìa</span>
        <ImageUploader
          value={form.coverImage}
          onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
          onUpload={handleImageUpload}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span>Tác giả</span>
          <Input
            value={form.author ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
            placeholder="Tên tác giả"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Trạng thái</span>
          <AdminSelect
            value={form.status}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, status: value as PublishStatus }))
            }
            options={[
              { value: "draft", label: STATUS_LABELS.draft },
              { value: "published", label: STATUS_LABELS.published },
            ]}
          />
        </label>
      </div>

      <div className="space-y-2 text-sm">
        <span>
          Nội dung <RequiredMark />
        </span>
        <BlogEditor
          content={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
        />
      </div>
    </div>
  );
}

type AdminReflectionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingReflection?: LiturgyReflection | null;
};

export function AdminReflectionFormDialog({
  open,
  onOpenChange,
  editingReflection = null,
}: AdminReflectionFormDialogProps) {
  const isEdit = Boolean(editingReflection);
  const formKey = editingReflection?.id ?? "new";

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Sửa suy niệm" : "Thêm suy niệm"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton onClick={() => onOpenChange(false)}>Hủy</AdminOutlineButton>
          <AdminOutlineButton className="bg-accent hover:bg-accent text-accent-foreground" onClick={() => onOpenChange(false)}>Lưu</AdminOutlineButton>
        </div>
      }
    >
      {open ? (
        <AdminReflectionFormFields key={formKey} editingReflection={editingReflection} />
      ) : null}
    </AdminFormDialog>
  );
}
