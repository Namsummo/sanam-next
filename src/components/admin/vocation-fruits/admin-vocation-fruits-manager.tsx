"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import {
  createEmptyVocationFruitFormValues,
  mapVocationFruitToFormValues,
  type VocationFruitFormValues,
} from "@/components/admin/vocation-fruits/admin-vocation-fruit-form";
import { AdminVocationFruitFormModal } from "@/components/admin/vocation-fruits/admin-vocation-fruit-form-modal";
import { AdminVocationFruitFilters } from "@/components/admin/vocation-fruits/admin-vocation-fruit-filters";
import { AdminVocationFruitsTable } from "@/components/admin/vocation-fruits/admin-vocation-fruits-table";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { getAccessToken } from "@/lib/admin/auth-session";
import type { VocationFruit, VocationType } from "@/lib/vocation/types";
import { AdminOutlineButton } from "../shared/admin-outline-button";
import {
  getAllVocationFruits,
  createVocationFruit,
  updateVocationFruit,
  deleteVocationFruit,
  toVocationFruit,
} from "@/shared/services/vocation-api";
import { uploadEventImage } from "@/shared/services/events-api";

const SEARCH_DEBOUNCE_MS = 1000;
const PAGE_SIZE = 11;

export function AdminVocationFruitsManager() {
  const router = useRouter();
  const [fruits, setFruits] = useState<VocationFruit[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<VocationFruitFormValues>(() =>
    createEmptyVocationFruitFormValues(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | VocationType>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VocationFruit | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchFruits = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setError(null);

    try {
      const trimmedSearch = debouncedSearch.trim();
      const res = await getAllVocationFruits(token, {
        page,
        limit: PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(typeFilter !== "all" ? { type: typeFilter } : {}),
      });
      setFruits(res.fruits.map(toVocationFruit));
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vocation fruits");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, router, typeFilter]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchFruits();
  }, [fetchFruits]);

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormDefaults(createEmptyVocationFruitFormValues());
  }

  function openCreateForm() {
    setFormDefaults(createEmptyVocationFruitFormValues());
    setEditingId(null);
    setFormOpen(true);
  }

  function handleEdit(fruit: VocationFruit) {
    setFormDefaults(mapVocationFruitToFormValues(fruit));
    setEditingId(fruit.id);
    setFormOpen(true);
  }

  function handleDelete(fruitId: string) {
    const target = fruits.find((fruit) => fruit.id === fruitId);
    if (target) setDeleteTarget(target);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setDeleting(true);
      await deleteVocationFruit(token, deleteTarget.id);
      if (editingId === deleteTarget.id) closeForm();
      setDeleteTarget(null);
      await fetchFruits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete vocation fruit");
    } finally {
      setDeleting(false);
    }
  }

  async function handleFormSubmit(values: VocationFruitFormValues) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const data = {
        fullName: values.fullName.trim(),
        vocationType: values.vocationType,
        religiousOrder: values.religiousOrder.trim() || undefined,
        currentAssignment: values.currentAssignment.trim() || undefined,
        hometown: values.hometown.trim() || undefined,
        patronSaint: values.patronSaint.trim() || undefined,
        vocationYear: values.vocationYear ? Number(values.vocationYear) : undefined,
        image: values.image.trim() || undefined,
      };

      if (editingId) {
        await updateVocationFruit(token, editingId, data);
      } else {
        await createVocationFruit(token, data);
      }

      closeForm();
      await fetchFruits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vocation fruit");
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return uploadEventImage(token, file);
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
              Hoa trái ơn gọi
            </h1>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Quản lý Quý Cha, Quý Thầy và Quý Dì quê hương giáo xứ Sa Nam.
              </p>
            )}
          </div>
          <AdminOutlineButton type="button" onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Thêm hoa trái
          </AdminOutlineButton>
        </div>
      </div>

      <AdminVocationFruitFilters
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onTypeFilterChange={(value) => {
          setTypeFilter(value);
          setPage(1);
        }}
        onClear={() => {
          setSearchQuery("");
          setDebouncedSearch("");
          setTypeFilter("all");
          setPage(1);
        }}
      />

      <AdminVocationFruitsTable
        fruits={fruits}
        editingId={editingId}
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => setPage(nextPage)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminVocationFruitFormModal
        open={formOpen}
        defaultValues={formDefaults}
        editingId={editingId}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        onUploadImage={handleUploadImage}
      />

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa hoa trái"
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
