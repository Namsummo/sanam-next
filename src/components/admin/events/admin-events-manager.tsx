"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import {
  buildEventFromForm,
  createEmptyEventFormValues,
  mapEventToFormValues,
  type EventFormValues,
} from "@/components/admin/events/admin-event-form";
import { AdminEventFormModal } from "@/components/admin/events/admin-event-form-modal";
import { AdminEventsTable } from "@/components/admin/events/admin-events-table";
import { getEventCategoryLabel } from "@/lib/events/categories";
import { mockParishEvents } from "@/lib/events/mock-events";
import type { EventStatus, ParishEvent } from "@/lib/events/types";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export function AdminEventsManager() {
  const [events, setEvents] = useState<ParishEvent[]>(() => [...mockParishEvents]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<EventFormValues>(() => createEmptyEventFormValues());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [formOpen, setFormOpen] = useState(false);

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

  function handleDelete(eventId: string) {
    const target = events.find((event) => event.id === eventId);
    if (!target) {
      return;
    }

    const shouldDelete = window.confirm(`Xóa sự kiện "${target.name}"?`);
    if (!shouldDelete) {
      return;
    }

    setEvents((current) => current.filter((event) => event.id !== eventId));
    if (editingId === eventId) {
      closeForm();
    }
  }

  function handleFormSubmit(values: EventFormValues) {
    const existing = editingId ? events.find((item) => item.id === editingId) : undefined;
    const payload = buildEventFromForm(values, existing);

    setEvents((current) => {
      const hasExisting = current.some((item) => item.id === payload.id);
      if (hasExisting) {
        return current.map((item) => (item.id === payload.id ? payload : item));
      }

      return [payload, ...current];
    });

    closeForm();
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
      />
    </div>
  );
}
