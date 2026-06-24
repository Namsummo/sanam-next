"use client";

import Image from "next/image";
import {
  FolderOpen,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import type {
  WorshipVideoCategory,
  WorshipVideoItem,
} from "@/lib/videos/admin-worship-store";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { cn } from "@/lib/utils";

type AdminWorshipCategoriesPanelProps = {
  categories: WorshipVideoCategory[];
  videos: WorshipVideoItem[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: WorshipVideoCategory) => void;
  onDeleteCategory: (category: WorshipVideoCategory) => void;
  onAddVideo: () => void;
  onEditVideo: (video: WorshipVideoItem) => void;
  onDeleteVideo: (video: WorshipVideoItem) => void;
};

export function AdminWorshipCategoriesPanel({
  categories,
  videos,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
}: AdminWorshipCategoriesPanelProps) {
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const categoryVideos = videos.filter(
    (video) => video.categoryId === selectedCategoryId,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-[16px] border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-card-foreground">
            Danh mục
          </h2>
          <AdminOutlineButton type="button" onClick={onAddCategory}>
            <Plus className="size-4" aria-hidden />
            Thêm
          </AdminOutlineButton>
        </div>

        <ul className="space-y-2">
          {categories.map((category) => {
            const count = videos.filter(
              (video) => video.categoryId === category.id,
            ).length;
            const isActive = category.id === selectedCategoryId;

            return (
              <li key={category.id}>
                <div
                  className={cn(
                    "rounded-[12px] border transition-colors",
                    isActive
                      ? "border-accent bg-accent/5"
                      : "border-border bg-background",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="flex w-full items-start gap-3 px-3 py-3 text-left"
                  >
                    <FolderOpen
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        isActive ? "text-accent" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-foreground">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {count} video
                      </p>
                    </div>
                  </button>

                  <div className="flex justify-end gap-1 border-t border-border/60 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => onEditCategory(category)}
                      className="rounded-[8px] p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                      aria-label={`Sửa ${category.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(category)}
                      className="rounded-[8px] p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Xóa ${category.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="rounded-[16px] border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-card-foreground">
              {selectedCategory?.name ?? "Chọn danh mục"}
            </h2>
            {selectedCategory?.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedCategory.description}
              </p>
            ) : null}
          </div>

          {selectedCategory ? (
            <AdminOutlineButton type="button" onClick={onAddVideo}>
              <Plus className="size-4" aria-hidden />
              Thêm video
            </AdminOutlineButton>
          ) : null}
        </div>

        {!selectedCategory ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            Chọn hoặc tạo danh mục để quản lý video.
          </div>
        ) : categoryVideos.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Danh mục này chưa có video nào.
            </p>
            <AdminOutlineButton
              type="button"
              onClick={onAddVideo}
              className="mt-4"
            >
              <Plus className="size-4" aria-hidden />
              Thêm video đầu tiên
            </AdminOutlineButton>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categoryVideos.map((video) => (
              <article
                key={video.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[12px] bg-muted sm:w-44">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      {video.sourceType === "youtube" ? (
                        <Video className="size-8 opacity-40" />
                      ) : (
                        <Upload className="size-8 opacity-40" />
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        video.sourceType === "youtube"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-blue-500/10 text-blue-600",
                      )}
                    >
                      {video.sourceType === "youtube" ? "YouTube" : "Tải lên"}
                    </span>
                    {video.duration ? (
                      <span className="text-xs text-muted-foreground">
                        {video.duration}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-1 font-medium text-card-foreground">
                    {video.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {video.description || "Chưa có mô tả"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {video.speaker ? <span>{video.speaker}</span> : null}
                    <span>{video.publishedAt}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 sm:flex-col">
                  <AdminOutlineButton
                    type="button"
                    onClick={() => onEditVideo(video)}
                  >
                    <Pencil className="size-4" aria-hidden />
                    Sửa
                  </AdminOutlineButton>
                  <AdminOutlineButton
                    type="button"
                    onClick={() => onDeleteVideo(video)}
                    className="hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Xóa
                  </AdminOutlineButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
