"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import {
  createEmptyVocationFruitFormValues,
  mapVocationFruitToFormValues,
  type VocationFruitFormValues,
} from "@/components/admin/vocation-fruits/admin-vocation-fruit-form";
import { AdminVocationFruitFormModal } from "@/components/admin/vocation-fruits/admin-vocation-fruit-form-modal";
import { AdminVocationFruitFilters } from "@/components/admin/vocation-fruits/admin-vocation-fruit-filters";
import { AdminVocationFruitsTable } from "@/components/admin/vocation-fruits/admin-vocation-fruits-table";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { getToken } from "@/lib/admin/mock-auth";
import { mockVocationFruits } from "@/lib/vocation/mock-vocation-fruits";
import type { VocationFruit, VocationType } from "@/lib/vocation/types";
import { AdminOutlineButton } from "../shared/admin-outline-button";


const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 11;

function filterFruits(
  fruits: VocationFruit[],
  params?: { vocationType?: VocationType; search?: string },
): VocationFruit[] {
  let result = fruits;

  if (params?.vocationType) {
    result = result.filter((fruit) => fruit.vocationType === params.vocationType);
  }

  const search = params?.search?.trim();
  if (search) {
    const query = search
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    result = result.filter((fruit) => {
      const haystack = [
        fruit.fullName,
        fruit.religiousOrder,
        fruit.currentAssignment,
        fruit.hometown,
        fruit.patronSaint,
      ]
        .filter(Boolean)
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  return result;
}

function paginateFruits<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total,
    totalPages,
  };
}

async function uploadImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminVocationFruitsManager() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<VocationFruitFormValues>(() =>
    createEmptyVocationFruitFormValues(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | VocationType>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<VocationFruit | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const { fruits, totalItems, totalPages } = useMemo(() => {
    const trimmedSearch = debouncedSearch.trim();
    const filtered = filterFruits(mockVocationFruits, {
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
      ...(typeFilter !== "all" ? { vocationType: typeFilter } : {}),
    });
    const paginated = paginateFruits(filtered, page, PAGE_SIZE);

    return {
      fruits: paginated.items,
      totalItems: paginated.total,
      totalPages: paginated.totalPages,
    };
  }, [debouncedSearch, page, typeFilter]);

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
    const target = mockVocationFruits.find((fruit) => fruit.id === fruitId);
    if (target) setDeleteTarget(target);
  }

  function handleFormSubmit(_values: VocationFruitFormValues) {
    closeForm();
  }

  function confirmDelete() {
    setDeleteTarget(null);
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
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý Quý Cha, Quý Thầy và Quý Dì quê hương giáo xứ Sa Nam.
            </p>
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
        onUploadImage={uploadImagePreview}
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
        variant="danger"
      />
    </div>
  );
}
