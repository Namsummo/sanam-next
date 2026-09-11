"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, UserPlus, Check, ChevronDown, User, X } from "lucide-react";
import Image from "next/image";
import type { Person } from "@/lib/family-registry/types";
import { getAllPersons, createPerson } from "@/shared/services/family-registry-api";
import { uploadImage } from "@/shared/services/news-api";
import { getAccessToken } from "@/lib/admin/auth-session";
import { AdminPersonFormModal } from "@/components/admin/family-registry/admin-person-form-modal";
import {
  createEmptyPersonFormValues,
  formValuesToPerson,
  type PersonFormValues,
} from "@/components/admin/family-registry/admin-person-form";

type AdminPersonSelectorProps = {
  value: string | null | undefined; // personId
  onChange: (personId: string, person?: Person) => void;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
};

export function AdminPersonSelector({
  value,
  onChange,
  label = "Chọn hồ sơ cá nhân (Giáo dân)",
  required = false,
  error,
  helperText,
}: AdminPersonSelectorProps) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPersons() {
      const token = getAccessToken();
      if (!token) return;
      try {
        setLoading(true);
        const data = await getAllPersons(token);
        if (isMounted) {
          setPersons(data);
        }
      } catch (err) {
        console.error("Failed to load persons in selector:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPersons();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPerson = useMemo(() => {
    if (!value) return null;
    return persons.find((p) => p.id === value || (p as any)._id === value) || null;
  }, [value, persons]);

  const filteredPersons = useMemo(() => {
    if (!searchQuery.trim()) return persons;
    const q = searchQuery.toLowerCase().trim();
    return persons.filter((p) => {
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchSaint = p.saintName ? p.saintName.toLowerCase().includes(q) : false;
      const matchGiaoHo = p.giaoHo ? p.giaoHo.toLowerCase().includes(q) : false;
      return matchName || matchSaint || matchGiaoHo;
    });
  }, [persons, searchQuery]);

  async function handleQuickCreateSubmit(formValues: PersonFormValues) {
    const token = getAccessToken();
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    try {
      const payload = formValuesToPerson(formValues);
      const created = await createPerson(token, payload);
      setPersons((prev) => [created, ...prev]);
      onChange(created.id, created);
      setQuickCreateOpen(false);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo nhanh hồ sơ cá nhân.");
    }
  }

  async function handleUploadPersonImage(file: File): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("Không có token truy cập");
    return uploadImage(token, file);
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-card-foreground">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setQuickCreateOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Tạo mới giáo dân
          </button>
        </div>
      )}

      {/* Selected Card View */}
      {selectedPerson ? (
        <div className="flex items-center justify-between rounded-[10px] border border-accent/40 bg-accent/5 p-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              {selectedPerson.profileImage ? (
                <Image
                  src={selectedPerson.profileImage}
                  alt={selectedPerson.fullName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-card-foreground">
                {selectedPerson.saintName ? `${selectedPerson.saintName} ` : ""}
                {selectedPerson.fullName}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {selectedPerson.giaoHo && <span>Giáo họ {selectedPerson.giaoHo}</span>}
                {selectedPerson.dateOfBirth && (
                  <span>• Sinh: {selectedPerson.dateOfBirth}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen((prev) => !prev);
                setSearchQuery("");
              }}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10"
            >
              Đổi người
            </button>
            <button
              type="button"
              onClick={() => onChange("", undefined)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
              title="Xóa lựa chọn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Select Button */
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setDropdownOpen((prev) => !prev);
              setSearchQuery("");
            }}
            className={`flex h-10 w-full items-center justify-between rounded-[10px] border bg-background px-3 text-sm transition-colors hover:border-accent ${
              error ? "border-red-500" : "border-border"
            }`}
          >
            <span className="text-muted-foreground">
              {loading ? "Đang tải danh sách..." : "-- Chọn một giáo dân từ hệ thống --"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="relative z-50 mt-1">
          <div
            className="fixed inset-0"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="relative rounded-[12px] border border-border bg-card p-2 shadow-xl">
            {/* Search input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo Tên thánh, Họ tên, Giáo họ..."
                className="h-9 w-full rounded-[8px] border border-border bg-background pl-9 pr-3 text-sm focus:border-accent focus:outline-none"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredPersons.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Không tìm thấy giáo dân phù hợp.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setQuickCreateOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Tạo mới hồ sơ "{searchQuery}"
                    </button>
                  </div>
                </div>
              ) : (
                filteredPersons.map((person) => {
                  const isSelected = person.id === value || (person as any)._id === value;
                  return (
                    <button
                      key={person.id || (person as any)._id}
                      type="button"
                      onClick={() => {
                        onChange(person.id || (person as any)._id, person);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-accent/15 text-accent font-medium"
                          : "hover:bg-muted text-card-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                          {person.profileImage ? (
                            <Image
                              src={person.profileImage}
                              alt={person.fullName}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm">
                            {person.saintName ? `${person.saintName} ` : ""}
                            {person.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {person.giaoHo ? `Gh. ${person.giaoHo}` : "Sa Nam"}
                            {person.dateOfBirth ? ` • ${person.dateOfBirth}` : ""}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-accent" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}

      {/* Quick Create Person Modal */}
      {quickCreateOpen && (
        <AdminPersonFormModal
          open={quickCreateOpen}
          defaultValues={{
            ...createEmptyPersonFormValues(),
            fullName: searchQuery || "",
          }}
          editingId={null}
          onClose={() => setQuickCreateOpen(false)}
          onSubmit={handleQuickCreateSubmit}
          onUploadImage={handleUploadPersonImage}
        />
      )}
    </div>
  );
}
