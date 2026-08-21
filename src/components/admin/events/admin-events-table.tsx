"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  getEventStatusBadgeClassName,
  getEventStatusLabel,
} from "@/components/admin/events/admin-event-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/site/shared/ui/table/table";
import { AdminPagination } from "@/components/admin/shared/admin-pagination";
import type { ParishEvent } from "@/lib/events/types";
import { getEventDateTimeDisplay } from "@/lib/format";
import type { ApiEventCategory } from "@/shared/services/events-api";
import { cn } from "@/lib/utils";

export const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export const EVENTS_PAGE_SIZE = 10;

function EventDateTimeDisplay({ event }: { event: ParishEvent }) {
  const { date, time } = getEventDateTimeDisplay(event);

  return (
    <div>
      <p className="text-sm font-medium text-card-foreground">{date}</p>
      {time ? <p className="mt-0.5 text-xs text-muted-foreground">{time}</p> : null}
    </div>
  );
}

function resolveCategoryLabel(
  event: ParishEvent,
  categoryLabelById: Map<string, string>,
): string {
  return event.categoryLabel ?? categoryLabelById.get(event.categoryId ?? "") ?? "-";
}

type AdminEventsTableProps = {
  events: ParishEvent[];
  categories: ApiEventCategory[];
  editingId: string | null;
  fetching?: boolean;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onEdit: (event: ParishEvent) => void;
  onDelete: (eventId: string) => void;
};

export function AdminEventsTable({
  events,
  categories,
  editingId,
  fetching = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
}: AdminEventsTableProps) {
  const categoryLabelById = new Map(
    categories.map((category) => [category._id, category.label]),
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-border bg-card",
        fetching && "opacity-60",
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">STT</TableHead>
            <TableHead className="w-[44%] min-w-75 px-4">Sự kiện</TableHead>
            <TableHead className="min-w-35 px-4">Thời gian</TableHead>
            <TableHead className="px-4">Danh mục</TableHead>
            <TableHead className="px-4">Trạng thái</TableHead>
            <TableHead className="px-4 text-center">Thứ tự</TableHead>
            <TableHead className="px-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                Không có sự kiện phù hợp bộ lọc hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index) => (
              <TableRow
                key={event.id}
                className={cn(editingId === event.id && "bg-accent/5 hover:bg-accent/10")}
              >
                <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="min-w-75 px-4 py-3 whitespace-normal">
                  <p className="line-clamp-2 font-medium text-card-foreground">{event.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {event.location}
                  </p>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-normal">
                  <EventDateTimeDisplay event={event} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span className="text-sm text-card-foreground">
                    {resolveCategoryLabel(event, categoryLabelById)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      getEventStatusBadgeClassName(event.status),
                    )}
                  >
                    {getEventStatusLabel(event.status)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-center text-sm text-card-foreground">
                  {event.isFeatured &&
                    event.featuredOrder != null &&
                    Number.isFinite(event.featuredOrder)
                    ? event.featuredOrder
                    : "-"}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      className={actionButtonClassName}
                      onClick={() => onEdit(event)}
                    >
                      <Pencil className="size-4" aria-hidden />
                      Sửa
                    </button>
                    <button
                      type="button"
                      className={cn(
                        actionButtonClassName,
                        "text-destructive hover:bg-destructive/10",
                      )}
                      onClick={() => onDelete(event.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                      Xóa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {onPageChange ? (
        <div className="border-t border-border px-4 py-3">
          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showWhenSinglePage
          />
        </div>
      ) : null}
    </section>
  );
}
