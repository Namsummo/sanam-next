"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { AdminFeastRankForm } from "@/components/admin/liturgy/admin-feast-rank-form";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminDateInput } from "@/components/admin/shared/admin-datetime-input";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { Input } from "@/components/site/shared/ui/input/input";
import { getFeastRankLabel, STATUS_LABELS } from "@/lib/liturgy/helpers";
import type {
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgySeason,
  PublishStatus,
} from "@/lib/liturgy/types";
import type { FeastPayload } from "@/lib/liturgy/types";

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

type AdminFeastFormFieldsProps = {
  editingFeast: LiturgyFeast | null;
  seasons: LiturgySeason[];
  feastRanks: LiturgyFeastRank[];
  feasts: LiturgyFeast[];
  onDeleteRankRequest: (rankId: string) => void;
};

function AdminFeastFormFields({
  editingFeast,
  seasons,
  feastRanks,
  feasts,
  onDeleteRankRequest,
}: AdminFeastFormFieldsProps) {
  const [form, setForm] = useState<FeastPayload>(() =>
    editingFeast
      ? feastToFormState(editingFeast)
      : emptyFeast(seasons[0]?.id ?? "", feastRanks[0]?.id ?? ""),
  );
  const [showRankForm, setShowRankForm] = useState(false);
  const [editingRank, setEditingRank] = useState<LiturgyFeastRank | null>(null);

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

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span>
          Tên <RequiredMark />
        </span>
        <Input
          value={form.name}
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
            onDeleteOption={onDeleteRankRequest}
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
  );
}

type AdminFeastFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFeast?: LiturgyFeast | null;
  seasons: LiturgySeason[];
  feastRanks: LiturgyFeastRank[];
  feasts: LiturgyFeast[];
};

export function AdminFeastFormDialog({
  open,
  onOpenChange,
  editingFeast = null,
  seasons,
  feastRanks,
  feasts,
}: AdminFeastFormDialogProps) {
  const isEdit = Boolean(editingFeast);
  const formKey = editingFeast?.id ?? "new";
  const [deletingRankId, setDeletingRankId] = useState<string | null>(null);

  const deletingRankLabel =
    feastRanks.find((rank) => rank.id === deletingRankId)?.label ?? "cấp độ này";

  return (
    <>
      <AdminFormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Sửa ngày lễ" : "Thêm ngày lễ"}
        footer={
          <div className="flex justify-end gap-2">
            <AdminOutlineButton onClick={() => onOpenChange(false)}>Hủy</AdminOutlineButton>
            <AdminOutlineButton className="bg-accent hover:bg-accent text-accent-foreground" onClick={() => onOpenChange(false)}>Lưu</AdminOutlineButton>
          </div>
        }
      >
        {open ? (
          <AdminFeastFormFields
            key={formKey}
            editingFeast={editingFeast}
            seasons={seasons}
            feastRanks={feastRanks}
            feasts={feasts}
            onDeleteRankRequest={setDeletingRankId}
          />
        ) : null}
      </AdminFormDialog>

      <AdminConfirmDialog
        open={deletingRankId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setDeletingRankId(null);
        }}
        title="Xóa cấp độ?"
        description={`Bạn sắp xóa “${deletingRankLabel}”. Chỉ xóa được khi không còn ngày lễ nào dùng cấp độ này.`}
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={() => setDeletingRankId(null)}
      />
    </>
  );
}
