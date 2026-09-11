"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import type { LiturgyReflection, PublishStatus, ReflectionPayload } from "@/lib/liturgy/types";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

type AdminReflectionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingReflection?: LiturgyReflection | null;
  onSubmit: (payload: ReflectionPayload) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
};

export function AdminReflectionFormDialog({
  open,
  onOpenChange,
  editingReflection = null,
  onSubmit,
  onUploadImage,
}: AdminReflectionFormDialogProps) {
  const isEdit = Boolean(editingReflection);
  const [form, setForm] = useState<ReflectionPayload>(() =>
    editingReflection
      ? reflectionToFormState(editingReflection)
      : reflectionToFormState(createEmptyReflection()),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(
        editingReflection
          ? reflectionToFormState(editingReflection)
          : reflectionToFormState(createEmptyReflection()),
      );
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  async function handleSave() {
    if (!form.date.trim()) {
      setError("Vui lòng chọn ngày suy niệm");
      return;
    }
    if (!form.title.trim()) {
      setError("Vui lòng nhập tiêu đề suy niệm");
      return;
    }
    if (!form.content.trim()) {
      setError("Vui lòng nhập nội dung suy niệm");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        date: form.date.trim(),
        title: form.title.trim(),
        coverImage: form.coverImage || null,
        content: form.content,
        author: form.author?.trim() || undefined,
        keyPoint: form.keyPoint?.trim() || undefined,
        status: form.status,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu suy niệm");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Sửa suy niệm" : "Thêm suy niệm"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </AdminOutlineButton>
          <AdminOutlineButton
            type="button"
            className="bg-accent hover:bg-accent text-accent-foreground"
            onClick={handleSave}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Đang lưu…
              </>
            ) : (
              "Lưu"
            )}
          </AdminOutlineButton>
        </div>
      }
    >
      {open ? (
        <div className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <label className="block space-y-2 text-sm">
            <span>
              Ngày suy niệm <RequiredMark />
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
              placeholder="Tiêu đề suy niệm"
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
              onUpload={onUploadImage}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span>Tác giả</span>
              <Input
                value={form.author ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="Tên tác giả (VD: Cha xứ)"
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
      ) : null}
    </AdminFormDialog>
  );
}
