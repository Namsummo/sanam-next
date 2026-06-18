/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import {
  createEmptyClergyFormValues,
  mapClergyToFormValues,
  type ClergyFormValues,
} from "@/components/admin/clergy/admin-clergy-form";
import { AdminClergyFormModal } from "@/components/admin/clergy/admin-clergy-form-modal";
import { AdminClergyTable } from "@/components/admin/clergy/admin-clergy-table";
import { getToken } from "@/lib/admin/mock-auth";
import {
  createClergy,
  deleteClergy,
  getAllClergy,
  toClergyMember,
  updateClergy,
  toggleClergyVisibility,
} from "@/shared/services/clergy-api";
import { uploadEventImage } from "@/shared/services/events-api";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import type { ClergyMember } from "@/lib/clergy/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export function AdminClergyManager() {
  const router = useRouter();
  const [members, setMembers] = useState<ClergyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<ClergyFormValues>(() => createEmptyClergyFormValues());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "priest" | "council">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClergyMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMembers = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getAllClergy(token, {});
      setMembers(res.members.map(toClergyMember));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clergy members");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...members]
      .filter((member) => {
        if (typeFilter === "priest" && member.type !== 1) return false;
        if (typeFilter === "council" && member.type !== 2) return false;

        if (!normalizedQuery) return true;

        const searchable = [
          member.fullName,
          member.position,
          member.hometown ?? "",
          member.patronSaint ?? "",
          member.termId ?? "",
        ].join(" ");

        return searchable.toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  }, [members, searchQuery, typeFilter]);

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormDefaults(createEmptyClergyFormValues());
  }

  function openCreateForm() {
    const nextSortOrder =
      members.length > 0
        ? Math.max(...members.map((m) => m.sortOrder ?? 0)) + 1
        : 1;
    setFormDefaults({
      ...createEmptyClergyFormValues(),
      sortOrder: String(nextSortOrder),
    });
    setEditingId(null);
    setFormOpen(true);
  }

  function handleEdit(member: ClergyMember) {
    setFormDefaults(mapClergyToFormValues(member));
    setEditingId(String(member.id));
    setFormOpen(true);
  }

  function handleDelete(memberId: string) {
    const target = members.find((m) => String(m.id) === memberId);
    if (target) setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const memberId = String(deleteTarget.id);
    try {
      setDeleting(true);
      await deleteClergy(token, memberId);
      setMembers((current) => current.filter((m) => String(m.id) !== memberId));
      if (editingId === memberId) closeForm();
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete member");
    } finally {
      setDeleting(false);
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadEventImage(token, file);
  }

  async function handleToggleVisibility(memberId: string) {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const result = await toggleClergyVisibility(token, memberId);
      setMembers((current) =>
        current.map((m) =>
          String(m.id) === memberId ? { ...m, isVisible: result.isVisible } : m,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle visibility");
    }
  }

  async function handleFormSubmit(values: ClergyFormValues) {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const data = {
        type: values.type,
        fullName: values.fullName.trim(),
        position: values.position.trim(),
        motto: values.motto.trim() || undefined,
        description: values.description.trim() || undefined,
        birthday: values.birthday.trim() || undefined,
        sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
        isVisible: values.isVisible,
        image: values.image.trim() || undefined,
        ordinationDate: values.ordinationDate.trim() || undefined,
        patronSaint: values.patronSaint.trim() || undefined,
        patronDate: values.patronDate.trim() || undefined,
        hometown: values.hometown.trim() || undefined,
        termId: values.termId.trim() || undefined,
      };

      if (editingId) {
        const updated = await updateClergy(token, editingId, data);
        setMembers((current) =>
          current.map((m) => (String(m.id) === editingId ? toClergyMember(updated) : m)),
        );
      } else {
        const created = await createClergy(token, data);
        setMembers((current) => [toClergyMember(created), ...current]);
      }

      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save member");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
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
              Quý Cha & Ban Hành Giáo
            </h1>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
          <button type="button" className={actionButtonClassName} onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Thêm thành viên
          </button>
        </div>
      </div>

      <AdminClergyTable
        members={filteredMembers}
        editingId={editingId}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        onSearchQueryChange={setSearchQuery}
        onTypeFilterChange={setTypeFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />

      <AdminClergyFormModal
        open={formOpen}
        defaultValues={formDefaults}
        editingId={editingId}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        onUploadImage={handleUploadImage}
      />

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Xóa thành viên"
        description={`Bạn có chắc chắn muốn xóa "${deleteTarget?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
