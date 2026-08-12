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
import { AdminClergyFilters } from "@/components/admin/clergy/admin-clergy-filters";
import { AdminClergyTable } from "@/components/admin/clergy/admin-clergy-table";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  loadExtraCouncilTerms,
  mergeCouncilTerms,
  saveExtraCouncilTerms,
} from "@/lib/clergy/admin-council-terms";
import { getTermsFromCouncilMembers } from "@/lib/clergy/council-terms";
import type { OrganizationTerm } from "@/lib/organization/types";
import { sortTermsNewestFirst } from "@/lib/organization/terms";
import {
  createClergy,
  deleteClergy,
  getAllClergy,
  toClergyMember,
  updateClergy,
  toggleClergyVisibility,
  toggleClergyHomepageVisibility,
} from "@/shared/services/clergy-api";
import { uploadEventImage } from "@/shared/services/events-api";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import type { ClergyMember } from "@/lib/clergy/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

const SEARCH_DEBOUNCE_MS = 1000;
const PAGE_SIZE = 11;

export function AdminClergyManager() {
  const router = useRouter();
  const [members, setMembers] = useState<ClergyMember[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<ClergyFormValues>(() => createEmptyClergyFormValues());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "priest" | "council">("all");
  const [termFilter, setTermFilter] = useState<"all" | string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClergyMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [extraCouncilTerms, setExtraCouncilTerms] = useState<OrganizationTerm[]>(
    () => loadExtraCouncilTerms(),
  );

  const councilTerms = useMemo(
    () =>
      mergeCouncilTerms(
        getTermsFromCouncilMembers(members),
        extraCouncilTerms,
      ),
    [extraCouncilTerms, members],
  );

  function handleTermCreated(term: OrganizationTerm) {
    setExtraCouncilTerms((current) => {
      if (current.some((existing) => existing.id === term.id)) {
        return current;
      }

      const next = sortTermsNewestFirst([...current, term]);
      saveExtraCouncilTerms(next);
      return next;
    });
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchMembers = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const trimmedSearch = debouncedSearch.trim();
      const res = await getAllClergy(token, {
        page,
        limit: PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(typeFilter !== "all" ? { type: typeFilter } : {}),
        ...(termFilter !== "all" ? { termId: termFilter } : {}),
      });
      setMembers(
        res.members
          .map(toClergyMember)
          .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999)),
      );
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clergy members");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [debouncedSearch, page, router, termFilter, typeFilter]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchMembers();
  }, [fetchMembers]);

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

    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const memberId = String(deleteTarget.id);
    try {
      setDeleting(true);
      await deleteClergy(token, memberId);
      if (editingId === memberId) closeForm();
      setDeleteTarget(null);
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete member");
    } finally {
      setDeleting(false);
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return uploadEventImage(token, file);
  }

  async function handleToggleVisibility(memberId: string) {
    const token = getAccessToken();
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

  async function handleToggleHomepageVisibility(memberId: string) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const result = await toggleClergyHomepageVisibility(token, memberId);
      setMembers((current) =>
        current.map((m) =>
          String(m.id) === memberId ? { ...m, showOnHomepage: result.showOnHomepage } : m,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle homepage visibility");
    }
  }

  async function handleFormSubmit(values: ClergyFormValues) {
    const token = getAccessToken();
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
        showOnHomepage: values.showOnHomepage,
        image: values.image.trim() || undefined,
        ordinationDate: values.ordinationDate.trim() || undefined,
        patronSaint: values.patronSaint.trim() || undefined,
        patronDate: values.patronDate.trim() || undefined,
        hometown: values.hometown.trim() || undefined,
        // Linh mục: nhập tay (linh động). Ban Hành Giáo: chọn theo khóa (YYYY-YYYY).
        termId: values.termId.trim() || undefined,
      };

      if (editingId) {
        await updateClergy(token, editingId, data);
      } else {
        await createClergy(token, data);
      }

      closeForm();
      await fetchMembers();
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

      <AdminClergyFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        termFilter={termFilter}
        councilTerms={councilTerms}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onTypeFilterChange={(value) => {
          setTypeFilter(value);
          setPage(1);
        }}
        onTermFilterChange={(value) => {
          setTermFilter(value);
          setPage(1);
        }}
        onClear={() => {
          setSearchQuery("");
          setDebouncedSearch("");
          setTypeFilter("all");
          setTermFilter("all");
          setPage(1);
        }}
      />

      <AdminClergyTable
        members={members}
        editingId={editingId}
        fetching={fetching}
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => setPage(nextPage)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        onToggleHomepageVisibility={handleToggleHomepageVisibility}
      />

      <AdminClergyFormModal
        open={formOpen}
        defaultValues={formDefaults}
        editingId={editingId}
        councilTerms={councilTerms}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        onUploadImage={handleUploadImage}
        onTermCreated={handleTermCreated}
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
