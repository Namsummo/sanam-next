"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { AdminOrganizationsTable } from "./admin-organizations-table";
import {
  getAdminOrganizations,
  deleteOrganization,
  toggleOrganizationVisibility,
} from "@/lib/organization/api";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import type { Organization } from "@/lib/organization/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export function AdminOrganizationsManager() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrganizations();
      setOrganizations(res.organizations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const filteredOrganizations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...organizations].filter((org) => {
      if (!normalizedQuery) return true;

      const searchable = [org.name, org.slug].join(" ");
      return searchable.toLowerCase().includes(normalizedQuery);
    });
  }, [organizations, searchQuery]);

  function openCreateForm() {
    router.push("/admin/organizations/create");
  }

  function handleEdit(organization: Organization) {
    router.push(`/admin/organizations/${organization._id}/edit`);
  }

  function handleDelete(organizationId: string) {
    const target = organizations.find((o) => o._id === organizationId);
    if (target) setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const organizationId = deleteTarget._id;
    try {
      setDeleting(true);
      await deleteOrganization(organizationId);
      setOrganizations((current) => current.filter((o) => o._id !== organizationId));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete organization");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleVisibility(organizationId: string) {
    try {
      const result = await toggleOrganizationVisibility(organizationId);
      setOrganizations((current) =>
        current.map((o) =>
          o._id === organizationId ? { ...o, isVisible: result.isVisible } : o,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle visibility");
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
              Đoàn thể và Hội đoàn
            </h1>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
          <button type="button" className={actionButtonClassName} onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Thêm đoàn thể
          </button>
        </div>
      </div>

      <AdminOrganizationsTable
        organizations={filteredOrganizations}
        editingId={null}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Xóa đoàn thể"
        description={`Bạn có chắc chắn muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
