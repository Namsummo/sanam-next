"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AdminFormDialog,
} from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getAdminMassSchedule,
  createMassEntry,
  updateMassEntry,
  deleteMassEntry,
  type ApiMassEntry,
  type MassScheduleGrouped,
  type DayType,
} from "@/shared/services/mass-schedule-api";
const DAY_TYPE_LABELS: Record<DayType, string> = {
  monday: "Thứ Hai",
  tuesday: "Thứ Ba",
  wednesday: "Thứ Tư",
  thursday: "Thứ Năm",
  friday: "Thứ Sáu",
  saturday: "Thứ Bảy",
  sunday: "Chủ Nhật",
};

const DAY_TYPE_OPTIONS = [
  { value: "monday", label: "Thứ Hai" },
  { value: "tuesday", label: "Thứ Ba" },
  { value: "wednesday", label: "Thứ Tư" },
  { value: "thursday", label: "Thứ Năm" },
  { value: "friday", label: "Thứ Sáu" },
  { value: "saturday", label: "Thứ Bảy" },
  { value: "sunday", label: "Chủ Nhật" },
] as const;

type FormMode = "create" | "edit";

type FormData = {
  dayType: DayType;
  time: string;
  title: string;
};

const emptyForm: FormData = {
  dayType: "monday",
  time: "",
  title: "",
};

function groupEntries(entries: ApiMassEntry[]): MassScheduleGrouped {
  return {
    monday: entries.filter((e) => e.dayType === "monday"),
    tuesday: entries.filter((e) => e.dayType === "tuesday"),
    wednesday: entries.filter((e) => e.dayType === "wednesday"),
    thursday: entries.filter((e) => e.dayType === "thursday"),
    friday: entries.filter((e) => e.dayType === "friday"),
    saturday: entries.filter((e) => e.dayType === "saturday"),
    sunday: entries.filter((e) => e.dayType === "sunday"),
  };
}

export function AdminMassScheduleManager() {
  const router = useRouter();
  const [allEntries, setAllEntries] = useState<ApiMassEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState("");

  const grouped = groupEntries(allEntries);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAccessToken();
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminMassSchedule(token);
        if (!cancelled) {
          setAllEntries([
            ...data.monday,
            ...data.tuesday,
            ...data.wednesday,
            ...data.thursday,
            ...data.friday,
            ...data.saturday,
            ...data.sunday,
          ]);
        }
      } catch {
        if (!cancelled) {
          setError("Không thể tải dữ liệu lịch thánh lễ");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [router]);

  function openCreate(dayType?: DayType) {
    setFormMode("create");
    setEditingId(null);
    setFormData({ ...emptyForm, dayType: dayType ?? "monday" });
    setFormOpen(true);
  }

  function openEdit(entry: ApiMassEntry) {
    setFormMode("edit");
    setEditingId(entry._id);
    setFormData({
      dayType: entry.dayType,
      time: entry.time,
      title: entry.title,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSave() {
    if (!formData.time) {
      setError("Vui lòng nhập giờ lễ");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (formMode === "edit" && editingId) {
        const updated = await updateMassEntry(token, editingId, {
          dayType: formData.dayType,
          time: formData.time,
          title: formData.title,
        });
        setAllEntries((prev) =>
          prev.map((e) => (e._id === editingId ? updated : e)),
        );
      } else {
        const created = await createMassEntry(token, {
          dayType: formData.dayType,
          time: formData.time,
          title: formData.title || undefined,
        });
        setAllEntries((prev) => [...prev, created]);
      }
      closeForm();
    } catch {
      setError("Không thể lưu lịch lễ");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(entry: ApiMassEntry) {
    setDeletingId(entry._id);
    setDeletingLabel(`${entry.time}${entry.title ? ` (${entry.title})` : ""}`);
    setDeleteConfirmOpen(true);
  }

  async function handleDelete() {
    if (!deletingId) return;

    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      await deleteMassEntry(token, deletingId);
      setAllEntries((prev) => prev.filter((e) => e._id !== deletingId));
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    } catch {
      setError("Không thể xóa lịch lễ");
    }
  }

  function renderSection(
    dayType: DayType,
    entries: ApiMassEntry[],
  ) {
    return (
      <section
        key={dayType}
        className="rounded-[20px] border border-border bg-card"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-5">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-card-foreground">
              {DAY_TYPE_LABELS[dayType]}
            </h3>
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {entries.length}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            onClick={() => openCreate(dayType)}
          >
            <Plus className="size-3.5" aria-hidden />
            Thêm
          </button>
        </div>

        <div className="divide-y divide-border">
          {entries.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground md:px-5">
              Chưa có lịch lễ nào. Nhấn &ldquo;Thêm&rdquo; để tạo mới.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between gap-3 px-4 py-3 md:px-5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-card-foreground">
                    {entry.time}
                  </span>
                  {entry.title ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      {entry.title}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                    onClick={() => openEdit(entry)}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => confirmDelete(entry)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về Tổng quan
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-card-foreground">
              Lịch Thánh Lễ
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cấu hình giờ lễ theo các ngày trong tuần.
            </p>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
        </div>
      </div>
 
      <div className="mt-6 space-y-5">
        {renderSection("monday", grouped.monday)}
        {renderSection("tuesday", grouped.tuesday)}
        {renderSection("wednesday", grouped.wednesday)}
        {renderSection("thursday", grouped.thursday)}
        {renderSection("friday", grouped.friday)}
        {renderSection("saturday", grouped.saturday)}
        {renderSection("sunday", grouped.sunday)}
      </div>
 
      <AdminFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        title={formMode === "create" ? "Thêm giờ lễ" : "Sửa giờ lễ"}
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            <AdminOutlineButton onClick={closeForm} disabled={saving}>
              Hủy
            </AdminOutlineButton>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex h-9 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : formMode === "create" ? "Thêm" : "Lưu"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-card-foreground">
              Ngày trong tuần
            </span>
            <Select
              value={formData.dayType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  dayType: value as DayType,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngày">
                  {(value: string) =>
                    DAY_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ??
                    "Chọn ngày"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DAY_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-card-foreground">
              Giờ lễ <span className="text-destructive">*</span>
            </span>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, time: e.target.value }))
              }
              placeholder="VD: 05:30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-card-foreground">
              Tiêu đề (tùy chọn)
            </span>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="VD: Giới trẻ, Thiếu nhi..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Ví dụ: &quot;Giới trẻ&quot;, &quot;Thiếu nhi&quot;
            </p>
          </label>
        </div>
      </AdminFormDialog>

      <AdminConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa giờ lễ"
        description={`Bạn có chắc muốn xóa giờ lễ "${deletingLabel}"?`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
