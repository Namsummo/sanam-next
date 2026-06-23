"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { BlogEditor } from "@/components/admin/news/blog-editor";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { AdminOrganizationTermMembersTable } from "./admin-organization-term-members-table";
import { getToken } from "@/lib/admin/mock-auth";
import { uploadImage } from "@/shared/services/news-api";
import { createOrganization, updateOrganization } from "@/lib/organization/api";
import { slugify } from "@/shared/lib/slugify";
import {
  createEmptyExecutiveMember,
  normalizeExecutiveMembers,
  normalizeExecutiveTerms,
} from "@/lib/organization/executive-members";
import {
  downloadMembersExcelTemplate,
  exportMembersToExcel,
  parseMembersFromExcel,
} from "@/lib/organization/members-excel";
import type { Organization, ExecutiveTerm, ExecutiveMember } from "@/lib/organization/types";
import { Input } from "@/components/site/shared/ui/input/input";
import { AdminOutlineButton } from "../shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { AdminClergyNewTermForm } from "@/components/admin/clergy/admin-clergy-new-term-form";
import {
  createExecutiveTerm,
  formatExecutiveTermDisplay,
  getExecutiveTermIds,
  getExecutiveTermKey,
  sortExecutiveTermsNewestFirst,
} from "@/lib/organization/executive-terms";
import type { OrganizationTerm } from "@/lib/organization/types";
import { cn } from "@/lib/utils";

type AdminOrganizationFormProps = {
  organization?: Organization;
};

type FormTab = "info" | "members";

const formTabs: { id: FormTab; label: string }[] = [
  { id: "info", label: "Thông tin đoàn thể" },
  { id: "members", label: "Ban điều hành" },
];

export function AdminOrganizationForm({ organization }: AdminOrganizationFormProps) {
  const router = useRouter();
  const isEdit = !!organization;

  const [activeTab, setActiveTab] = useState<FormTab>("info");
  const [name, setName] = useState(organization?.name ?? "");
  const [slug, setSlug] = useState(organization?.slug ?? "");
  const [image, setImage] = useState<string | null>(organization?.image ?? null);
  const [history, setHistory] = useState(organization?.history ?? "");
  const [isVisible, setIsVisible] = useState(organization?.isVisible ?? true);
  const [terms, setTerms] = useState<ExecutiveTerm[]>(() =>
    normalizeExecutiveTerms(organization?.terms ?? []),
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const importTermIndexRef = useRef<number | null>(null);
  const [showNewTermForm, setShowNewTermForm] = useState(false);

  const sortedTerms = useMemo(() => sortExecutiveTermsNewestFirst(terms), [terms]);
  const totalMembers = useMemo(
    () => terms.reduce((sum, term) => sum + term.members.length, 0),
    [terms],
  );

  const displayedSlug = useMemo(() => {
    if (slugManuallyEdited) return slug;
    if (isEdit) return organization?.slug ?? slug;
    return slugify(name);
  }, [name, slugManuallyEdited, isEdit, slug, organization?.slug]);

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  async function handleImageUpload(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadImage(token, file);
  }

  function handleCreateTerm(term: OrganizationTerm) {
    if (terms.some((existing) => existing._id === term.id)) {
      setError("Khóa này đã tồn tại trong danh sách.");
      return;
    }

    setError("");
    setTerms((current) => [
      ...current,
      createExecutiveTerm(term, { isCurrent: current.length === 0 }),
    ]);
    setShowNewTermForm(false);
    setActiveTab("members");
  }

  function findTermIndex(termKey: string): number {
    return terms.findIndex((term) => getExecutiveTermKey(term) === termKey);
  }

  function handleRemoveTerm(termKey: string) {
    setTerms(terms.filter((term) => getExecutiveTermKey(term) !== termKey));
  }

  function handleUpdateTerm(index: number, updates: Partial<ExecutiveTerm>) {
    setTerms((current) =>
      current.map((term, termIndex) => {
        if (termIndex !== index) {
          return updates.isCurrent ? { ...term, isCurrent: false } : term;
        }

        return { ...term, ...updates };
      }),
    );
  }

  function handleAddMember(termIndex: number) {
    setTerms((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: [
                ...term.members,
                createEmptyExecutiveMember(term.members.length + 1),
              ],
            },
      ),
    );
  }

  function handleRemoveMember(termIndex: number, memberIndex: number) {
    setTerms((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: normalizeExecutiveMembers(
                term.members.filter((_, itemIndex) => itemIndex !== memberIndex),
              ),
            },
      ),
    );
  }

  function handleUpdateMember(
    termIndex: number,
    memberIndex: number,
    updates: Partial<ExecutiveMember>,
  ) {
    setTerms((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: term.members.map((member, itemIndex) =>
                itemIndex !== memberIndex ? member : { ...member, ...updates },
              ),
            },
      ),
    );
  }

  function handleReplaceMembers(termIndex: number, members: ExecutiveMember[]) {
    setTerms((current) =>
      current.map((term, index) =>
        index !== termIndex
          ? term
          : {
              ...term,
              members: normalizeExecutiveMembers(members),
            },
      ),
    );
  }

  function handleExportMembers(termIndex: number) {
    const term = terms[termIndex];
    const termSlug = term._id || slugify(term.name) || `khoa-${termIndex + 1}`;
    exportMembersToExcel(term.members, `thanh-vien-${termSlug}.xlsx`);
  }

  function handleImportMembersClick(termIndex: number) {
    importTermIndexRef.current = termIndex;
    importFileInputRef.current?.click();
  }

  async function handleImportMembersFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const termIndex = importTermIndexRef.current;

    event.target.value = "";

    if (!file || termIndex == null) {
      return;
    }

    setError("");
    setImportMessage("");

    const term = terms[termIndex];
    if (term.members.length > 0) {
      const confirmed = window.confirm(
        "Nhập Excel sẽ thay thế toàn bộ thành viên hiện tại của khóa này. Bạn có muốn tiếp tục?",
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      const { members, errors } = await parseMembersFromExcel(file);

      if (errors.length > 0) {
        setError(errors.join(" "));
        setActiveTab("members");
        return;
      }

      handleReplaceMembers(termIndex, members);
      setImportMessage(`Đã nhập ${members.length} thành viên từ file Excel.`);
      setActiveTab("members");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đọc file Excel.");
      setActiveTab("members");
    } finally {
      importTermIndexRef.current = null;
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Tên đoàn thể không được để trống");
      setActiveTab("info");
      return;
    }

    const invalidTerm = terms.find((term) => !term._id);
    if (invalidTerm) {
      setError("Có khóa không hợp lệ. Vui lòng xóa và tạo lại bằng năm bắt đầu/kết thúc.");
      setActiveTab("members");
      return;
    }

    setSaving(true);

    try {
      const data = {
        name: name.trim(),
        slug: displayedSlug.trim() || undefined,
        image: image || undefined,
        history,
        terms: normalizeExecutiveTerms(terms),
        isVisible,
      };

      if (isEdit && organization) {
        await updateOrganization(organization._id, data);
      } else {
        await createOrganization(data);
      }

      router.push("/admin/organizations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/organizations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về danh sách đoàn thể
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-card-foreground">
        {isEdit ? "Chỉnh sửa đoàn thể" : "Thêm đoàn thể mới"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 pb-20">
        <input
          ref={importFileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          aria-label="Chọn file Excel thành viên"
          onChange={handleImportMembersFile}
        />

        {error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {importMessage ? (
          <div className="rounded-[12px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {importMessage}
          </div>
        ) : null}

        <div className="flex gap-1 border-b border-border">
          {formTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-card-foreground",
              )}
            >
              {tab.label}
              {tab.id === "members" && totalMembers > 0 ? (
                <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {totalMembers}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {activeTab === "info" ? (
          <div className="rounded-[16px] border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-card-foreground">Thông tin chung</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Tên đoàn thể *
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="VD: Ca đoàn Têrêxa"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-muted-foreground">
                  Đường dẫn
                </label>
                <Input
                  type="text"
                  value={displayedSlug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  placeholder="tu-dong-tao-tu-ten"
                  className="bg-background"
                />
              </div>

              <div className="flex items-end">
                <label className="inline-flex h-11 w-full cursor-pointer items-center gap-2 rounded-[10px] border border-border bg-background px-3 text-sm text-card-foreground transition-colors hover:border-accent">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(event) => setIsVisible(event.target.checked)}
                    className="size-4 shrink-0 accent-accent"
                  />
                  <span>Hiển thị trên website</span>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Ảnh đoàn thể
              </label>
              <ImageUploader value={image} onChange={setImage} onUpload={handleImageUpload} />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Lịch sử hình thành
              </label>
              <BlogEditor content={history} onChange={setHistory} />
            </div>
          </div>
        ) : null}

        {activeTab === "members" ? (
          <div className="rounded-[16px] border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Ban điều hành theo khóa</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nhập hàng loạt bằng Excel. Bảng hỗ trợ tìm kiếm và phân trang khi có nhiều thành viên.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTermForm((open) => !open)}
                className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Plus className="size-4" />
                Thêm khóa mới
              </button>
            </div>

            {showNewTermForm ? (
              <AdminClergyNewTermForm
                existingTermIds={getExecutiveTermIds(terms)}
                onClose={() => setShowNewTermForm(false)}
                onCreated={handleCreateTerm}
              />
            ) : null}

            {terms.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Chưa có khóa nào. Chọn năm bắt đầu và kết thúc để tạo khóa mới.
              </p>
            ) : (
              <div className="space-y-8">
                {sortedTerms.map((term) => {
                  const termKey = getExecutiveTermKey(term);
                  const tIdx = findTermIndex(termKey);

                  return (
                    <div
                      key={termKey}
                      className="rounded-[12px] border border-border bg-background p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                            Khóa nhiệm kỳ
                          </label>
                          <div className="rounded-[8px] border border-border bg-card px-3 py-2.5">
                            <p className="text-sm font-medium text-card-foreground">
                              {formatExecutiveTermDisplay(term)}
                            </p>
                            {term._id ? (
                              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                {term._id}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleUpdateTerm(tIdx, { isCurrent: !term.isCurrent })}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-medium transition-colors",
                              term.isCurrent
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-border bg-card text-muted-foreground hover:bg-muted",
                            )}
                          >
                            {term.isCurrent ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <Circle className="size-4" />
                            )}
                            {term.isCurrent ? "Khóa hiện tại" : "Đặt làm khóa hiện tại"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTerm(termKey)}
                            className="rounded-[8px] p-2 text-red-500 transition-colors hover:bg-red-50"
                            title="Xóa khóa"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>

                      <AdminOrganizationTermMembersTable
                        termIndex={tIdx}
                        members={term.members}
                        onAddMember={() => handleAddMember(tIdx)}
                        onRemoveMember={(memberIndex) => handleRemoveMember(tIdx, memberIndex)}
                        onUpdateMember={(memberIndex, updates) =>
                          handleUpdateMember(tIdx, memberIndex, updates)
                        }
                        onDownloadTemplate={downloadMembersExcelTemplate}
                        onImport={() => handleImportMembersClick(tIdx)}
                        onExport={() => handleExportMembers(tIdx)}
                        onUploadImage={handleImageUpload}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
          <AdminOutlineButton
            type="button"
            onClick={() => router.push("/admin/organizations")}
            className="h-12"
          >
            Hủy
          </AdminOutlineButton>
          <Button
            type="submit"
            variant="primary"
            showIcon={false}
            disabled={saving}
            className="h-12"
          >
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm đoàn thể"}
          </Button>
        </div>
      </form>
    </div>
  );
}
