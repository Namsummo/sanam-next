/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import {
  createEmptyEventFormValues,
  mapEventToFormValues,
  type EventFormValues,
} from "@/components/admin/events/admin-event-form";
import { AdminEventFormModal } from "@/components/admin/events/admin-event-form-modal";
import { AdminEventsTable } from "@/components/admin/events/admin-events-table";
import { getEventCategoryLabel } from "@/lib/events/categories";
import { getToken } from "@/lib/admin/mock-auth";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  toParishEvent,
  updateEvent,
  uploadEventImage,
} from "@/shared/services/events-api";
import { slugify } from "@/shared/lib/slugify";
import type { EventStatus, ParishEvent } from "@/lib/events/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export function AdminEventsManager() {
  const router = useRouter();
  const [events, setEvents] = useState<ParishEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<EventFormValues>(() => createEmptyEventFormValues());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [formOpen, setFormOpen] = useState(false);

  const loadEvents = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await getAllEvents(token, {});
      setEvents(res.events.map(toParishEvent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...events]
      .filter((event) => {
        if (statusFilter !== "all" && event.status !== statusFilter) {
          return false;
        }

        if (categoryFilter !== "Tất cả") {
          const categoryLabel = getEventCategoryLabel(event.categoryId) ?? "";
          if (categoryLabel !== categoryFilter) {
            return false;
          }
        }

        if (!normalizedQuery) {
          return true;
        }

        const categoryLabel = getEventCategoryLabel(event.categoryId) ?? "";
        const searchable = [
          event.name,
          event.slug ?? "",
          event.location,
          categoryLabel,
        ].join(" ");

        return searchable.toLowerCase().includes(normalizedQuery);
      })
      .sort(
        (first, second) =>
          first.startDate.localeCompare(second.startDate) ||
          (first.startTime ?? "").localeCompare(second.startTime ?? ""),
      );
  }, [categoryFilter, events, searchQuery, statusFilter]);

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
      setEvents((current) => current.filter((event) => event.id !== eventId));
      if (editingId === eventId) {
        closeForm();
      }
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
        const updated = await updateEvent(token, editingId, {
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
        setEvents((current) =>
          current.map((item) => (item.id === editingId ? toParishEvent(updated) : item)),
        );
      } else {
        const generatedSlug = `${slugify(values.name)}-${Date.now()}`;
        const created = await createEvent(token, {
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
        setEvents((current) => [toParishEvent(created), ...current]);
      }

      closeForm();
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

      <AdminEventsTable
        events={filteredEvents}
        editingId={editingId}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onSearchQueryChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
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
