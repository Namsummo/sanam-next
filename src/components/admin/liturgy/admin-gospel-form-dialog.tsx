"use client";

import { useState } from "react";
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
import type { LiturgyGospel, PublishStatus } from "@/lib/liturgy/types";
import type { GospelPayload } from "@/lib/liturgy/types";
import { BlogEditor } from "../shared/blog-editor";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

type AdminGospelFormFieldsProps = {
  editingGospel: LiturgyGospel | null;
};

function AdminGospelFormFields({ editingGospel }: AdminGospelFormFieldsProps) {
  const [form, setForm] = useState<GospelPayload>(() =>
    editingGospel ? gospelToFormState(editingGospel) : gospelToFormState(createEmptyGospel()),
  );

  async function handleImageUpload(file: File) {
    return URL.createObjectURL(file);
  }

  return (
    <div className="space-y-4">
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
        <span>Tên ngày phụng vụ <RequiredMark /></span>
        <Input
          value={form.liturgicalDayName ?? ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, liturgicalDayName: e.target.value }))
          }
          placeholder="Thứ Hai tuần III Thường Niên"
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
            placeholder="Đoạn chủ đề"
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
        <legend className="px-1 text-sm font-semibold">Bài đọc I</legend>
        <Input
          value={form.firstReadingTitle}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, firstReadingTitle: e.target.value }))
          }
          placeholder="Tiêu đề / trích dẫn"
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
        <legend className="px-1 text-sm font-semibold">Phúc Âm</legend>
        <Input
          value={form.gospelTitle}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, gospelTitle: e.target.value }))
          }
          placeholder="Tiêu đề / trích dẫn"
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
  );
}

type AdminGospelFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGospel?: LiturgyGospel | null;
};

export function AdminGospelFormDialog({
  open,
  onOpenChange,
  editingGospel = null,
}: AdminGospelFormDialogProps) {
  const isEdit = Boolean(editingGospel);
  const formKey = editingGospel?.id ?? "new";

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Sửa lời Chúa" : "Thêm lời Chúa"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton onClick={() => onOpenChange(false)}>Hủy</AdminOutlineButton>
          <AdminOutlineButton className="bg-accent hover:bg-accent text-accent-foreground" onClick={() => onOpenChange(false)}>Lưu</AdminOutlineButton>
        </div>
      }
    >
      {open ? (
        <AdminGospelFormFields key={formKey} editingGospel={editingGospel} />
      ) : null}
    </AdminFormDialog>
  );
}
