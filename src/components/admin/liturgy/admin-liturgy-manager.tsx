"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { AdminFeastFormDialog } from "@/components/admin/liturgy/admin-feast-form-dialog";
import { AdminGospelFormDialog } from "@/components/admin/liturgy/admin-gospel-form-dialog";
import { AdminReflectionFormDialog } from "@/components/admin/liturgy/admin-reflection-form-dialog";
import { AdminLiturgyCategoriesPanel } from "@/components/admin/liturgy/admin-liturgy-categories-panel";
import { AdminLiturgyFeastsTable } from "@/components/admin/liturgy/admin-liturgy-feasts-table";
import { AdminLiturgyGospelsTable } from "@/components/admin/liturgy/admin-liturgy-gospels-table";
import { AdminLiturgyReflectionsTable } from "@/components/admin/liturgy/admin-liturgy-reflections-table";
import { AdminLiturgySeasonsTable } from "@/components/admin/liturgy/admin-liturgy-seasons-table";
import { AdminSeasonFormDialog } from "@/components/admin/liturgy/admin-season-form-dialog";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getLiturgyAdminTab,
  LITURGY_ADMIN_TABS,
  resolveLiturgyTabId,
} from "@/lib/liturgy/admin-tabs";
import type {
  FeastPayload,
  FeastRankPayload,
  GospelPayload,
  LiturgyFeast,
  LiturgyFeastRank,
  LiturgyGospel,
  LiturgyModuleKind,
  LiturgyReflection,
  LiturgySeason,
  ReflectionPayload,
  SeasonPayload,
} from "@/lib/liturgy/types";
import {
  createAdminFeast,
  createAdminFeastRank,
  createAdminGospel,
  createAdminReflection,
  createAdminSeason,
  deleteAdminFeast,
  deleteAdminFeastRank,
  deleteAdminGospel,
  deleteAdminReflection,
  deleteAdminSeason,
  getAdminFeastRanks,
  getAdminFeasts,
  getAdminGospels,
  getAdminReflections,
  getAdminSeasons,
  toLiturgyFeast,
  toLiturgyFeastRank,
  toLiturgyGospel,
  toLiturgyReflection,
  toLiturgySeason,
  updateAdminFeast,
  updateAdminFeastRank,
  updateAdminGospel,
  updateAdminReflection,
  updateAdminSeason,
  uploadLiturgyImage,
} from "@/shared/services/liturgy-api";

const MODULE_KIND_LABELS: Record<LiturgyModuleKind, string> = {
  seasons: "Mùa phụng vụ",
  feasts: "Ngày lễ theo mùa",
  gospels: "Lời Chúa",
  reflections: "Suy niệm",
};

type LiturgyDeleteTargetType =
  | "seasons"
  | "feasts"
  | "gospels"
  | "reflections";

const CATEGORY_STORAGE_KEY = "admin-liturgy-category";

function readStoredCategory(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(CATEGORY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredCategory(id: string) {
  try {
    sessionStorage.setItem(CATEGORY_STORAGE_KEY, id);
  } catch {
    // ignore quota / private mode
  }
}

export function AdminLiturgyManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const categoryId = resolveLiturgyTabId(categoryFromUrl);

  const [seasons, setSeasons] = useState<LiturgySeason[]>([]);
  const [feasts, setFeasts] = useState<LiturgyFeast[]>([]);
  const [feastRanks, setFeastRanks] = useState<LiturgyFeastRank[]>([]);
  const [gospels, setGospels] = useState<LiturgyGospel[]>([]);
  const [reflections, setReflections] = useState<LiturgyReflection[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<LiturgySeason | null>(null);

  const [feastDialogOpen, setFeastDialogOpen] = useState(false);
  const [editingFeast, setEditingFeast] = useState<LiturgyFeast | null>(null);

  const [gospelDialogOpen, setGospelDialogOpen] = useState(false);
  const [editingGospel, setEditingGospel] = useState<LiturgyGospel | null>(null);

  const [reflectionDialogOpen, setReflectionDialogOpen] = useState(false);
  const [editingReflection, setEditingReflection] = useState<LiturgyReflection | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: LiturgyDeleteTargetType;
    id: string;
    label: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const setCategoryId = useCallback(
    (id: string) => {
      writeStoredCategory(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (categoryFromUrl) {
      writeStoredCategory(resolveLiturgyTabId(categoryFromUrl));
      return;
    }

    const stored = readStoredCategory();
    if (!stored) return;

    const resolved = resolveLiturgyTabId(stored);
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", resolved);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [categoryFromUrl, pathname, router, searchParams]);

  const activeTab = getLiturgyAdminTab(categoryId);
  const activeModuleKind = activeTab.moduleKind;

  // Load all liturgy data from API
  const fetchAllData = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setError(null);
      const [
        seasonsRes,
        ranksRes,
        feastsRes,
        gospelsRes,
        reflectionsRes,
      ] = await Promise.all([
        getAdminSeasons(token),
        getAdminFeastRanks(token),
        getAdminFeasts(token),
        getAdminGospels(token),
        getAdminReflections(token),
      ]);

      setSeasons(seasonsRes.seasons.map(toLiturgySeason));
      setFeastRanks(ranksRes.ranks.map(toLiturgyFeastRank));
      setFeasts(feastsRes.feasts.map(toLiturgyFeast));
      setGospels(gospelsRes.gospels.map(toLiturgyGospel));
      setReflections(reflectionsRes.reflections.map(toLiturgyReflection));
    } catch (err) {
      console.error("Failed to load liturgy data:", err);
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu phụng vụ");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Dialog openers
  function openCreateSeason() {
    setEditingSeason(null);
    setSeasonDialogOpen(true);
  }

  function openCreateFeast() {
    setEditingFeast(null);
    setFeastDialogOpen(true);
  }

  function openCreateGospel() {
    setEditingGospel(null);
    setGospelDialogOpen(true);
  }

  function openCreateReflection() {
    setEditingReflection(null);
    setReflectionDialogOpen(true);
  }

  // Season Save
  async function handleSaveSeason(payload: SeasonPayload) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (editingSeason) {
      await updateAdminSeason(token, editingSeason.id, payload);
    } else {
      await createAdminSeason(token, payload);
    }
    await fetchAllData();
  }

  // Feast Save
  async function handleSaveFeast(payload: FeastPayload) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (editingFeast) {
      await updateAdminFeast(token, editingFeast.id, payload);
    } else {
      await createAdminFeast(token, payload);
    }
    await fetchAllData();
  }

  // Feast Rank Handlers
  async function handleCreateRank(payload: FeastRankPayload) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    await createAdminFeastRank(token, payload);
    await fetchAllData();
  }

  async function handleUpdateRank(id: string, payload: Partial<FeastRankPayload>) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    await updateAdminFeastRank(token, id, payload);
    await fetchAllData();
  }

  async function handleDeleteRank(id: string) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    await deleteAdminFeastRank(token, id);
    await fetchAllData();
  }

  // Gospel Save & Upload
  async function handleSaveGospel(payload: GospelPayload) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (editingGospel) {
      await updateAdminGospel(token, editingGospel.id, payload);
    } else {
      await createAdminGospel(token, payload);
    }
    await fetchAllData();
  }

  async function handleUploadImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Chưa đăng nhập");
    return uploadLiturgyImage(token, file);
  }

  // Reflection Save
  async function handleSaveReflection(payload: ReflectionPayload) {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (editingReflection) {
      await updateAdminReflection(token, editingReflection.id, payload);
    } else {
      await createAdminReflection(token, payload);
    }
    await fetchAllData();
  }

  // Delete handler
  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setDeleting(true);
      if (deleteTarget.type === "seasons") {
        await deleteAdminSeason(token, deleteTarget.id);
      } else if (deleteTarget.type === "feasts") {
        await deleteAdminFeast(token, deleteTarget.id);
      } else if (deleteTarget.type === "gospels") {
        await deleteAdminGospel(token, deleteTarget.id);
      } else if (deleteTarget.type === "reflections") {
        await deleteAdminReflection(token, deleteTarget.id);
      }
      setDeleteTarget(null);
      await fetchAllData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Đang tải phụng vụ…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-card-foreground"
        >
          <ArrowLeft className="size-4" />
          Tổng quan
        </Link>
        <h1 className="font-display text-2xl font-semibold text-card-foreground md:text-3xl">
          Phụng vụ hàng ngày
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý mùa, ngày lễ, lời Chúa và suy niệm.
        </p>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminLiturgyCategoriesPanel
          tabs={LITURGY_ADMIN_TABS}
          activeTabId={categoryId}
          onSelectTab={setCategoryId}
        />

        <section className="rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-card-foreground">
                {activeTab.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeTab.description ?? MODULE_KIND_LABELS[activeModuleKind]}
              </p>
            </div>

            {activeModuleKind === "gospels" ? (
              <AdminOutlineButton type="button" className="bg-accent hover:bg-accent text-accent-foreground" onClick={openCreateGospel}>
                <Plus className="size-4" aria-hidden />
                Thêm lời Chúa
              </AdminOutlineButton>
            ) : null}
            {activeModuleKind === "reflections" ? (
              <AdminOutlineButton type="button" className="bg-accent hover:bg-accent text-accent-foreground" onClick={openCreateReflection}>
                <Plus className="size-4" aria-hidden />
                Thêm suy niệm
              </AdminOutlineButton>
            ) : null}
            {activeModuleKind === "seasons" ? (
              <AdminOutlineButton type="button" className="bg-accent hover:bg-accent text-accent-foreground" onClick={openCreateSeason}>
                <Plus className="size-4" aria-hidden />
                Thêm mùa
              </AdminOutlineButton>
            ) : null}
            {activeModuleKind === "feasts" ? (
              <AdminOutlineButton type="button" className="bg-accent hover:bg-accent text-accent-foreground" onClick={openCreateFeast}>
                <Plus className="size-4" aria-hidden />
                Thêm ngày lễ
              </AdminOutlineButton>
            ) : null}
          </div>

          <div className="overflow-hidden">
            {activeModuleKind === "seasons" ? (
              <AdminLiturgySeasonsTable
                seasons={seasons}
                onEdit={(season) => {
                  setEditingSeason(season);
                  setSeasonDialogOpen(true);
                }}
                onDelete={(season) =>
                  setDeleteTarget({
                    type: "seasons",
                    id: season.id,
                    label: season.name,
                  })
                }
              />
            ) : null}

            {activeModuleKind === "feasts" ? (
              <AdminLiturgyFeastsTable
                feasts={feasts}
                ranks={feastRanks}
                seasons={seasons}
                onEdit={(feast) => {
                  setEditingFeast(feast);
                  setFeastDialogOpen(true);
                }}
                onDelete={(feast) =>
                  setDeleteTarget({
                    type: "feasts",
                    id: feast.id,
                    label: feast.name,
                  })
                }
              />
            ) : null}

            {activeModuleKind === "gospels" ? (
              <AdminLiturgyGospelsTable
                gospels={gospels}
                onEdit={(gospel) => {
                  setEditingGospel(gospel);
                  setGospelDialogOpen(true);
                }}
                onDelete={(gospel) =>
                  setDeleteTarget({
                    type: "gospels",
                    id: gospel.id,
                    label: gospel.gospelTitle,
                  })
                }
              />
            ) : null}

            {activeModuleKind === "reflections" ? (
              <AdminLiturgyReflectionsTable
                reflections={reflections}
                onEdit={(item) => {
                  setEditingReflection(item);
                  setReflectionDialogOpen(true);
                }}
                onDelete={(item) =>
                  setDeleteTarget({
                    type: "reflections",
                    id: item.id,
                    label: item.title,
                  })
                }
              />
            ) : null}
          </div>
        </section>
      </div>

      <AdminSeasonFormDialog
        open={seasonDialogOpen}
        onOpenChange={setSeasonDialogOpen}
        editingSeason={editingSeason}
        onSubmit={handleSaveSeason}
      />

      <AdminFeastFormDialog
        open={feastDialogOpen}
        onOpenChange={setFeastDialogOpen}
        editingFeast={editingFeast}
        seasons={seasons}
        feastRanks={feastRanks}
        feasts={feasts}
        onSubmit={handleSaveFeast}
        onCreateRank={handleCreateRank}
        onUpdateRank={handleUpdateRank}
        onDeleteRank={handleDeleteRank}
      />

      <AdminGospelFormDialog
        open={gospelDialogOpen}
        onOpenChange={setGospelDialogOpen}
        editingGospel={editingGospel}
        onSubmit={handleSaveGospel}
        onUploadImage={handleUploadImage}
      />

      <AdminReflectionFormDialog
        open={reflectionDialogOpen}
        onOpenChange={setReflectionDialogOpen}
        editingReflection={editingReflection}
        onSubmit={handleSaveReflection}
        onUploadImage={handleUploadImage}
      />

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Xóa bản ghi?"
        description={
          deleteTarget
            ? `Bạn sắp xóa “${deleteTarget.label}”. Thao tác này không thể hoàn tác.`
            : ""
        }
        confirmLabel="Xóa"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
