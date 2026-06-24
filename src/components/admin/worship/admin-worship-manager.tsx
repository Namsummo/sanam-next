"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminWorshipCategoriesPanel } from "@/components/admin/worship/admin-worship-categories-panel";
import {
  AdminWorshipCategoryModal,
  mapCategoryToFormValues,
  type WorshipCategoryFormValues,
} from "@/components/admin/worship/admin-worship-category-modal";
import { AdminWorshipLivePanel } from "@/components/admin/worship/admin-worship-live-panel";
import {
  AdminWorshipVideoModal,
  mapFormValuesToVideo,
  mapVideoToFormValues,
  type WorshipVideoFormValues,
} from "@/components/admin/worship/admin-worship-video-modal";
import { getToken } from "@/lib/admin/mock-auth";
import {
  createEmptyCategory,
  createEmptyVideo,
  getWorshipAdminState,
  saveWorshipAdminState,
  slugifyCategoryName,
  type WorshipVideoCategory,
  type WorshipVideoItem,
} from "@/lib/videos/admin-worship-store";
import type { LiveSettings } from "@/lib/videos/types";
import { cn } from "@/lib/utils";

type WorshipAdminTab = "categories" | "live";

async function uploadVideoPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminWorshipManager() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<WorshipAdminTab>("categories");
  const [categories, setCategories] = useState<WorshipVideoCategory[]>([]);
  const [videos, setVideos] = useState<WorshipVideoItem[]>([]);
  const [live, setLive] = useState<LiveSettings>({
    isLive: false,
    youtubeId: "",
    youtubeUrl: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSavingLive, setIsSavingLive] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryFormDefaults, setCategoryFormDefaults] =
    useState<WorshipCategoryFormValues>({
      name: "",
      slug: "",
      description: "",
      sortOrder: 1,
    });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoFormDefaults, setVideoFormDefaults] = useState<WorshipVideoFormValues>({
    categoryId: "",
    title: "",
    sourceType: "youtube",
    youtubeUrl: "",
    uploadUrl: "",
    publishedAt: new Date().toISOString().split("T")[0],
    duration: "",
    speaker: "",
    description: "",
  });

  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<WorshipVideoCategory | null>(null);
  const [deleteVideoTarget, setDeleteVideoTarget] =
    useState<WorshipVideoItem | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const state = getWorshipAdminState();
    setCategories(state.categories);
    setVideos(state.videos);
    setLive(state.live);
    setSelectedCategoryId(state.categories[0]?.id ?? null);
  }, []);

  function persistState(
    nextCategories = categories,
    nextVideos = videos,
    nextLive = live,
  ) {
    saveWorshipAdminState({
      categories: nextCategories,
      videos: nextVideos,
      live: nextLive,
    });
  }

  function showSavedMessage(message: string) {
    setSaveMessage(message);
    window.setTimeout(() => setSaveMessage(null), 2500);
  }

  function handleSaveLive() {
    setIsSavingLive(true);
    persistState(categories, videos, live);
    window.setTimeout(() => {
      setIsSavingLive(false);
      showSavedMessage("Đã lưu cấu hình livestream.");
    }, 300);
  }

  function handleSaveLibrary(
    nextCategories: WorshipVideoCategory[],
    nextVideos: WorshipVideoItem[],
  ) {
    setCategories(nextCategories);
    setVideos(nextVideos);
    persistState(nextCategories, nextVideos, live);
    showSavedMessage("Đã lưu thư viện video.");
  }

  function openCreateCategory() {
    const empty = createEmptyCategory();
    setCategoryFormDefaults(mapCategoryToFormValues(empty));
    setEditingCategoryId(null);
    setCategoryModalOpen(true);
  }

  function openEditCategory(category: WorshipVideoCategory) {
    setCategoryFormDefaults(mapCategoryToFormValues(category));
    setEditingCategoryId(category.id);
    setCategoryModalOpen(true);
  }

  function handleCategorySubmit(values: WorshipCategoryFormValues) {
    const payload: WorshipVideoCategory = {
      id: editingCategoryId ?? `cat-${crypto.randomUUID()}`,
      name: values.name.trim(),
      slug: values.slug.trim() || slugifyCategoryName(values.name),
      description: values.description.trim(),
      sortOrder: values.sortOrder,
    };

    const nextCategories = editingCategoryId
      ? categories.map((category) =>
          category.id === editingCategoryId ? payload : category,
        )
      : [...categories, payload];

    const sorted = [...nextCategories].sort((a, b) => a.sortOrder - b.sortOrder);
    setCategoryModalOpen(false);
    setEditingCategoryId(null);
    if (!selectedCategoryId) {
      setSelectedCategoryId(payload.id);
    }
    handleSaveLibrary(sorted, videos);
  }

  function confirmDeleteCategory() {
    if (!deleteCategoryTarget) return;

    const nextCategories = categories.filter(
      (category) => category.id !== deleteCategoryTarget.id,
    );
    const nextVideos = videos.filter(
      (video) => video.categoryId !== deleteCategoryTarget.id,
    );

    if (selectedCategoryId === deleteCategoryTarget.id) {
      setSelectedCategoryId(nextCategories[0]?.id ?? null);
    }

    setDeleteCategoryTarget(null);
    handleSaveLibrary(nextCategories, nextVideos);
  }

  function openCreateVideo() {
    if (!selectedCategoryId) return;
    const empty = createEmptyVideo(selectedCategoryId);
    setVideoFormDefaults(mapVideoToFormValues(empty));
    setEditingVideoId(null);
    setVideoModalOpen(true);
  }

  function openEditVideo(video: WorshipVideoItem) {
    setVideoFormDefaults(mapVideoToFormValues(video));
    setEditingVideoId(video.id);
    setVideoModalOpen(true);
  }

  function handleVideoSubmit(values: WorshipVideoFormValues) {
    const payload = mapFormValuesToVideo(values, editingVideoId);
    const nextVideos = editingVideoId
      ? videos.map((video) => (video.id === editingVideoId ? payload : video))
      : [...videos, payload];

    setVideoModalOpen(false);
    setEditingVideoId(null);
    handleSaveLibrary(categories, nextVideos);
  }

  function confirmDeleteVideo() {
    if (!deleteVideoTarget) return;

    const nextVideos = videos.filter((video) => video.id !== deleteVideoTarget.id);
    setDeleteVideoTarget(null);
    handleSaveLibrary(categories, nextVideos);
  }

  const tabs: { id: WorshipAdminTab; label: string }[] = [
    { id: "categories", label: "Danh mục video" },
    { id: "live", label: "Phát trực tiếp" },
  ];

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

        <div className="mt-3">
          <h1 className="font-display text-3xl font-semibold text-card-foreground">
            Video & Livestream
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý danh mục video và cấu hình phát trực tiếp Thánh lễ (mock UI,
            lưu tạm trên trình duyệt).
          </p>
        </div>
      </div>

      {saveMessage ? (
        <div className="rounded-[12px] border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {saveMessage}
        </div>
      ) : null}

      <div className="inline-flex rounded-[12px] border border-border bg-card p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-card-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "categories" ? (
        <AdminWorshipCategoriesPanel
          categories={categories}
          videos={videos}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onAddCategory={openCreateCategory}
          onEditCategory={openEditCategory}
          onDeleteCategory={setDeleteCategoryTarget}
          onAddVideo={openCreateVideo}
          onEditVideo={openEditVideo}
          onDeleteVideo={setDeleteVideoTarget}
        />
      ) : (
        <AdminWorshipLivePanel
          live={live}
          onChange={setLive}
          onSave={handleSaveLive}
          isSaving={isSavingLive}
        />
      )}

      <AdminWorshipCategoryModal
        open={categoryModalOpen}
        defaultValues={categoryFormDefaults}
        editingId={editingCategoryId}
        onClose={() => {
          setCategoryModalOpen(false);
          setEditingCategoryId(null);
        }}
        onSubmit={handleCategorySubmit}
      />

      <AdminWorshipVideoModal
        open={videoModalOpen}
        categories={categories}
        defaultValues={videoFormDefaults}
        editingId={editingVideoId}
        onClose={() => {
          setVideoModalOpen(false);
          setEditingVideoId(null);
        }}
        onSubmit={handleVideoSubmit}
        onUploadVideo={uploadVideoPreview}
      />

      <AdminConfirmDialog
        open={deleteCategoryTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCategoryTarget(null);
        }}
        title="Xóa danh mục"
        description={`Bạn có chắc muốn xóa danh mục "${deleteCategoryTarget?.name}"? Tất cả video trong danh mục cũng sẽ bị xóa.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDeleteCategory}
        variant="danger"
      />

      <AdminConfirmDialog
        open={deleteVideoTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteVideoTarget(null);
        }}
        title="Xóa video"
        description={`Bạn có chắc muốn xóa "${deleteVideoTarget?.title}"?`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDeleteVideo}
        variant="danger"
      />
    </div>
  );
}
