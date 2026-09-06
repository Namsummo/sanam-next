"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { AdminPersonFormModal } from "./admin-person-form-modal";
import { AdminFamilyFormModal } from "./admin-family-form-modal";
import { AdminPersonsTable } from "./admin-persons-table";
import { AdminFamiliesTable } from "./admin-families-table";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
  getAllFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
  getAllMembers,
} from "@/shared/services/family-registry-api";
import {
  createEmptyPersonFormValues,
  mapPersonToFormValues,
  formValuesToPerson,
  type PersonFormValues,
} from "./admin-person-form";
import { uploadImage } from "@/shared/services/news-api";
import {
  createEmptyFamilyFormValues,
  mapFamilyToFormValues,
  type FamilyFormValues,
} from "./admin-family-form";
import type { Person, Family, FamilyMember } from "@/lib/family-registry/types";

type Tab = "persons" | "families";

const tabBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium transition-colors";

export function AdminFamilyRegistryManager() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("families");
  const [searchQuery, setSearchQuery] = useState("");

  // Person form
  const [personFormOpen, setPersonFormOpen] = useState(false);
  const [personEditingId, setPersonEditingId] = useState<string | null>(null);
  const [personFormDefaults, setPersonFormDefaults] =
    useState<PersonFormValues>(createEmptyPersonFormValues);

  // Family form
  const [familyFormOpen, setFamilyFormOpen] = useState(false);
  const [familyEditingId, setFamilyEditingId] = useState<string | null>(null);
  const [familyFormDefaults, setFamilyFormDefaults] =
    useState<FamilyFormValues>(createEmptyFamilyFormValues);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "person" | "family";
    id: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load from API on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError("Bạn không có quyền truy cập trang này.");
      setLoading(false);
      return;
    }
    const authToken = token;

    async function initData() {
      try {
        setLoading(true);
        const [fetchedPersons, fetchedFamilies, fetchedMembers] =
          await Promise.all([
            getAllPersons(authToken),
            getAllFamilies(authToken),
            getAllMembers(authToken),
          ]);
        setPersons(fetchedPersons);
        setFamilies(fetchedFamilies);
        setMembers(fetchedMembers);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu từ máy chủ.");
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  function handleOpenNewPerson() {
    setPersonEditingId(null);
    setPersonFormDefaults(createEmptyPersonFormValues());
    setPersonFormOpen(true);
  }

  function handleEditPerson(person: Person) {
    setPersonEditingId(person.id);
    setPersonFormDefaults(mapPersonToFormValues(person));
    setPersonFormOpen(true);
  }

  async function handleUploadPersonImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Không có token truy cập");
    }

    return uploadImage(token, file);
  }

  async function handleSubmitPerson(values: PersonFormValues) {
    const token = getAccessToken();
    if (!token) return;
    const data = formValuesToPerson(values);

    try {
      if (personEditingId) {
        const updated = await updatePerson(token, personEditingId, data);
        setPersons((prev) =>
          prev.map((p) => (p.id === personEditingId ? updated : p)),
        );
      } else {
        const created = await createPerson(token, data);
        setPersons((prev) => [...prev, created]);
      }
      setPersonFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu hồ sơ cá nhân.");
    }
  }

  function handleOpenNewFamily() {
    setFamilyEditingId(null);
    setFamilyFormDefaults(createEmptyFamilyFormValues());
    setFamilyFormOpen(true);
  }

  function handleEditFamily(family: Family) {
    const familyMembers = members.filter((m) => m.familyId === family.id);
    setFamilyEditingId(family.id);
    setFamilyFormDefaults(mapFamilyToFormValues(family, familyMembers));
    setFamilyFormOpen(true);
  }

  async function handleSubmitFamily(values: FamilyFormValues) {
    const token = getAccessToken();
    if (!token) return;

    try {
      if (familyEditingId) {
        const res = await updateFamily(token, familyEditingId, {
          name: values.name,
          headPersonId: values.headPersonId,
          status: values.status,
          statusNote: values.statusNote || null,
          notes: values.notes || null,
          members: values.members.map((m) => ({
            personId: m.personId,
            role: m.role,
            birthOrder: m.birthOrder,
            existingId: m.existingId,
          })),
        });

        setFamilies((prev) =>
          prev.map((f) => (f.id === familyEditingId ? res.family : f)),
        );
        // Refresh members list to sync with backend changes
        const fetchedMembers = await getAllMembers(token);
        setMembers(fetchedMembers);
      } else {
        const res = await createFamily(token, {
          name: values.name,
          headPersonId: values.headPersonId,
          status: values.status,
          statusNote: values.statusNote || null,
          notes: values.notes || null,
          members: values.members.map((m) => ({
            personId: m.personId,
            role: m.role,
            birthOrder: m.birthOrder,
          })),
        });

        setFamilies((prev) => [...prev, res.family]);
        // Refresh members list to sync with backend changes
        const fetchedMembers = await getAllMembers(token);
        setMembers(fetchedMembers);
      }
      setFamilyFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu thông tin gia đình.");
    }
  }

  // ── Delete ───────────────────────────────────────────────────────
  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const token = getAccessToken();
    if (!token) return;
    setDeleting(true);

    try {
      if (deleteTarget.type === "person") {
        await deletePerson(token, deleteTarget.id);
        setPersons((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setMembers((prev) =>
          prev.filter((m) => m.personId !== deleteTarget.id),
        );
      } else if (deleteTarget.type === "family") {
        await deleteFamily(token, deleteTarget.id);
        setFamilies((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        setMembers((prev) =>
          prev.filter((m) => m.familyId !== deleteTarget.id),
        );
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thực hiện xóa.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  // ── Search ───────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase();
  const filteredPersons = q
    ? persons.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          (p.saintName?.toLowerCase().includes(q) ?? false),
      )
    : persons;
  const filteredFamilies = q
    ? families.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.familyCode.toLowerCase().includes(q),
      )
    : families;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4 md:p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Sổ Gia Đình Công Giáo
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý hồ sơ cá nhân và gia đình — Giáo xứ Sa Nam, Giáo phận Bùi Chu
        </p>
      </div>

      {/* Tabs + search + add */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          className={`${tabBtn} ${tab === "families" ? "bg-accent text-white" : "bg-muted text-card-foreground hover:bg-muted/80"}`}
          onClick={() => setTab("families")}
        >
          <Users className="size-4" />
          Gia đình
        </button>
        <button
          type="button"
          className={`${tabBtn} ${tab === "persons" ? "bg-accent text-white" : "bg-muted text-card-foreground hover:bg-muted/80"}`}
          onClick={() => setTab("persons")}
        >
          Hồ sơ cá nhân
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="h-9 rounded-[10px] border border-border bg-card pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-accent px-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            onClick={
              tab === "families" ? handleOpenNewFamily : handleOpenNewPerson
            }
          >
            <Plus className="size-4" />
            {tab === "families" ? "Thêm gia đình" : "Thêm thành viên"}
          </button>
        </div>
      </div>

      {tab === "families" ? (
        <AdminFamiliesTable
          families={filteredFamilies}
          persons={persons}
          members={members}
          onEdit={handleEditFamily}
          onDelete={(id) => setDeleteTarget({ type: "family", id })}
        />
      ) : (
        <AdminPersonsTable
          persons={filteredPersons}
          onEdit={handleEditPerson}
          onDelete={(id) => setDeleteTarget({ type: "person", id })}
        />
      )}

      {/* Modals */}
      <AdminPersonFormModal
        open={personFormOpen}
        defaultValues={personFormDefaults}
        editingId={personEditingId}
        onClose={() => setPersonFormOpen(false)}
        onSubmit={handleSubmitPerson}
        onUploadImage={handleUploadPersonImage}
      />

      <AdminFamilyFormModal
        open={familyFormOpen}
        defaultValues={familyFormDefaults}
        editingId={familyEditingId}
        persons={persons}
        onClose={() => setFamilyFormOpen(false)}
        onSubmit={handleSubmitFamily}
      />

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={
          deleteTarget?.type === "person"
            ? "Xóa hồ sơ cá nhân?"
            : "Xóa gia đình?"
        }
        description={
          deleteTarget?.type === "person"
            ? "Hồ sơ cá nhân và tất cả liên kết gia đình sẽ bị xóa. Hành động này không thể hoàn tác."
            : "Gia đình và danh sách thành viên sẽ bị xóa. Hồ sơ cá nhân không bị ảnh hưởng."
        }
        confirmLabel="Xóa"
        onConfirm={handleConfirmDelete}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
