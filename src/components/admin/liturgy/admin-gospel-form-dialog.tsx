"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/shared/image-uploader";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  createEmptyGospel,
  gospelToFormState,
  STATUS_LABELS,
} from "@/lib/liturgy/helpers";
import type { GospelPayload, LiturgyGospel, PublishStatus } from "@/lib/liturgy/types";
import { BlogEditor } from "../shared/blog-editor";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

type AdminGospelFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGospel?: LiturgyGospel | null;
  onSubmit: (payload: GospelPayload) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
};

export function AdminGospelFormDialog({
  open,
  onOpenChange,
  editingGospel = null,
  onSubmit,
  onUploadImage,
}: AdminGospelFormDialogProps) {
  const isEdit = Boolean(editingGospel);
  const [form, setForm] = useState<GospelPayload>(() =>
    editingGospel ? gospelToFormState(editingGospel) : gospelToFormState(createEmptyGospel()),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(
        editingGospel
          ? gospelToFormState(editingGospel)
          : gospelToFormState(createEmptyGospel()),
      );
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  async function handleSave() {
    if (!form.date.trim()) {
      setError("Vui lòng chọn ngày phụng vụ");
      return;
    }
    if (!form.liturgicalDayName?.trim()) {
      setError("Vui lòng nhập tên ngày phụng vụ");
      return;
    }
    if (!form.theme?.trim()) {
      setError("Vui lòng nhập đoạn chủ đề");
      return;
    }
    if (!form.firstReadingTitle.trim() || !form.firstReadingContent.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung Bài đọc I");
      return;
    }
    if (!form.gospelTitle.trim() || !form.gospelContent.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung Phúc Âm");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        date: form.date.trim(),
        liturgicalDayName: form.liturgicalDayName.trim(),
        theme: form.theme.trim(),
        coverImage: form.coverImage || null,
        firstReadingTitle: form.firstReadingTitle.trim(),
        firstReadingContent: form.firstReadingContent,
        secondReadingTitle: form.secondReadingTitle?.trim() || undefined,
        secondReadingContent: form.secondReadingContent || undefined,
        gospelTitle: form.gospelTitle.trim(),
        gospelContent: form.gospelContent,
        prayerContent: form.prayerContent || undefined,
        seasonId: form.seasonId || null,
        status: form.status,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu Lời Chúa");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Sửa lời Chúa" : "Thêm lời Chúa"}
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
              Ngày phụng vụ <RequiredMark />
            </span>
            <AdminDateInput
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span>
              Tên ngày phụng vụ <RequiredMark />
            </span>
            <Input
              value={form.liturgicalDayName ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, liturgicalDayName: e.target.value }))
              }
              placeholder="VD: Thứ Hai tuần III Thường Niên"
            />
          </label>

          <fieldset className="space-y-4 rounded-[14px] border border-border p-4">
            <label className="block space-y-2 text-sm">
              <span>
                Đoạn chủ đề <RequiredMark />
              </span>
              <Input
                value={form.theme ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, theme: e.target.value }))
                }
                placeholder="VD: Từ bỏ chính mình và vác thập giá theo Đức Giê-su"
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
          </fieldset>

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

          <fieldset className="space-y-3 rounded-[14px] border border-border p-4">
            <legend className="px-1 text-sm font-semibold">
              Bài đọc I <RequiredMark />
            </legend>
            <Input
              value={form.firstReadingTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstReadingTitle: e.target.value }))
              }
              placeholder="Tiêu đề / trích dẫn (VD: Bài trích sách ngôn sứ Giê-rê-mi-a...)"
            />
            <BlogEditor
              content={form.firstReadingContent}
              onChange={(content) =>
                setForm((prev) => ({ ...prev, firstReadingContent: content }))
              }
              className="min-h-40"
            />
          </fieldset>

          <fieldset className="space-y-3 rounded-[14px] border border-border p-4">
            <legend className="px-1 text-sm font-semibold">Bài đọc II (tuỳ chọn)</legend>
            <Input
              value={form.secondReadingTitle ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, secondReadingTitle: e.target.value }))
              }
              placeholder="Tiêu đề / trích dẫn"
            />
            <BlogEditor
              content={form.secondReadingContent ?? ""}
              onChange={(content) =>
                setForm((prev) => ({ ...prev, secondReadingContent: content }))
              }
              className="min-h-40"
            />
          </fieldset>

          <fieldset className="space-y-3 rounded-[14px] border border-border p-4">
            <legend className="px-1 text-sm font-semibold">
              Phúc Âm <RequiredMark />
            </legend>
            <Input
              value={form.gospelTitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gospelTitle: e.target.value }))
              }
              placeholder="Tiêu đề / trích dẫn (VD: Tin Mừng Chúa Giê-su Ki-tô theo thánh Mát-thêu...)"
            />
            <BlogEditor
              content={form.gospelContent}
              onChange={(content) =>
                setForm((prev) => ({ ...prev, gospelContent: content }))
              }
              className="min-h-40"
            />
          </fieldset>

          <fieldset className="space-y-3 rounded-[14px] border border-border p-4">
            <legend className="px-1 text-sm font-semibold">Lời nguyện (tuỳ chọn)</legend>
            <BlogEditor
              content={form.prayerContent ?? ""}
              onChange={(content) =>
                setForm((prev) => ({ ...prev, prayerContent: content }))
              }
              className="min-h-40"
            />
          </fieldset>
        </div>
      ) : null}
    </AdminFormDialog>
  );
}
