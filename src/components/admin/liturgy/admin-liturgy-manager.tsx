"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
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
import {
  getLiturgyAdminTab,
  LITURGY_ADMIN_TABS,
  resolveLiturgyTabId,
} from "@/lib/liturgy/admin-tabs";
import type {
  LiturgyFeast,
  LiturgyGospel,
  LiturgyModuleKind,
  LiturgyReflection,
  LiturgySeason,
} from "@/lib/liturgy/types";
import {
  seedFeastRanks,
  seedFeasts,
  MOCK_GOSPELS,
  seedReflections,
  seedSeasons,
} from "@/lib/liturgy/mock-seed";

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

  const [seasons] = useState(() => seedSeasons());
  const [feasts] = useState(() => seedFeasts());
  const [feastRanks] = useState(() => seedFeastRanks());
  const [gospels] = useState(() => MOCK_GOSPELS);
  const [reflections] = useState(() => seedReflections());

  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<LiturgySeason | null>(
    null,
  );

  const [feastDialogOpen, setFeastDialogOpen] = useState(false);
  const [editingFeast, setEditingFeast] = useState<LiturgyFeast | null>(null);

  const [gospelDialogOpen, setGospelDialogOpen] = useState(false);
  const [editingGospel, setEditingGospel] = useState<LiturgyGospel | null>(
    null,
  );

  const [reflectionDialogOpen, setReflectionDialogOpen] = useState(false);
  const [editingReflection, setEditingReflection] =
    useState<LiturgyReflection | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: LiturgyDeleteTargetType;
    id: string;
    label: string;
  } | null>(null);

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

  function handleConfirmDelete() {
    // Mock UI: đóng dialog, không xóa dữ liệu. Ghép API sau.
    setDeleteTarget(null);
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
      />

      <AdminFeastFormDialog
        open={feastDialogOpen}
        onOpenChange={setFeastDialogOpen}
        editingFeast={editingFeast}
        seasons={seasons}
        feastRanks={feastRanks}
        feasts={feasts}
      />

      <AdminGospelFormDialog
        open={gospelDialogOpen}
        onOpenChange={setGospelDialogOpen}
        editingGospel={editingGospel}
      />

      <AdminReflectionFormDialog
        open={reflectionDialogOpen}
        onOpenChange={setReflectionDialogOpen}
        editingReflection={editingReflection}
      />

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa bản ghi?"
        description={
          deleteTarget
            ? `Bạn sắp xóa “${deleteTarget.label}”. Thao tác này không thể hoàn tác.`
            : ""
        }
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
