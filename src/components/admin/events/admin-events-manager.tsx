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
import { getToken } from "@/lib/admin/mock-auth";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventCategories,
  toParishEvent,
  updateEvent,
  uploadEventImage,
  type ApiEventCategory,
} from "@/shared/services/events-api";
import { slugify } from "@/shared/lib/slugify";
import type { EventStatus, ParishEvent } from "@/lib/events/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

const SEARCH_DEBOUNCE_MS = 1000;

export function AdminEventsManager() {
  const router = useRouter();
  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [categories, setCategories] = useState<ApiEventCategory[]>([]);
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const fetchEvents = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const trimmedSearch = debouncedSearch.trim();
      const eventsRes = await getAllEvents(token, {
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(categoryFilter !== "all" ? { categoryId: categoryFilter } : {}),
      });
      setEvents(eventsRes.events.map(toParishEvent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [categoryFilter, debouncedSearch, router, statusFilter]);

  useEffect(() => {
    const token = getToken();
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

  async function handleDelete(eventId: string) {
    const target = events.find((event) => event.id === eventId);
    if (!target) {
      return;
    }

    const shouldDelete = window.confirm(`Xóa sự kiện "${target.name}"?`);
    if (!shouldDelete) {
      return;
    }

    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      await deleteEvent(token, eventId);
      if (editingId === eventId) {
        closeForm();
      }
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadEventImage(token, file);
  }

  async function handleFormSubmit(values: EventFormValues) {
    const token = getToken();
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
          <button type="button" className={actionButtonClassName} onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Tạo mới
          </button>
        </div>
      </div>

      <AdminEventsFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        onSearchQueryChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onClear={handleClearFilters}
      />

      <AdminEventsTable
        events={events}
        categories={categories}
        editingId={editingId}
        fetching={fetching}
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
    </div>
  );
}
