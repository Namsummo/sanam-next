"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
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
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  createEmptyCategory,
  createEmptyVideo,
  slugifyCategoryName,
  type WorshipVideoCategory,
  type WorshipVideoItem,
} from "@/lib/videos/admin-worship-store";
import type { LiveSettings } from "@/lib/videos/types";
import { cn } from "@/lib/utils";
import {
  getAdminWorshipCategories,
  getAdminWorshipVideos,
  getAdminLiveSettings,
  createAdminWorshipCategory,
  updateAdminWorshipCategory,
  deleteAdminWorshipCategory,
  createAdminWorshipVideo,
  updateAdminWorshipVideo,
  deleteAdminWorshipVideo,
  updateAdminLiveSettings,
  toWorshipVideoCategory,
  toWorshipVideoItem,
  toLiveSettings,
  syncAdminWorshipVideoViews,
} from "@/shared/services/worship-api";

type WorshipAdminTab = "categories" | "live";

async function uploadVideoPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingViews, setIsSyncingViews] = useState(false);

  async function handleSyncViews() {
    const token = getToken();
    if (!token) return;
    setIsSyncingViews(true);
    try {
      const res = await syncAdminWorshipVideoViews(token);
      showSavedMessage(res.message);
      
      // Reload video list to show updated views
      const vidsRes = await getAdminWorshipVideos(token);
      setVideos(vidsRes.videos.map(toWorshipVideoItem));
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không thể đồng bộ lượt xem")}`);
    } finally {
      setIsSyncingViews(false);
    }
  }

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
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    let active = true;
    async function loadData(authToken: string) {
      try {
        setIsLoading(true);
        const [catsRes, vidsRes, liveRes] = await Promise.all([
          getAdminWorshipCategories(authToken),
          getAdminWorshipVideos(authToken),
          getAdminLiveSettings(authToken),
        ]);

        if (!active) return;

        const cats = catsRes.categories.map(toWorshipVideoCategory);
        const vids = vidsRes.videos.map(toWorshipVideoItem);
        const liveSettings = toLiveSettings(liveRes);

        setCategories(cats);
        setVideos(vids);
        setLive(liveSettings);
        setSelectedCategoryId(cats[0]?.id ?? null);
      } catch (err) {
        console.error("Failed to load worship data:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadData(token);
    return () => {
      active = false;
    };
  }, [router]);

  function showSavedMessage(message: string) {
    setSaveMessage(message);
    window.setTimeout(() => setSaveMessage(null), 2500);
  }

  async function handleSaveLive() {
    const token = getAccessToken();
    if (!token) return;
    setIsSavingLive(true);
    try {
      const updated = await updateAdminLiveSettings(token, live);
      setLive(toLiveSettings(updated));
      showSavedMessage("Đã lưu cấu hình livestream.");
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không lưu được livestream")}`);
    } finally {
      setIsSavingLive(false);
    }
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

  async function handleCategorySubmit(values: WorshipCategoryFormValues) {
    const token = getAccessToken();
    if (!token) return;
    try {
      const payload = {
        name: values.name.trim(),
        slug: values.slug.trim() || slugifyCategoryName(values.name),
        description: values.description.trim(),
        sortOrder: values.sortOrder,
      };

      if (editingCategoryId) {
        const updated = await updateAdminWorshipCategory(token, editingCategoryId, payload);
        const mapped = toWorshipVideoCategory(updated);
        const nextCategories = categories.map((c) => (c.id === editingCategoryId ? mapped : c));
        const sorted = [...nextCategories].sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(sorted);
      } else {
        const created = await createAdminWorshipCategory(token, payload);
        const mapped = toWorshipVideoCategory(created);
        const nextCategories = [...categories, mapped];
        const sorted = [...nextCategories].sort((a, b) => a.sortOrder - b.sortOrder);
        setCategories(sorted);
        if (!selectedCategoryId) {
          setSelectedCategoryId(mapped.id);
        }
      }

      setCategoryModalOpen(false);
      setEditingCategoryId(null);
      showSavedMessage("Đã lưu danh mục.");
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không lưu được danh mục")}`);
    }
  }

  async function confirmDeleteCategory() {
    if (!deleteCategoryTarget) return;
    const token = getAccessToken();
    if (!token) return;
    try {
      await deleteAdminWorshipCategory(token, deleteCategoryTarget.id);

      const nextCategories = categories.filter(
        (category) => category.id !== deleteCategoryTarget.id,
      );
      const nextVideos = videos.filter(
        (video) => video.categoryId !== deleteCategoryTarget.id,
      );

      setCategories(nextCategories);
      setVideos(nextVideos);

      if (selectedCategoryId === deleteCategoryTarget.id) {
        setSelectedCategoryId(nextCategories[0]?.id ?? null);
      }

      setDeleteCategoryTarget(null);
      showSavedMessage("Đã xóa danh mục.");
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không xóa được danh mục")}`);
    }
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

  async function handleVideoSubmit(values: WorshipVideoFormValues) {
    const token = getAccessToken();
    if (!token) return;
    try {
      const payloadWithId = mapFormValuesToVideo(values, editingVideoId);
      const { id, ...payload } = payloadWithId;
      void id;

      if (editingVideoId) {
        const updated = await updateAdminWorshipVideo(token, editingVideoId, payload);
        const mapped = toWorshipVideoItem(updated);
        setVideos(videos.map((video) => (video.id === editingVideoId ? mapped : video)));
      } else {
        const created = await createAdminWorshipVideo(token, payload);
        const mapped = toWorshipVideoItem(created);
        setVideos([...videos, mapped]);
      }

      setVideoModalOpen(false);
      setEditingVideoId(null);
      showSavedMessage("Đã lưu video.");
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không lưu được video")}`);
    }
  }

  async function confirmDeleteVideo() {
    if (!deleteVideoTarget) return;
    const token = getAccessToken();
    if (!token) return;
    try {
      await deleteAdminWorshipVideo(token, deleteVideoTarget.id);
      const nextVideos = videos.filter((video) => video.id !== deleteVideoTarget.id);
      setVideos(nextVideos);
      setDeleteVideoTarget(null);
      showSavedMessage("Đã xóa video.");
    } catch (err: unknown) {
      console.error(err);
      showSavedMessage(`Lỗi: ${getErrorMessage(err, "Không xóa được video")}`);
    }
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

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-card-foreground">
              Video & Livestream
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý danh mục video và cấu hình phát trực tiếp Thánh lễ.
            </p>
          </div>
          {activeTab === "categories" && (
            <button
              type="button"
              disabled={isSyncingViews}
              onClick={handleSyncViews}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted disabled:opacity-50"
            >
              {isSyncingViews ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Đồng bộ lượt xem YouTube
            </button>
          )}
        </div>
      </div>

      {saveMessage ? (
        <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {saveMessage}
        </div>
      ) : null}

      <div className="inline-flex rounded-xl border border-border bg-card p-1">
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

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground bg-card border border-border rounded-[16px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : activeTab === "categories" ? (
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
