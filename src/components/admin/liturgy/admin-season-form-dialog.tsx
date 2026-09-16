"use client";

import { useState } from "react";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import type { LiturgySeason, SeasonPayload } from "@/lib/liturgy/types";
import { slugify } from "@/shared/lib/slugify";
import { Loader2 } from "lucide-react";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

function emptySeason(): SeasonPayload {
  return {
    name: "",
    slug: "",
    startDate: "",
    endDate: "",
    isCurrentSeason: false,
  };
}

function seasonToFormState(season: LiturgySeason): SeasonPayload {
  return {
    name: season.name,
    slug: season.slug,
    startDate: season.startDate,
    endDate: season.endDate,
    isCurrentSeason: Boolean(season.isCurrentSeason),
  };
}

type AdminSeasonFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSeason?: LiturgySeason | null;
  onSubmit: (payload: SeasonPayload) => Promise<void>;
};

export function AdminSeasonFormDialog({
  open,
  onOpenChange,
  editingSeason = null,
  onSubmit,
}: AdminSeasonFormDialogProps) {
  const isEdit = Boolean(editingSeason);
  const [form, setForm] = useState<SeasonPayload>(() =>
    editingSeason ? seasonToFormState(editingSeason) : emptySeason(),
  );
  const [slugManual, setSlugManual] = useState(Boolean(editingSeason));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens or editingSeason changes
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(editingSeason ? seasonToFormState(editingSeason) : emptySeason());
      setSlugManual(Boolean(editingSeason));
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên mùa phụng vụ");
      return;
    }
    if (!form.startDate.trim()) {
      setError("Vui lòng chọn ngày bắt đầu");
      return;
    }
    if (!form.endDate.trim()) {
      setError("Vui lòng chọn ngày kết thúc");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        name: form.name.trim(),
        slug: form.slug?.trim() || slugify(form.name),
        startDate: form.startDate.trim(),
        endDate: form.endDate.trim(),
        isCurrentSeason: form.isCurrentSeason,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu mùa phụng vụ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Sửa mùa phụng vụ" : "Thêm mùa phụng vụ"}
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
              Tên mùa <RequiredMark />
            </span>
            <Input
              value={form.name}
              placeholder="Nhập tên mùa (VD: Mùa Chay)"
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: slugManual ? prev.slug : slugify(name),
                }));
              }}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span>Slug</span>
              <Input
                value={form.slug}
                placeholder="tu-dong-theo-ten"
                onChange={(e) => {
                  setSlugManual(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
              />
            </label>

            <label className="mt-auto flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-2">
              <input
                type="checkbox"
                checked={form.isCurrentSeason}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isCurrentSeason: e.target.checked,
                  }))
                }
                className="size-4 shrink-0 accent-accent"
              />
              <span className="text-sm font-medium text-card-foreground">Mùa hiện tại</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span>
                Bắt đầu <RequiredMark />
              </span>
              <AdminDateInput
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>
                Kết thúc <RequiredMark />
              </span>
              <AdminDateInput
                value={form.endDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </label>
          </div>
        </div>
      ) : null}
    </AdminFormDialog>
  );
}
