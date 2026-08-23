/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import {
  createEmptyEventFormValues,
  mapEventToFormValues,
  type EventFormValues,
} from "@/components/admin/events/admin-event-form";
import { AdminEventFormModal } from "@/components/admin/events/admin-event-form-modal";
import { AdminEventsFilters } from "@/components/admin/events/admin-events-filters";
import { AdminEventsTable } from "@/components/admin/events/admin-events-table";
import { EVENTS_PAGE_SIZE } from "@/components/admin/events/admin-events-table";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventCategories,
  toParishEvent,
  updateEvent,
  uploadEventImage,
  deleteEventCategory,
  type ApiEventCategory,
} from "@/shared/services/events-api";
import { slugify } from "@/shared/lib/slugify";
import type { EventStatus, ParishEvent } from "@/lib/events/types";

const SEARCH_DEBOUNCE_MS = 1000;

export function AdminEventsManager() {
  const router = useRouter();
  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [categories, setCategories] = useState<ApiEventCategory[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<EventFormValues>(() => createEmptyEventFormValues());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ParishEvent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchEvents = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const trimmedSearch = debouncedSearch.trim();
      const eventsRes = await getAllEvents(token, {
        page,
        limit: EVENTS_PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(categoryFilter !== "all" ? { categoryId: categoryFilter } : {}),
      });
      setEvents(eventsRes.events.map(toParishEvent));
      setTotalItems(eventsRes.pagination.total);
      setTotalPages(eventsRes.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [categoryFilter, debouncedSearch, page, router, statusFilter]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    getEventCategories()
      .then(setCategories)
      .catch(() => { });
  }, [router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleClearFilters() {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPage(1);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormDefaults(createEmptyEventFormValues());
  }

  function openCreateForm() {
    setFormDefaults(createEmptyEventFormValues());
    setEditingId(null);
    setFormOpen(true);
  }

  function handleEdit(event: ParishEvent) {
    setFormDefaults(mapEventToFormValues(event));
    setEditingId(event.id);
    setFormOpen(true);
  }

  function handleDelete(eventId: string) {
    const target = events.find((event) => event.id === eventId);
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
      await deleteEvent(token, deleteTarget.id);
      if (editingId === deleteTarget.id) {
        closeForm();
      }
      setDeleteTarget(null);
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  }

  async function handleConfirmDeleteCategory() {
    if (!deletingCategoryId) return;
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setDeletingCategory(true);
    try {
      await deleteEventCategory(token, deletingCategoryId);
      setCategories((prev) => prev.filter((c) => c._id !== deletingCategoryId));
      if (categoryFilter === deletingCategoryId) {
        setCategoryFilter("all");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Không thể xóa danh mục.");
    } finally {
      setDeletingCategory(false);
      setDeletingCategoryId(null);
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Not authenticated");
    return uploadEventImage(token, file);
  }

  async function handleFormSubmit(values: EventFormValues) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      if (editingId) {
        await updateEvent(token, editingId, {
          name: values.name.trim(),
          startDate: values.startDate,
          startTime: values.startTime.trim() || undefined,
          endDate: values.endDate.trim() || undefined,
          endTime: values.endTime.trim() || undefined,
          location: values.location.trim(),
          content: values.content.trim(),
          image: values.image.trim() || undefined,
          categoryId: values.categoryId || null,
          isFeatured: values.isFeatured,
          featuredOrder: values.isFeatured && values.featuredOrder ? Number(values.featuredOrder) : null,
          status: values.status,
          isVisible: true,
        });
      } else {
        const generatedSlug = `${slugify(values.name)}-${Date.now()}`;
        await createEvent(token, {
          name: values.name.trim(),
          slug: generatedSlug,
          startDate: values.startDate,
          startTime: values.startTime.trim() || undefined,
          endDate: values.endDate.trim() || undefined,
          endTime: values.endTime.trim() || undefined,
          location: values.location.trim(),
          content: values.content.trim(),
          image: values.image.trim() || undefined,
          categoryId: values.categoryId || null,
          isFeatured: values.isFeatured,
          featuredOrder: values.isFeatured && values.featuredOrder ? Number(values.featuredOrder) : null,
          status: values.status,
          isVisible: true,
        });
      }

      closeForm();
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
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
              Quản lý Sự kiện
            </h1>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
          <button type="button" className='bg-accent text-white px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 justify-center' onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Tạo sự kiện
          </button>
        </div>
      </div>

      <AdminEventsFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onCategoryFilterChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
        onClear={handleClearFilters}
        onDeleteCategory={(id) => setDeletingCategoryId(id)}
      />

      <AdminEventsTable
        events={events}
        categories={categories}
        editingId={editingId}
        fetching={fetching}
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminEventFormModal
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
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Xóa sự kiện"
        description="Bạn có chắc muốn xóa sự kiện này? Hành động không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />

      <AdminConfirmDialog
        open={deletingCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingCategoryId(null);
        }}
        title="Xóa danh mục sự kiện?"
        description="Hành động này sẽ xóa vĩnh viễn danh mục này khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xóa"
        onConfirm={handleConfirmDeleteCategory}
        loading={deletingCategory}
        variant="danger"
      />
    </div>
  );
}
