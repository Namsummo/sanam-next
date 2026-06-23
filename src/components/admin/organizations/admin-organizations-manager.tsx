/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import {
  AdminOrganizationsTable,
  ORGANIZATIONS_PAGE_SIZE,
} from "./admin-organizations-table";
import { AdminOrganizationsFilters } from "./admin-organizations-filters";
import {
  getAdminOrganizations,
  deleteOrganization,
  toggleOrganizationVisibility,
} from "@/lib/organization/api";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import type { Organization } from "@/lib/organization/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

const SEARCH_DEBOUNCE_MS = 1000;

export function AdminOrganizationsManager() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadOrganizations = useCallback(async () => {
    try {
      setFetching(true);
      setError(null);

      const trimmedSearch = debouncedSearch.trim();
      const res = await getAdminOrganizations({
        page,
        limit: ORGANIZATIONS_PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      });

      setOrganizations(res.organizations);
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organizations");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

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
      setDeleteTarget(null);
      await loadOrganizations();
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

      <AdminOrganizationsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
      />

      <AdminOrganizationsTable
        organizations={organizations}
        editingId={null}
        fetching={fetching}
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
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
