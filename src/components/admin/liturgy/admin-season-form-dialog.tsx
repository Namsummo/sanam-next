"use client";

import { useState } from "react";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import type { LiturgySeason } from "@/lib/liturgy/types";
import { slugify } from "@/shared/lib/slugify";
import type { SeasonPayload } from "@/lib/liturgy/types";

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

type AdminSeasonFormFieldsProps = {
  editingSeason: LiturgySeason | null;
};

function AdminSeasonFormFields({ editingSeason }: AdminSeasonFormFieldsProps) {
  const [form, setForm] = useState<SeasonPayload>(() =>
    editingSeason ? seasonToFormState(editingSeason) : emptySeason(),
  );
  const [slugManual, setSlugManual] = useState(Boolean(editingSeason));

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span>
          Tên mùa <RequiredMark />
        </span>
        <Input
          value={form.name}
          placeholder="Nhập tên mùa"
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
  );
}

type AdminSeasonFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSeason?: LiturgySeason | null;
};

export function AdminSeasonFormDialog({
  open,
  onOpenChange,
  editingSeason = null,
}: AdminSeasonFormDialogProps) {
  const isEdit = Boolean(editingSeason);
  const formKey = editingSeason?.id ?? "new";

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Sửa mùa" : "Thêm mùa"}
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton onClick={() => onOpenChange(false)}>Hủy</AdminOutlineButton>
          <AdminOutlineButton className="bg-accent hover:bg-accent text-accent-foreground" onClick={() => onOpenChange(false)}>Lưu</AdminOutlineButton>
        </div>
      }
    >
      {open ? (
        <AdminSeasonFormFields key={formKey} editingSeason={editingSeason} />
      ) : null}
    </AdminFormDialog>
  );
}
