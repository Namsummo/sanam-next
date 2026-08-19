"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { AdminPersonFormModal } from "./admin-person-form-modal";
import { AdminFamilyFormModal } from "./admin-family-form-modal";
import { AdminPersonsTable } from "./admin-persons-table";
import { AdminFamiliesTable } from "./admin-families-table";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import {
  createEmptyPersonFormValues,
  mapPersonToFormValues,
  formValuesToPerson,
  type PersonFormValues,
} from "./admin-person-form";
import {
  createEmptyFamilyFormValues,
  mapFamilyToFormValues,
  type FamilyFormValues,
} from "./admin-family-form";
import type {
  Person,
  Family,
  FamilyMember,
} from "@/lib/family-registry/types";
import { mockPersons } from "@/lib/family-registry/mock-persons";
import { mockFamilies, mockFamilyMembers } from "@/lib/family-registry/mock-families";

const LS_PERSONS = "fr:persons";
const LS_FAMILIES = "fr:families";
const LS_MEMBERS = "fr:members";

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uuid(): string {
  return crypto.randomUUID();
}

type Tab = "persons" | "families";

const tabBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-sm font-medium transition-colors";

export function AdminFamilyRegistryManager() {
  const [persons, setPersons] = useState<Person[]>(mockPersons);
  const [families, setFamilies] = useState<Family[]>(mockFamilies);
  const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const persistReady = useRef(false);

  const [tab, setTab] = useState<Tab>("families");
  const [searchQuery, setSearchQuery] = useState("");

  // Person form
  const [personFormOpen, setPersonFormOpen] = useState(false);
  const [personEditingId, setPersonEditingId] = useState<string | null>(null);
  const [personFormDefaults, setPersonFormDefaults] = useState<PersonFormValues>(createEmptyPersonFormValues);

  // Family form
  const [familyFormOpen, setFamilyFormOpen] = useState(false);
  const [familyEditingId, setFamilyEditingId] = useState<string | null>(null);
  const [familyFormDefaults, setFamilyFormDefaults] = useState<FamilyFormValues>(createEmptyFamilyFormValues);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: "person" | "family"; id: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Hydrate from localStorage after mount (deferred — avoids sync setState in effect)
  useEffect(() => {
    startTransition(() => {
      setPersons(loadJSON(LS_PERSONS, mockPersons));
      setFamilies(loadJSON(LS_FAMILIES, mockFamilies));
      setMembers(loadJSON(LS_MEMBERS, mockFamilyMembers));
    });
  }, []);

  // Persist — skip first run so we don't overwrite storage before hydration
  useEffect(() => {
    if (!persistReady.current) {
      persistReady.current = true;
      return;
    }
    saveJSON(LS_PERSONS, persons);
  }, [persons]);
  useEffect(() => {
    if (!persistReady.current) return;
    saveJSON(LS_FAMILIES, families);
  }, [families]);
  useEffect(() => {
    if (!persistReady.current) return;
    saveJSON(LS_MEMBERS, members);
  }, [members]);

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

  function handleSubmitPerson(values: PersonFormValues) {
    const now = new Date().toISOString();
    const data = formValuesToPerson(values);

    if (personEditingId) {
      setPersons((prev) =>
        prev.map((p) =>
          p.id === personEditingId ? { ...p, ...data, updatedAt: now } : p,
        ),
      );
    } else {
      const newPerson: Person = {
        id: uuid(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      setPersons((prev) => [...prev, newPerson]);
    }
    setPersonFormOpen(false);
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

  function handleSubmitFamily(values: FamilyFormValues) {
    const now = new Date().toISOString();

    if (familyEditingId) {
      // Update family
      setFamilies((prev) =>
        prev.map((f) =>
          f.id === familyEditingId
            ? { ...f, name: values.name, headPersonId: values.headPersonId, status: values.status, statusNote: values.statusNote || null, notes: values.notes || null, updatedAt: now }
            : f,
        ),
      );

      // Sync members: remove old, add new
      const existingIds = new Set(values.members.filter((m) => m.existingId).map((m) => m.existingId!));
      setMembers((prev) => {
        const kept = prev.filter((m) => m.familyId !== familyEditingId || existingIds.has(m.id));
        const updated = kept.map((m) => {
          if (m.familyId !== familyEditingId) return m;
          const entry = values.members.find((e) => e.existingId === m.id);
          if (!entry) return m;
          return {
            ...m,
            personId: entry.personId,
            role: entry.role,
            birthOrder: entry.role === "child" ? entry.birthOrder : null,
            updatedAt: now,
          };
        });
        const newEntries: FamilyMember[] = values.members
          .filter((e) => !e.existingId)
          .map((e) => ({
            id: uuid(),
            familyId: familyEditingId,
            personId: e.personId,
            role: e.role,
            birthOrder: e.role === "child" ? e.birthOrder : null,
            createdAt: now,
            updatedAt: now,
          }));
        return [...updated, ...newEntries];
      });
    } else {
      // Create family
      const familyId = uuid();
      const newFamily: Family = {
        id: familyId,
        familyCode: `GD-${String(families.length + 1).padStart(3, "0")}`,
        name: values.name,
        headPersonId: values.headPersonId,
        status: values.status,
        statusNote: values.statusNote || null,
        notes: values.notes || null,
        createdAt: now,
        updatedAt: now,
      };
      setFamilies((prev) => [...prev, newFamily]);

      const newMembers: FamilyMember[] = values.members.map((e) => ({
        id: uuid(),
        familyId,
        personId: e.personId,
        role: e.role,
        birthOrder: e.role === "child" ? e.birthOrder : null,
        createdAt: now,
        updatedAt: now,
      }));
      setMembers((prev) => [...prev, ...newMembers]);
    }
    setFamilyFormOpen(false);
  }

  // ── Delete ───────────────────────────────────────────────────────
  function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    if (deleteTarget.type === "person") {
      setPersons((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setMembers((prev) => prev.filter((m) => m.personId !== deleteTarget.id));
    } else if (deleteTarget.type === "family") {
      setFamilies((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setMembers((prev) => prev.filter((m) => m.familyId !== deleteTarget.id));
    }

    setDeleting(false);
    setDeleteTarget(null);
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
    ? families.filter((f) => f.name.toLowerCase().includes(q) || f.familyCode.toLowerCase().includes(q))
    : families;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Sổ Gia Đình Công Giáo</h1>
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
            onClick={tab === "families" ? handleOpenNewFamily : handleOpenNewPerson}
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
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={deleteTarget?.type === "person" ? "Xóa hồ sơ cá nhân?" : "Xóa gia đình?"}
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
