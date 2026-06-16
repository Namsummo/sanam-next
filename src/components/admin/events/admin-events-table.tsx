"use client";

import { Pencil, Search, Trash2 } from "lucide-react";
import {
  EVENT_STATUS_OPTIONS,
  getEventStatusBadgeClassName,
  getEventStatusByLabel,
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
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { eventCategories, getEventCategoryLabel } from "@/lib/events/categories";
import type { EventStatus, ParishEvent } from "@/lib/events/types";
import { getEventDateTimeDisplay } from "@/lib/format";
import { cn } from "@/lib/utils";

const ALL_FILTER_VALUE = "Tất cả";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

function EventDateTimeDisplay({ event }: { event: ParishEvent }) {
  const { date, time } = getEventDateTimeDisplay(event);

  return (
    <div>
      <p className="text-sm font-medium text-card-foreground">{date}</p>
      {time ? <p className="mt-0.5 text-xs text-muted-foreground">{time}</p> : null}
    </div>
  );
}

type AdminEventsTableProps = {
  events: ParishEvent[];
  editingId: string | null;
  searchQuery: string;
  statusFilter: "all" | EventStatus;
  categoryFilter: string;
  onSearchQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | EventStatus) => void;
  onCategoryFilterChange: (value: string) => void;
  onEdit: (event: ParishEvent) => void;
  onDelete: (eventId: string) => void;
};

export function AdminEventsTable({
  events,
  editingId,
  searchQuery,
  statusFilter,
  categoryFilter,
  onSearchQueryChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onEdit,
  onDelete,
}: AdminEventsTableProps) {
  return (
    <>
      <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Tìm kiếm
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(changeEvent) => onSearchQueryChange(changeEvent.target.value)}
                placeholder="Tên, địa điểm, slug..."
                className="pl-10"
              />
            </div>
          </label>

          <div className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Trạng thái
            </span>
            <Select
              value={statusFilter === "all" ? ALL_FILTER_VALUE : getEventStatusLabel(statusFilter)}
              onValueChange={(value) => {
                if (!value || value === ALL_FILTER_VALUE) {
                  onStatusFilterChange("all");
                  return;
                }

                const status = getEventStatusByLabel(value);
                if (status) {
                  onStatusFilterChange(status);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={ALL_FILTER_VALUE} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
                {EVENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Danh mục
            </span>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                if (value) {
                  onCategoryFilterChange(value);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={ALL_FILTER_VALUE} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>{ALL_FILTER_VALUE}</SelectItem>
                {eventCategories.map((category) => (
                  <SelectItem key={category.id} value={category.label}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[20px] border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-card-foreground">
            Danh sách sự kiện ({events.length})
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[44%] min-w-[300px] px-4">Sự kiện</TableHead>
              <TableHead className="min-w-[140px] px-4">Thời gian</TableHead>
              <TableHead className="px-4">Danh mục</TableHead>
              <TableHead className="px-4">Trạng thái</TableHead>
              <TableHead className="px-4 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Không có sự kiện phù hợp bộ lọc hiện tại.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className={cn(editingId === event.id && "bg-accent/5 hover:bg-accent/10")}
                >
                  <TableCell className="min-w-[300px] px-4 py-3 whitespace-normal">
                    <p className="line-clamp-2 font-medium text-card-foreground">{event.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.slug ?? event.id}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {event.location}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-normal">
                    <EventDateTimeDisplay event={event} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-sm text-card-foreground">
                      {getEventCategoryLabel(event.categoryId) ?? "-"}
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
      </section>
    </>
  );
}
