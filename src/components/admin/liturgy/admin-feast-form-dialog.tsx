"use client";

import { useMemo, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { AdminFeastRankForm } from "@/components/admin/liturgy/admin-feast-rank-form";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { Input } from "@/components/site/shared/ui/input/input";
import { getFeastRankLabel, STATUS_LABELS } from "@/lib/liturgy/helpers";
import type {
  FeastPayload,
  FeastRankPayload,
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgySeason,
  PublishStatus,
} from "@/lib/liturgy/types";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

function emptyFeast(seasonId = "", rankId = ""): FeastPayload {
  return {
    date: "",
    name: "",
    rankId,
    seasonId,
    status: "draft",
  };
}

function feastToFormState(feast: LiturgyFeast): FeastPayload {
  return {
    date: feast.date,
    name: feast.name,
    rankId: feast.rankId,
    seasonId: feast.seasonId,
    status: feast.status,
  };
}

type AdminFeastFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFeast?: LiturgyFeast | null;
  seasons: LiturgySeason[];
  feastRanks: LiturgyFeastRank[];
  feasts: LiturgyFeast[];
  onSubmit: (payload: FeastPayload) => Promise<void>;
  onCreateRank: (payload: FeastRankPayload) => Promise<void>;
  onUpdateRank: (id: string, payload: Partial<FeastRankPayload>) => Promise<void>;
  onDeleteRank: (id: string) => Promise<void>;
};

export function AdminFeastFormDialog({
  open,
  onOpenChange,
  editingFeast = null,
  seasons,
  feastRanks,
  feasts,
  onSubmit,
  onCreateRank,
  onUpdateRank,
  onDeleteRank,
}: AdminFeastFormDialogProps) {
  const isEdit = Boolean(editingFeast);
  const [form, setForm] = useState<FeastPayload>(() =>
    editingFeast
      ? feastToFormState(editingFeast)
      : emptyFeast(seasons[0]?.id ?? "", feastRanks[0]?.id ?? ""),
  );
  const [showRankForm, setShowRankForm] = useState(false);
  const [editingRank, setEditingRank] = useState<LiturgyFeastRank | null>(null);
  const [deletingRankId, setDeletingRankId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingRank, setDeletingRank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(
        editingFeast
          ? feastToFormState(editingFeast)
          : emptyFeast(seasons[0]?.id ?? "", feastRanks[0]?.id ?? ""),
      );
      setShowRankForm(false);
      setEditingRank(null);
      setError(null);
    }
    onOpenChange(nextOpen);
  };

  const seasonOptions = useMemo(
    () => seasons.map((season) => ({ value: season.id, label: season.name })),
    [seasons],
  );

  const feastRankOptions = useMemo(
    () =>
      feastRanks.map((rank) => ({
        value: rank.id,
        label: rank.label,
        showDelete: !feasts.some((feast) => feast.rankId === rank.id),
      })),
    [feastRanks, feasts],
  );

  async function handleSaveFeast() {
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên ngày lễ");
      return;
    }
    if (!form.date.trim()) {
      setError("Vui lòng chọn ngày diễn ra");
      return;
    }
    if (!form.seasonId) {
      setError("Vui lòng chọn mùa phụng vụ");
      return;
    }
    if (!form.rankId) {
      setError("Vui lòng chọn cấp độ lễ");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        name: form.name.trim(),
        date: form.date.trim(),
        seasonId: form.seasonId,
        rankId: form.rankId,
        status: form.status,
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu ngày lễ");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveRank(rankPayload: FeastRankPayload) {
    if (editingRank) {
      await onUpdateRank(editingRank.id, rankPayload);
    } else {
      await onCreateRank(rankPayload);
    }
    setShowRankForm(false);
    setEditingRank(null);
  }

  async function handleConfirmDeleteRank() {
    if (!deletingRankId) return;
    try {
      setDeletingRank(true);
      await onDeleteRank(deletingRankId);
      if (form.rankId === deletingRankId) {
        setForm((prev) => ({ ...prev, rankId: "" }));
      }
      setDeletingRankId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xóa cấp độ lễ");
    } finally {
      setDeletingRank(false);
    }
  }

  const deletingRankLabel =
    feastRanks.find((rank) => rank.id === deletingRankId)?.label ?? "cấp độ này";

  return (
    <>
      <AdminFormDialog
        open={open}
        onOpenChange={handleOpenChange}
        title={isEdit ? "Sửa ngày lễ" : "Thêm ngày lễ"}
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
              onClick={handleSaveFeast}
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
                Tên ngày lễ <RequiredMark />
              </span>
              <Input
                value={form.name}
                placeholder="VD: Lễ Chúa Giêsu Lên Trời"
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span>
                Ngày <RequiredMark />
              </span>
              <AdminDateInput
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span>
                Mùa <RequiredMark />
              </span>
              <AdminSelect
                value={form.seasonId}
                onChange={(value) => setForm((prev) => ({ ...prev, seasonId: value }))}
                options={seasonOptions}
                placeholder="Chọn mùa"
              />
            </label>

            <div className="space-y-2 text-sm">
              <span>
                Cấp độ <RequiredMark />
              </span>
              <div className="flex gap-2">
                <AdminSelect
                  value={form.rankId}
                  onChange={(value) => setForm((prev) => ({ ...prev, rankId: value }))}
                  options={feastRankOptions}
                  placeholder="Chọn cấp độ"
                  onAdd={() => {
                    setEditingRank(null);
                    setShowRankForm(true);
                  }}
                  addLabel="Thêm cấp độ"
                  onDeleteOption={setDeletingRankId}
                />
                {form.rankId ? (
                  <button
                    type="button"
                    title="Sửa cấp độ đã chọn"
                    aria-label="Sửa cấp độ đã chọn"
                    onClick={() => {
                      const rank = feastRanks.find((item) => item.id === form.rankId);
                      if (!rank) return;
                      setEditingRank(rank);
                      setShowRankForm(true);
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-accent hover:text-accent"
                  >
                    <Pencil className="size-4" />
                  </button>
                ) : null}
              </div>

              {showRankForm ? (
                <AdminFeastRankForm
                  key={editingRank?.id ?? "new-rank"}
                  editing={editingRank}
                  onClose={() => {
                    setShowRankForm(false);
                    setEditingRank(null);
                  }}
                  onSave={handleSaveRank}
                />
              ) : null}

              {form.rankId ? (
                <p className="text-xs text-muted-foreground">
                  Đang chọn: {getFeastRankLabel({ rankId: form.rankId }, feastRanks)}
                </p>
              ) : null}
            </div>

            <label className="block space-y-2 text-sm">
              <span>Trạng thái</span>
              <AdminSelect
                value={form.status}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    status: value as PublishStatus,
                  }))
                }
                options={[
                  { value: "draft", label: STATUS_LABELS.draft },
                  { value: "published", label: STATUS_LABELS.published },
                ]}
              />
            </label>
          </div>
        ) : null}
      </AdminFormDialog>

      <AdminConfirmDialog
        open={deletingRankId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !deletingRank) setDeletingRankId(null);
        }}
        title="Xóa cấp độ?"
        description={`Bạn sắp xóa “${deletingRankLabel}”. Chỉ xóa được khi không còn ngày lễ nào dùng cấp độ này.`}
        confirmLabel="Xóa"
        variant="danger"
        loading={deletingRank}
        onConfirm={handleConfirmDeleteRank}
      />
    </>
  );
}
